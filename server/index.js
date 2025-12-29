import express from 'express';
import cors from 'cors';
import Stripe from 'stripe';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import crypto from 'crypto';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Environment configuration
const NODE_ENV = process.env.NODE_ENV || 'development';
const IS_PRODUCTION = NODE_ENV === 'production';

/**
 * Conditional logger - only logs in development or when DEBUG is enabled
 */
const logger = {
  info: (...args) => {
    if (!IS_PRODUCTION || process.env.DEBUG) console.log('[INFO]', ...args);
  },
  warn: (...args) => {
    console.warn('[WARN]', ...args);
  },
  error: (...args) => {
    console.error('[ERROR]', ...args);
  },
  debug: (...args) => {
    if (!IS_PRODUCTION) console.log('[DEBUG]', ...args);
  }
};

/**
 * Validate required environment variables at startup
 */
const validateEnv = () => {
  const warnings = [];
  const errors = [];

  // Check Stripe key
  const stripeKey = process.env.STRIPE_SECRET_KEY || process.env.STRIPE_API;
  if (!stripeKey) {
    warnings.push('No Stripe API key found (STRIPE_SECRET_KEY or STRIPE_API). Stripe operations will fail.');
  }

  // Check webhook secret in production
  if (IS_PRODUCTION && !process.env.STRIPE_WEBHOOK_SECRET) {
    warnings.push('STRIPE_WEBHOOK_SECRET not set. Webhook signature verification will fail.');
  }

  // Check API key for authentication in production
  if (IS_PRODUCTION && !process.env.API_KEY) {
    warnings.push('API_KEY not set. API authentication is disabled. Consider setting API_KEY for production.');
  }

  // Log warnings
  warnings.forEach(w => logger.warn(w));

  // Throw on critical errors
  if (errors.length > 0) {
    throw new Error(`Configuration errors:\n${errors.join('\n')}`);
  }

  return { stripeKey };
};

// Validate environment on startup
const { stripeKey } = validateEnv();

const app = express();
const PORT = process.env.PORT || 3001;

// Initialize Stripe with secret key
const stripe = stripeKey ? new Stripe(stripeKey) : null;

/**
 * API Key authentication middleware
 * Validates API key from header or query parameter
 */
const authenticateApiKey = (req, res, next) => {
  // Skip auth in development if no API_KEY is set
  if (!process.env.API_KEY) {
    return next();
  }

  // Get API key from header or query
  const apiKey = req.headers['x-api-key'] || req.query.apiKey;

  if (!apiKey) {
    return res.status(401).json({ error: 'API key required. Provide via X-API-Key header.' });
  }

  // Constant-time comparison to prevent timing attacks
  const isValid = crypto.timingSafeEqual(
    Buffer.from(apiKey),
    Buffer.from(process.env.API_KEY)
  );

  if (!isValid) {
    return res.status(403).json({ error: 'Invalid API key' });
  }

  next();
};

/**
 * Check if Stripe is configured middleware
 */
const requireStripe = (req, res, next) => {
  if (!stripe) {
    return res.status(503).json({
      error: 'Stripe is not configured. Set STRIPE_SECRET_KEY or STRIPE_API environment variable.'
    });
  }
  next();
};

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));

// Webhook endpoint needs raw body - must be before express.json()
// Note: Webhooks are authenticated by Stripe signature, not API key
app.post('/api/webhooks/stripe', express.raw({ type: 'application/json' }), async (req, res) => {
  if (!stripe) {
    return res.status(503).json({ error: 'Stripe not configured' });
  }

  const sig = req.headers['stripe-signature'];
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
  } catch (err) {
    logger.error('Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  switch (event.type) {
    case 'payment_intent.succeeded':
      logger.info('PaymentIntent succeeded:', event.data.object.id);
      break;
    case 'payment_intent.payment_failed':
      logger.warn('PaymentIntent failed:', event.data.object.id);
      break;
    case 'customer.subscription.created':
      logger.info('Subscription created:', event.data.object.id);
      break;
    case 'customer.subscription.updated':
      logger.info('Subscription updated:', event.data.object.id);
      break;
    case 'customer.subscription.deleted':
      logger.info('Subscription cancelled:', event.data.object.id);
      break;
    case 'invoice.paid':
      logger.info('Invoice paid:', event.data.object.id);
      break;
    case 'invoice.payment_failed':
      logger.warn('Invoice payment failed:', event.data.object.id);
      break;
    default:
      logger.debug(`Unhandled event type: ${event.type}`);
  }

  res.json({ received: true });
});

// JSON body parser for other routes
app.use(express.json());

// Health check - no auth required
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', stripe: !!stripe, environment: NODE_ENV });
});

// Apply authentication to all API routes (except health and webhooks)
app.use('/api/customers', authenticateApiKey, requireStripe);
app.use('/api/payment-intents', authenticateApiKey, requireStripe);
app.use('/api/subscriptions', authenticateApiKey, requireStripe);
app.use('/api/products', authenticateApiKey, requireStripe);
app.use('/api/invoices', authenticateApiKey, requireStripe);
app.use('/api/setup-intents', authenticateApiKey, requireStripe);
app.use('/api/payment-methods', authenticateApiKey, requireStripe);
app.use('/api/billing-portal', authenticateApiKey, requireStripe);

// Create a customer
app.post('/api/customers', async (req, res) => {
  try {
    const { email, name, metadata } = req.body;
    const customer = await stripe.customers.create({
      email,
      name,
      metadata
    });
    res.json(customer);
  } catch (error) {
    logger.error('Error creating customer:', error.message);
    res.status(500).json({ error: error.message });
  }
});

// Get customer by ID
app.get('/api/customers/:customerId', async (req, res) => {
  try {
    const { customerId } = req.params;
    const customer = await stripe.customers.retrieve(customerId);
    res.json(customer);
  } catch (error) {
    logger.error('Error retrieving customer:', error.message);
    res.status(500).json({ error: error.message });
  }
});

// Create a payment intent for one-time payments
app.post('/api/payment-intents', async (req, res) => {
  try {
    const { amount, currency = 'usd', customerId, metadata } = req.body;

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to cents
      currency,
      customer: customerId,
      metadata,
      automatic_payment_methods: {
        enabled: true,
      },
    });

    res.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id
    });
  } catch (error) {
    logger.error('Error creating payment intent:', error.message);
    res.status(500).json({ error: error.message });
  }
});

// Get payment intent status
app.get('/api/payment-intents/:paymentIntentId', async (req, res) => {
  try {
    const { paymentIntentId } = req.params;
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
    res.json(paymentIntent);
  } catch (error) {
    logger.error('Error retrieving payment intent:', error.message);
    res.status(500).json({ error: error.message });
  }
});

// Create a subscription
app.post('/api/subscriptions', async (req, res) => {
  try {
    const { customerId, priceId, paymentMethodId } = req.body;

    // Attach payment method to customer if provided
    if (paymentMethodId) {
      await stripe.paymentMethods.attach(paymentMethodId, {
        customer: customerId,
      });

      // Set as default payment method
      await stripe.customers.update(customerId, {
        invoice_settings: {
          default_payment_method: paymentMethodId,
        },
      });
    }

    // Create the subscription
    const subscription = await stripe.subscriptions.create({
      customer: customerId,
      items: [{ price: priceId }],
      payment_behavior: 'default_incomplete',
      payment_settings: {
        save_default_payment_method: 'on_subscription'
      },
      expand: ['latest_invoice.payment_intent'],
    });

    res.json({
      subscriptionId: subscription.id,
      clientSecret: subscription.latest_invoice?.payment_intent?.client_secret,
      status: subscription.status
    });
  } catch (error) {
    logger.error('Error creating subscription:', error.message);
    res.status(500).json({ error: error.message });
  }
});

// Get subscription details
app.get('/api/subscriptions/:subscriptionId', async (req, res) => {
  try {
    const { subscriptionId } = req.params;
    const subscription = await stripe.subscriptions.retrieve(subscriptionId, {
      expand: ['items.data.price.product', 'latest_invoice']
    });
    res.json(subscription);
  } catch (error) {
    logger.error('Error retrieving subscription:', error.message);
    res.status(500).json({ error: error.message });
  }
});

// List customer subscriptions
app.get('/api/customers/:customerId/subscriptions', async (req, res) => {
  try {
    const { customerId } = req.params;
    const subscriptions = await stripe.subscriptions.list({
      customer: customerId,
      expand: ['data.items.data.price.product']
    });
    res.json(subscriptions);
  } catch (error) {
    logger.error('Error listing subscriptions:', error.message);
    res.status(500).json({ error: error.message });
  }
});

// Cancel subscription
app.post('/api/subscriptions/:subscriptionId/cancel', async (req, res) => {
  try {
    const { subscriptionId } = req.params;
    const { cancelAtPeriodEnd = true } = req.body;

    let subscription;
    if (cancelAtPeriodEnd) {
      subscription = await stripe.subscriptions.update(subscriptionId, {
        cancel_at_period_end: true
      });
    } else {
      subscription = await stripe.subscriptions.cancel(subscriptionId);
    }

    res.json(subscription);
  } catch (error) {
    logger.error('Error cancelling subscription:', error.message);
    res.status(500).json({ error: error.message });
  }
});

// Resume subscription (if cancelled at period end)
app.post('/api/subscriptions/:subscriptionId/resume', async (req, res) => {
  try {
    const { subscriptionId } = req.params;
    const subscription = await stripe.subscriptions.update(subscriptionId, {
      cancel_at_period_end: false
    });
    res.json(subscription);
  } catch (error) {
    logger.error('Error resuming subscription:', error.message);
    res.status(500).json({ error: error.message });
  }
});

// List available products and prices
app.get('/api/products', async (req, res) => {
  try {
    const products = await stripe.products.list({
      active: true,
      expand: ['data.default_price']
    });
    res.json(products);
  } catch (error) {
    logger.error('Error listing products:', error.message);
    res.status(500).json({ error: error.message });
  }
});

// List prices for a product
app.get('/api/products/:productId/prices', async (req, res) => {
  try {
    const { productId } = req.params;
    const prices = await stripe.prices.list({
      product: productId,
      active: true
    });
    res.json(prices);
  } catch (error) {
    logger.error('Error listing prices:', error.message);
    res.status(500).json({ error: error.message });
  }
});

// List customer invoices
app.get('/api/customers/:customerId/invoices', async (req, res) => {
  try {
    const { customerId } = req.params;
    const { limit = 10 } = req.query;

    const invoices = await stripe.invoices.list({
      customer: customerId,
      limit: parseInt(limit)
    });
    res.json(invoices);
  } catch (error) {
    logger.error('Error listing invoices:', error.message);
    res.status(500).json({ error: error.message });
  }
});

// Get invoice PDF URL
app.get('/api/invoices/:invoiceId/pdf', async (req, res) => {
  try {
    const { invoiceId } = req.params;
    const invoice = await stripe.invoices.retrieve(invoiceId);
    res.json({ pdfUrl: invoice.invoice_pdf });
  } catch (error) {
    logger.error('Error getting invoice PDF:', error.message);
    res.status(500).json({ error: error.message });
  }
});

// Create a setup intent for saving payment methods
app.post('/api/setup-intents', async (req, res) => {
  try {
    const { customerId } = req.body;
    const setupIntent = await stripe.setupIntents.create({
      customer: customerId,
      payment_method_types: ['card'],
    });
    res.json({ clientSecret: setupIntent.client_secret });
  } catch (error) {
    logger.error('Error creating setup intent:', error.message);
    res.status(500).json({ error: error.message });
  }
});

// List customer payment methods
app.get('/api/customers/:customerId/payment-methods', async (req, res) => {
  try {
    const { customerId } = req.params;
    const paymentMethods = await stripe.paymentMethods.list({
      customer: customerId,
      type: 'card'
    });
    res.json(paymentMethods);
  } catch (error) {
    logger.error('Error listing payment methods:', error.message);
    res.status(500).json({ error: error.message });
  }
});

// Delete a payment method
app.delete('/api/payment-methods/:paymentMethodId', async (req, res) => {
  try {
    const { paymentMethodId } = req.params;
    await stripe.paymentMethods.detach(paymentMethodId);
    res.json({ success: true });
  } catch (error) {
    logger.error('Error deleting payment method:', error.message);
    res.status(500).json({ error: error.message });
  }
});

// Create a billing portal session
app.post('/api/billing-portal', async (req, res) => {
  try {
    const { customerId, returnUrl } = req.body;
    const session = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: returnUrl || process.env.FRONTEND_URL
    });
    res.json({ url: session.url });
  } catch (error) {
    logger.error('Error creating billing portal session:', error.message);
    res.status(500).json({ error: error.message });
  }
});

// Serve static files from the dist directory (production build)
const distPath = path.join(__dirname, '..', 'dist');
app.use(express.static(distPath));

// SPA fallback - serve index.html for all non-API routes
app.get('*', (req, res) => {
  // Don't serve index.html for API routes
  if (req.path.startsWith('/api')) {
    return res.status(404).json({ error: 'Not found' });
  }
  res.sendFile(path.join(distPath, 'index.html'));
});

app.listen(PORT, () => {
  logger.info(`ZeroERP server running on port ${PORT}`);
  logger.info(`Environment: ${NODE_ENV}`);
  logger.debug(`Serving static files from: ${distPath}`);
  if (stripe) {
    logger.info('Stripe API configured successfully');
  }
  if (process.env.API_KEY) {
    logger.info('API key authentication enabled');
  } else {
    logger.warn('API key authentication disabled (set API_KEY env var to enable)');
  }
});

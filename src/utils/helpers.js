/**
 * Helper utility functions
 */

/**
 * Calculate total stock for an inventory item
 * @param {Object} item - Inventory item with stock object
 * @returns {number} Total stock count
 */
export const getTotalStock = (item) => {
  return item.stock.warehouse + item.stock.store;
};

/**
 * Check if item is low on stock
 * @param {Object} item - Inventory item
 * @returns {boolean} True if stock is below safety stock
 */
export const isLowStock = (item) => {
  return getTotalStock(item) < item.safetyStock;
};

/**
 * Calculate profit margin percentage
 * @param {number} price - Selling price
 * @param {number} cost - Cost price
 * @returns {number} Margin percentage
 */
export const calculateMargin = (price, cost) => {
  if (price === 0) return 0;
  return Math.round(((price - cost) / price) * 100);
};

/**
 * Format currency value
 * @param {number} value - Numeric value
 * @returns {string} Formatted currency string
 */
export const formatCurrency = (value) => {
  return `$${value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};

/**
 * Generate a unique SKU ID with timestamp to prevent collisions
 * @returns {string} Generated SKU ID
 */
export const generateSKU = () => {
  const timestamp = Date.now().toString(36);
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  return `SKU-${timestamp}-${random}`.toUpperCase();
};

/**
 * Generate a unique Order ID with timestamp to prevent collisions
 * @returns {string} Generated Order ID
 */
export const generateOrderId = () => {
  const timestamp = Date.now().toString(36);
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  return `ORD-${timestamp}-${random}`.toUpperCase();
};

/**
 * Generate a unique PO ID with timestamp to prevent collisions
 * @returns {string} Generated PO ID
 */
export const generatePOId = () => {
  const timestamp = Date.now().toString(36);
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  return `PO-${timestamp}-${random}`.toUpperCase();
};

/**
 * Validate inventory form data
 * @param {Object} data - Form data to validate
 * @returns {Object} Object with errors (empty if valid)
 */
export const validateInventoryForm = (data) => {
  const errors = {};

  if (!data.name?.trim()) {
    errors.name = 'Product name is required';
  }

  if (!data.category?.trim()) {
    errors.category = 'Category is required';
  }

  if (!data.vendor?.trim()) {
    errors.vendor = 'Vendor is required';
  }

  if (data.cost < 0) {
    errors.cost = 'Cost cannot be negative';
  }

  if (data.price < 0) {
    errors.price = 'Price cannot be negative';
  }

  if (data.price > 0 && data.cost > 0 && data.price <= data.cost) {
    errors.price = 'Price should be greater than cost';
  }

  if (data.warehouse < 0) {
    errors.warehouse = 'Warehouse stock cannot be negative';
  }

  if (data.store < 0) {
    errors.store = 'Store stock cannot be negative';
  }

  if (data.safetyStock < 0) {
    errors.safetyStock = 'Safety stock cannot be negative';
  }

  return errors;
};

/**
 * Validate order form data
 * @param {Object} data - Order form data to validate
 * @returns {Object} Object with errors (empty if valid)
 */
export const validateOrderForm = (data) => {
  const errors = {};

  if (!data.customer?.trim()) {
    errors.customer = 'Customer name is required';
  }

  if (!data.channel?.trim()) {
    errors.channel = 'Sales channel is required';
  }

  if (!data.items || data.items.length === 0) {
    errors.items = 'At least one item is required';
  } else {
    // Validate each item
    data.items.forEach((item, index) => {
      if (!item.sku?.trim()) {
        errors[`items.${index}.sku`] = 'SKU is required';
      }
      if (item.quantity <= 0) {
        errors[`items.${index}.quantity`] = 'Quantity must be greater than 0';
      }
      if (item.price < 0) {
        errors[`items.${index}.price`] = 'Price cannot be negative';
      }
    });
  }

  if (data.total < 0) {
    errors.total = 'Total cannot be negative';
  }

  return errors;
};

/**
 * Validate purchase order form data
 * @param {Object} data - Purchase order form data to validate
 * @returns {Object} Object with errors (empty if valid)
 */
export const validatePurchaseOrderForm = (data) => {
  const errors = {};

  if (!data.vendor?.trim()) {
    errors.vendor = 'Vendor is required';
  }

  if (!data.items || data.items.length === 0) {
    errors.items = 'At least one item is required';
  } else {
    // Validate each item
    data.items.forEach((item, index) => {
      if (!item.name?.trim()) {
        errors[`items.${index}.name`] = 'Item name is required';
      }
      if (item.quantity <= 0) {
        errors[`items.${index}.quantity`] = 'Quantity must be greater than 0';
      }
      if (item.unitCost < 0) {
        errors[`items.${index}.unitCost`] = 'Unit cost cannot be negative';
      }
    });
  }

  if (data.total < 0) {
    errors.total = 'Total cannot be negative';
  }

  // Validate expected delivery date if provided
  if (data.expectedDelivery) {
    const deliveryDate = new Date(data.expectedDelivery);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (deliveryDate < today) {
      errors.expectedDelivery = 'Expected delivery date cannot be in the past';
    }
  }

  return errors;
};

/**
 * Check if an object has any errors
 * @param {Object} errors - Errors object from validation
 * @returns {boolean} True if there are any errors
 */
export const hasValidationErrors = (errors) => {
  return Object.keys(errors).length > 0;
};

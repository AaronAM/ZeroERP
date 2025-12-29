import { describe, it, expect } from 'vitest';
import {
  getTotalStock,
  isLowStock,
  calculateMargin,
  formatCurrency,
  generateSKU,
  generateOrderId,
  generatePOId,
  validateInventoryForm,
  validateOrderForm,
  validatePurchaseOrderForm,
  hasValidationErrors,
} from './helpers';

describe('getTotalStock', () => {
  it('should calculate total stock from warehouse and store', () => {
    const item = { stock: { warehouse: 50, store: 30 } };
    expect(getTotalStock(item)).toBe(80);
  });

  it('should handle zero stock', () => {
    const item = { stock: { warehouse: 0, store: 0 } };
    expect(getTotalStock(item)).toBe(0);
  });
});

describe('isLowStock', () => {
  it('should return true when total stock is below safety stock', () => {
    const item = { stock: { warehouse: 5, store: 3 }, safetyStock: 10 };
    expect(isLowStock(item)).toBe(true);
  });

  it('should return false when total stock is at or above safety stock', () => {
    const item = { stock: { warehouse: 10, store: 5 }, safetyStock: 10 };
    expect(isLowStock(item)).toBe(false);
  });
});

describe('calculateMargin', () => {
  it('should calculate margin percentage correctly', () => {
    expect(calculateMargin(100, 60)).toBe(40);
    expect(calculateMargin(50, 25)).toBe(50);
  });

  it('should return 0 when price is 0', () => {
    expect(calculateMargin(0, 10)).toBe(0);
  });

  it('should handle 100% margin', () => {
    expect(calculateMargin(100, 0)).toBe(100);
  });
});

describe('formatCurrency', () => {
  it('should format currency with dollar sign', () => {
    const result = formatCurrency(1234.56);
    expect(result).toMatch(/\$1,234\.56/);
  });

  it('should handle zero', () => {
    const result = formatCurrency(0);
    expect(result).toMatch(/\$0\.00/);
  });
});

describe('generateSKU', () => {
  it('should generate a SKU with correct format', () => {
    const sku = generateSKU();
    expect(sku).toMatch(/^SKU-[A-Z0-9]+-[0-9]{3}$/);
  });

  it('should generate unique SKUs', () => {
    const sku1 = generateSKU();
    const sku2 = generateSKU();
    expect(sku1).not.toBe(sku2);
  });
});

describe('generateOrderId', () => {
  it('should generate an order ID with correct format', () => {
    const orderId = generateOrderId();
    expect(orderId).toMatch(/^ORD-[A-Z0-9]+-[0-9]{3}$/);
  });
});

describe('generatePOId', () => {
  it('should generate a PO ID with correct format', () => {
    const poId = generatePOId();
    expect(poId).toMatch(/^PO-[A-Z0-9]+-[0-9]{3}$/);
  });
});

describe('validateInventoryForm', () => {
  it('should return empty errors for valid data', () => {
    const validData = {
      name: 'Test Product',
      category: 'Electronics',
      vendor: 'Test Vendor',
      cost: 50,
      price: 100,
      warehouse: 10,
      store: 5,
      safetyStock: 5,
    };
    const errors = validateInventoryForm(validData);
    expect(hasValidationErrors(errors)).toBe(false);
  });

  it('should require product name', () => {
    const data = { name: '', category: 'Test', vendor: 'Test' };
    const errors = validateInventoryForm(data);
    expect(errors.name).toBeDefined();
  });

  it('should require category', () => {
    const data = { name: 'Test', category: '', vendor: 'Test' };
    const errors = validateInventoryForm(data);
    expect(errors.category).toBeDefined();
  });

  it('should require vendor', () => {
    const data = { name: 'Test', category: 'Test', vendor: '' };
    const errors = validateInventoryForm(data);
    expect(errors.vendor).toBeDefined();
  });

  it('should not allow negative cost', () => {
    const data = { name: 'Test', category: 'Test', vendor: 'Test', cost: -10 };
    const errors = validateInventoryForm(data);
    expect(errors.cost).toBeDefined();
  });

  it('should not allow price less than cost', () => {
    const data = { name: 'Test', category: 'Test', vendor: 'Test', cost: 100, price: 50 };
    const errors = validateInventoryForm(data);
    expect(errors.price).toBeDefined();
  });
});

describe('validateOrderForm', () => {
  it('should return empty errors for valid data', () => {
    const validData = {
      customer: 'John Doe',
      channel: 'Shopify',
      items: [{ sku: 'SKU-001', quantity: 2, price: 50 }],
      total: 100,
    };
    const errors = validateOrderForm(validData);
    expect(hasValidationErrors(errors)).toBe(false);
  });

  it('should require customer name', () => {
    const data = { customer: '', channel: 'Shopify', items: [], total: 0 };
    const errors = validateOrderForm(data);
    expect(errors.customer).toBeDefined();
  });

  it('should require sales channel', () => {
    const data = { customer: 'John', channel: '', items: [], total: 0 };
    const errors = validateOrderForm(data);
    expect(errors.channel).toBeDefined();
  });

  it('should require at least one item', () => {
    const data = { customer: 'John', channel: 'Shopify', items: [], total: 0 };
    const errors = validateOrderForm(data);
    expect(errors.items).toBeDefined();
  });

  it('should validate item quantity', () => {
    const data = {
      customer: 'John',
      channel: 'Shopify',
      items: [{ sku: 'SKU-001', quantity: 0, price: 50 }],
      total: 0,
    };
    const errors = validateOrderForm(data);
    expect(errors['items.0.quantity']).toBeDefined();
  });
});

describe('validatePurchaseOrderForm', () => {
  it('should return empty errors for valid data', () => {
    const validData = {
      vendor: 'Test Vendor',
      items: [{ name: 'Item 1', quantity: 10, unitCost: 25 }],
      total: 250,
    };
    const errors = validatePurchaseOrderForm(validData);
    expect(hasValidationErrors(errors)).toBe(false);
  });

  it('should require vendor', () => {
    const data = { vendor: '', items: [], total: 0 };
    const errors = validatePurchaseOrderForm(data);
    expect(errors.vendor).toBeDefined();
  });

  it('should require at least one item', () => {
    const data = { vendor: 'Test', items: [], total: 0 };
    const errors = validatePurchaseOrderForm(data);
    expect(errors.items).toBeDefined();
  });

  it('should not allow past expected delivery date', () => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const data = {
      vendor: 'Test',
      items: [{ name: 'Item', quantity: 1, unitCost: 10 }],
      total: 10,
      expectedDelivery: yesterday.toISOString().split('T')[0],
    };
    const errors = validatePurchaseOrderForm(data);
    expect(errors.expectedDelivery).toBeDefined();
  });
});

describe('hasValidationErrors', () => {
  it('should return false for empty object', () => {
    expect(hasValidationErrors({})).toBe(false);
  });

  it('should return true for object with errors', () => {
    expect(hasValidationErrors({ name: 'Name is required' })).toBe(true);
  });
});

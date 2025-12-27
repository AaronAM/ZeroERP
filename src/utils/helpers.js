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

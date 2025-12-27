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
 * Generate a unique SKU ID
 * @returns {string} Generated SKU ID
 */
export const generateSKU = () => {
  return `SKU-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`;
};

/**
 * Generate a unique Order ID
 * @returns {string} Generated Order ID
 */
export const generateOrderId = () => {
  return `ORD-${Math.floor(Math.random() * 10000)}`;
};

/**
 * Generate a unique PO ID
 * @returns {string} Generated PO ID
 */
export const generatePOId = () => {
  return `PO-${Math.floor(9000 + Math.random() * 1000)}`;
};

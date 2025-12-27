/**
 * Export utilities for data download functionality
 */

/**
 * Generates and downloads a CSV file from inventory data
 * @param {Array} inventory - Array of inventory items
 */
export const exportInventoryToCSV = (inventory) => {
  const headers = ['ID,Name,Category,Warehouse Stock,Store Stock,Safety Stock,Cost,Price,Vendor'];

  const rows = inventory.map(item => {
    return [
      item.id,
      `"${item.name}"`,
      item.category,
      item.stock.warehouse,
      item.stock.store,
      item.safetyStock,
      item.cost.toFixed(2),
      item.price.toFixed(2),
      item.vendor
    ].join(',');
  });

  const csvString = [headers, ...rows].join('\n');
  downloadFile(csvString, 'inventory_export.csv', 'text/csv');
};

/**
 * Generates and downloads an orders CSV file
 * @param {Array} orders - Array of order items
 */
export const exportOrdersToCSV = (orders) => {
  const headers = ['Order ID,Customer,Channel,Date,Total,Status,Items'];

  const rows = orders.map(order => {
    return [
      order.id,
      `"${order.customer}"`,
      order.channel,
      order.date,
      order.total.toFixed(2),
      order.status,
      order.items
    ].join(',');
  });

  const csvString = [headers, ...rows].join('\n');
  downloadFile(csvString, 'orders_export.csv', 'text/csv');
};

/**
 * Generates and downloads a purchase orders CSV file
 * @param {Array} purchaseOrders - Array of purchase order items
 */
export const exportPurchaseOrdersToCSV = (purchaseOrders) => {
  const headers = ['PO ID,Vendor,Status,Expected Date,Total'];

  const rows = purchaseOrders.map(po => {
    return [
      po.id,
      `"${po.vendor}"`,
      po.status,
      po.expected,
      po.total.toFixed(2)
    ].join(',');
  });

  const csvString = [headers, ...rows].join('\n');
  downloadFile(csvString, 'purchase_orders_export.csv', 'text/csv');
};

/**
 * Helper function to trigger file download
 * @param {string} content - File content
 * @param {string} filename - Name of the file
 * @param {string} mimeType - MIME type of the file
 */
const downloadFile = (content, filename, mimeType) => {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

import { useState, useMemo, useEffect } from 'react';
import { INITIAL_PURCHASE_ORDERS } from '../data';

const STORAGE_KEY = 'zeroerp_purchase_orders';

/**
 * Load purchase orders from localStorage or return initial data
 */
const loadPurchaseOrders = () => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (error) {
    console.error('Failed to load purchase orders from localStorage:', error);
  }
  return INITIAL_PURCHASE_ORDERS;
};

/**
 * Custom hook for purchase orders state management
 */
export const usePurchaseOrders = () => {
  const [purchaseOrders, setPurchaseOrders] = useState(loadPurchaseOrders);

  // Persist purchase orders to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(purchaseOrders));
    } catch (error) {
      console.error('Failed to save purchase orders to localStorage:', error);
    }
  }, [purchaseOrders]);

  // Derived state
  const pendingPOs = useMemo(() =>
    purchaseOrders.filter(po => po.status === 'Ordered'),
    [purchaseOrders]
  );

  const receivedPOs = useMemo(() =>
    purchaseOrders.filter(po => po.status === 'Received'),
    [purchaseOrders]
  );

  const totalPOValue = useMemo(() =>
    purchaseOrders.reduce((acc, po) => acc + po.total, 0),
    [purchaseOrders]
  );

  // Actions
  const receivePO = (poId) => {
    setPurchaseOrders(prev => prev.map(p =>
      p.id === poId ? { ...p, status: 'Received' } : p
    ));
    return poId;
  };

  const addPurchaseOrder = (poData) => {
    setPurchaseOrders(prev => [...prev, poData]);
    return poData;
  };

  return {
    // State
    purchaseOrders,

    // Derived state
    pendingPOs,
    receivedPOs,
    totalPOValue,

    // Actions
    receivePO,
    addPurchaseOrder,
  };
};

import { useState, useMemo } from 'react';
import { INITIAL_PURCHASE_ORDERS } from '../data';

/**
 * Custom hook for purchase orders state management
 */
export const usePurchaseOrders = () => {
  const [purchaseOrders, setPurchaseOrders] = useState(INITIAL_PURCHASE_ORDERS);

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

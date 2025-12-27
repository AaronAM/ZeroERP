import { useState, useMemo } from 'react';
import { INITIAL_ORDERS } from '../data';

/**
 * Custom hook for orders state management
 */
export const useOrders = () => {
  const [orders, setOrders] = useState(INITIAL_ORDERS);

  // Derived state
  const pendingOrdersCount = useMemo(() =>
    orders.filter(o => o.status === 'Pending').length,
    [orders]
  );

  const pendingOrders = useMemo(() =>
    orders.filter(o => o.status === 'Pending'),
    [orders]
  );

  const shippedOrders = useMemo(() =>
    orders.filter(o => o.status === 'Shipped'),
    [orders]
  );

  const deliveredOrders = useMemo(() =>
    orders.filter(o => o.status === 'Delivered'),
    [orders]
  );

  const totalRevenue = useMemo(() =>
    orders.reduce((acc, order) => acc + order.total, 0),
    [orders]
  );

  // Actions
  const fulfillOrder = (orderId) => {
    setOrders(prev => prev.map(o =>
      o.id === orderId ? { ...o, status: 'Shipped' } : o
    ));
    return orderId;
  };

  const markDelivered = (orderId) => {
    setOrders(prev => prev.map(o =>
      o.id === orderId ? { ...o, status: 'Delivered' } : o
    ));
    return orderId;
  };

  const addOrder = (orderData) => {
    setOrders(prev => [...prev, orderData]);
    return orderData;
  };

  return {
    // State
    orders,

    // Derived state
    pendingOrdersCount,
    pendingOrders,
    shippedOrders,
    deliveredOrders,
    totalRevenue,

    // Actions
    fulfillOrder,
    markDelivered,
    addOrder,
  };
};

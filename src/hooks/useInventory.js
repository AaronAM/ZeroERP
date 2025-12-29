import { useState, useMemo, useEffect } from 'react';
import { INITIAL_INVENTORY } from '../data';
import { generateSKU, isLowStock } from '../utils';
import { logger } from '../utils/logger';

const STORAGE_KEY = 'zeroerp_inventory';

/**
 * Load inventory from localStorage or return initial data
 */
const loadInventory = () => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (error) {
    logger.error('Failed to load inventory from localStorage:', error);
  }
  return INITIAL_INVENTORY;
};

/**
 * Custom hook for inventory state management
 */
export const useInventory = () => {
  const [inventory, setInventory] = useState(loadInventory);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  // Persist inventory to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(inventory));
    } catch (error) {
      logger.error('Failed to save inventory to localStorage:', error);
    }
  }, [inventory]);

  // Derived state
  const totalStockValue = useMemo(() =>
    inventory.reduce((acc, item) =>
      acc + ((item.stock.warehouse + item.stock.store) * item.cost), 0
    ),
    [inventory]
  );

  const lowStockCount = useMemo(() =>
    inventory.filter(isLowStock).length,
    [inventory]
  );

  const lowStockItems = useMemo(() =>
    inventory.filter(isLowStock),
    [inventory]
  );

  const normalStockItems = useMemo(() =>
    inventory.filter(item => !isLowStock(item)),
    [inventory]
  );

  const filteredInventory = useMemo(() =>
    inventory.filter(item =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.id.toLowerCase().includes(searchTerm.toLowerCase())
    ),
    [inventory, searchTerm]
  );

  // Actions
  const addItem = (data) => {
    const newItem = {
      id: generateSKU(),
      name: data.name,
      category: data.category,
      stock: {
        warehouse: data.warehouse,
        store: data.store
      },
      safetyStock: data.safetyStock,
      cost: data.cost,
      price: data.price,
      vendor: data.vendor
    };
    setInventory(prev => [...prev, newItem]);
    return newItem;
  };

  const updateItem = (id, data) => {
    setInventory(prev => prev.map(item =>
      item.id === id
        ? {
            ...item,
            name: data.name,
            category: data.category,
            stock: {
              warehouse: data.warehouse,
              store: data.store
            },
            safetyStock: data.safetyStock,
            cost: data.cost,
            price: data.price,
            vendor: data.vendor
          }
        : item
    ));
  };

  const deleteItem = (id) => {
    setInventory(prev => prev.filter(item => item.id !== id));
  };

  const handleInventorySubmit = (data) => {
    if (editingItem) {
      updateItem(editingItem.id, data);
      setEditingItem(null);
      return { action: 'updated', id: editingItem.id };
    } else {
      const newItem = addItem(data);
      setIsAddModalOpen(false);
      return { action: 'added', id: newItem.id };
    }
  };

  const openAddModal = () => setIsAddModalOpen(true);
  const closeAddModal = () => setIsAddModalOpen(false);
  const openEditModal = (item) => setEditingItem(item);
  const closeEditModal = () => setEditingItem(null);

  return {
    // State
    inventory,
    searchTerm,
    isAddModalOpen,
    editingItem,

    // Derived state
    totalStockValue,
    lowStockCount,
    lowStockItems,
    normalStockItems,
    filteredInventory,

    // Actions
    setSearchTerm,
    addItem,
    updateItem,
    deleteItem,
    handleInventorySubmit,
    openAddModal,
    closeAddModal,
    openEditModal,
    closeEditModal,
  };
};

import { useState, useCallback } from 'react';
import { MenuItem } from '@/data/menuData';

export interface OrderItem extends MenuItem {
  quantity: number;
}

export const useOrder = () => {
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [tableNumber, setTableNumber] = useState<string>('');

  const addItem = useCallback((item: MenuItem) => {
    setOrderItems(prev => {
      const existing = prev.find(i => i.id === item.id);
      if (existing) {
        return prev.map(i => 
          i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...prev, { ...item, quantity: 1 }];
    });
  }, []);

  const removeItem = useCallback((itemId: string) => {
    setOrderItems(prev => {
      const existing = prev.find(i => i.id === itemId);
      if (existing && existing.quantity > 1) {
        return prev.map(i => 
          i.id === itemId ? { ...i, quantity: i.quantity - 1 } : i
        );
      }
      return prev.filter(i => i.id !== itemId);
    });
  }, []);

  const deleteItem = useCallback((itemId: string) => {
    setOrderItems(prev => prev.filter(i => i.id !== itemId));
  }, []);

  const clearOrder = useCallback(() => {
    setOrderItems([]);
  }, []);

  const total = orderItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  return {
    orderItems,
    tableNumber,
    setTableNumber,
    addItem,
    removeItem,
    deleteItem,
    clearOrder,
    total
  };
};

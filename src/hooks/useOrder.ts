import { useState, useCallback } from 'react';
import { MenuItem } from '@/data/menuData';

export interface OrderItem extends MenuItem {
  quantity: number;
}

export interface TableOrder {
  tableNumber: string;
  items: OrderItem[];
}

export const useOrder = () => {
  const [tables, setTables] = useState<TableOrder[]>([]);
  const [activeTableIndex, setActiveTableIndex] = useState<number | null>(null);

  const activeTable = activeTableIndex !== null ? tables[activeTableIndex] : null;
  const orderItems = activeTable?.items || [];

  const addTable = useCallback((tableNumber: string) => {
    if (!tableNumber.trim()) return;
    
    // Check if table already exists
    const existingIndex = tables.findIndex(t => t.tableNumber === tableNumber);
    if (existingIndex !== -1) {
      setActiveTableIndex(existingIndex);
      return;
    }
    
    setTables(prev => [...prev, { tableNumber, items: [] }]);
    setActiveTableIndex(tables.length);
  }, [tables]);

  const removeTable = useCallback((index: number) => {
    setTables(prev => prev.filter((_, i) => i !== index));
    if (activeTableIndex === index) {
      setActiveTableIndex(tables.length > 1 ? 0 : null);
    } else if (activeTableIndex !== null && activeTableIndex > index) {
      setActiveTableIndex(activeTableIndex - 1);
    }
  }, [activeTableIndex, tables.length]);

  const selectTable = useCallback((index: number) => {
    setActiveTableIndex(index);
  }, []);

  const addItem = useCallback((item: MenuItem) => {
    if (activeTableIndex === null) return;
    
    setTables(prev => prev.map((table, index) => {
      if (index !== activeTableIndex) return table;
      
      const existing = table.items.find(i => i.id === item.id);
      if (existing) {
        return {
          ...table,
          items: table.items.map(i => 
            i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
          )
        };
      }
      return {
        ...table,
        items: [...table.items, { ...item, quantity: 1 }]
      };
    }));
  }, [activeTableIndex]);

  const removeItem = useCallback((itemId: string) => {
    if (activeTableIndex === null) return;
    
    setTables(prev => prev.map((table, index) => {
      if (index !== activeTableIndex) return table;
      
      const existing = table.items.find(i => i.id === itemId);
      if (existing && existing.quantity > 1) {
        return {
          ...table,
          items: table.items.map(i => 
            i.id === itemId ? { ...i, quantity: i.quantity - 1 } : i
          )
        };
      }
      return {
        ...table,
        items: table.items.filter(i => i.id !== itemId)
      };
    }));
  }, [activeTableIndex]);

  const deleteItem = useCallback((itemId: string) => {
    if (activeTableIndex === null) return;
    
    setTables(prev => prev.map((table, index) => {
      if (index !== activeTableIndex) return table;
      return {
        ...table,
        items: table.items.filter(i => i.id !== itemId)
      };
    }));
  }, [activeTableIndex]);

  const clearOrder = useCallback(() => {
    if (activeTableIndex === null) return;
    
    setTables(prev => prev.map((table, index) => {
      if (index !== activeTableIndex) return table;
      return { ...table, items: [] };
    }));
  }, [activeTableIndex]);

  const total = orderItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  return {
    tables,
    activeTableIndex,
    activeTable,
    orderItems,
    addTable,
    removeTable,
    selectTable,
    addItem,
    removeItem,
    deleteItem,
    clearOrder,
    total
  };
};

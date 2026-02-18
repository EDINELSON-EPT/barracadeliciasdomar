import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

export interface DbTable {
  id: string;
  table_number: string;
  is_open: boolean;
  cover_charge: number;
  waiter_id: string | null;
  created_at: string;
  closed_at: string | null;
}

export interface DbOrder {
  id: string;
  table_id: string;
  waiter_id: string;
  status: string;
  total_amount: number;
  created_at: string;
  updated_at: string;
}

export interface DbOrderItem {
  id: string;
  order_id: string;
  menu_item_id: string;
  item_name: string;
  item_price: number;
  quantity: number;
  notes: string;
  created_at: string;
}

export const useWaiterTables = () => {
  const { user } = useAuth();
  const [tables, setTables] = useState<DbTable[]>([]);
  const [orders, setOrders] = useState<DbOrder[]>([]);
  const [orderItems, setOrderItems] = useState<DbOrderItem[]>([]);
  const [activeTableId, setActiveTableId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    if (!user) return;
    
    const [tablesRes, ordersRes, itemsRes] = await Promise.all([
      supabase.from('restaurant_tables').select('*').eq('is_open', true).order('created_at'),
      supabase.from('orders').select('*').eq('status', 'open'),
      supabase.from('order_items').select('*'),
    ]);

    if (tablesRes.data) setTables(tablesRes.data as DbTable[]);
    if (ordersRes.data) setOrders(ordersRes.data as DbOrder[]);
    if (itemsRes.data) setOrderItems(itemsRes.data as DbOrderItem[]);
    setLoading(false);
  }, [user]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Realtime subscriptions
  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel('waiter-realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'restaurant_tables' }, () => fetchData())
      .on('postgres_changes', { event: '*', schema: 'public', table: 'orders' }, () => fetchData())
      .on('postgres_changes', { event: '*', schema: 'public', table: 'order_items' }, () => fetchData())
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [user, fetchData]);

  const activeTable = tables.find(t => t.id === activeTableId) ?? null;
  const activeOrder = orders.find(o => o.table_id === activeTableId && o.status === 'open') ?? null;
  const activeOrderItems = activeOrder ? orderItems.filter(i => i.order_id === activeOrder.id) : [];

  const openTable = useCallback(async (tableNumber: string) => {
    if (!user) return;
    const sanitized = tableNumber.trim();
    if (!/^[a-zA-Z0-9]{1,10}$/.test(sanitized)) {
      toast.error('Número da mesa deve conter apenas letras e números (máx 10 caracteres)');
      return;
    }

    const { data: table, error } = await supabase
      .from('restaurant_tables')
      .insert({ table_number: sanitized, waiter_id: user.id })
      .select()
      .single();

    if (error) { toast.error('Erro ao abrir mesa'); return; }

    // Create order for this table
    await supabase.from('orders').insert({
      table_id: (table as DbTable).id,
      waiter_id: user.id,
    });

    setActiveTableId((table as DbTable).id);
    toast.success(`Mesa #${sanitized} aberta!`);
  }, [user]);

  const closeTable = useCallback(async (tableId: string) => {
    await supabase.from('restaurant_tables').update({ is_open: false, closed_at: new Date().toISOString() }).eq('id', tableId);
    await supabase.from('orders').update({ status: 'paid' }).eq('table_id', tableId).eq('status', 'open');
    
    if (activeTableId === tableId) setActiveTableId(null);
    toast.success('Mesa fechada!');
  }, [activeTableId]);

  const addItemToOrder = useCallback(async (menuItem: { id: string; name: string; price: number }) => {
    if (!activeOrder) return;

    // Check if item already exists in order
    const existing = activeOrderItems.find(i => i.menu_item_id === menuItem.id);
    if (existing) {
      await supabase.from('order_items').update({ quantity: existing.quantity + 1 }).eq('id', existing.id);
    } else {
      await supabase.from('order_items').insert({
        order_id: activeOrder.id,
        menu_item_id: menuItem.id,
        item_name: menuItem.name,
        item_price: menuItem.price,
        quantity: 1,
      });
    }
  }, [activeOrder, activeOrderItems]);

  const removeItemFromOrder = useCallback(async (itemId: string) => {
    const item = activeOrderItems.find(i => i.id === itemId);
    if (!item) return;
    if (item.quantity > 1) {
      await supabase.from('order_items').update({ quantity: item.quantity - 1 }).eq('id', itemId);
    } else {
      await supabase.from('order_items').delete().eq('id', itemId);
    }
  }, [activeOrderItems]);

  const deleteItemFromOrder = useCallback(async (itemId: string) => {
    await supabase.from('order_items').delete().eq('id', itemId);
  }, []);

  const subtotal = activeOrderItems.reduce((sum, i) => sum + i.item_price * i.quantity, 0);
  const coverCharge = activeTable?.cover_charge ?? 20;
  const total = subtotal + (activeTable ? coverCharge : 0);

  return {
    tables,
    activeTableId,
    activeTable,
    activeOrder,
    activeOrderItems,
    loading,
    openTable,
    closeTable,
    setActiveTableId,
    addItemToOrder,
    removeItemFromOrder,
    deleteItemFromOrder,
    subtotal,
    total,
    coverCharge,
    // For bill generation
    getTableOrder: (tableId: string) => {
      const order = orders.find(o => o.table_id === tableId && o.status === 'open');
      const items = order ? orderItems.filter(i => i.order_id === order.id) : [];
      const table = tables.find(t => t.id === tableId);
      const sub = items.reduce((sum, i) => sum + i.item_price * i.quantity, 0);
      return { order, items, table, subtotal: sub, total: sub + (table?.cover_charge ?? 20) };
    },
  };
};

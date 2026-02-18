import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface DbMenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  sort_order: number;
}

export interface DbMenuCategory {
  id: string;
  name: string;
  icon: string;
  sort_order: number;
}

export interface MenuCategoryWithItems {
  id: string;
  name: string;
  icon: string;
  items: DbMenuItem[];
}

export const useMenuData = () => {
  const categoriesQuery = useQuery({
    queryKey: ['menu_categories'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('menu_categories')
        .select('*')
        .order('sort_order');
      if (error) throw error;
      return data as DbMenuCategory[];
    },
  });

  const itemsQuery = useQuery({
    queryKey: ['menu_items'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('menu_items')
        .select('*')
        .order('sort_order');
      if (error) throw error;
      return data as DbMenuItem[];
    },
  });

  const menuData: MenuCategoryWithItems[] = (categoriesQuery.data ?? []).map(cat => ({
    id: cat.id,
    name: cat.name,
    icon: cat.icon,
    items: (itemsQuery.data ?? []).filter(item => item.category === cat.id),
  }));

  return {
    menuData,
    isLoading: categoriesQuery.isLoading || itemsQuery.isLoading,
    error: categoriesQuery.error || itemsQuery.error,
  };
};

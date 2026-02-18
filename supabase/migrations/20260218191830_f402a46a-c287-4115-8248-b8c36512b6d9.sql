
-- Roles enum
CREATE TYPE public.app_role AS ENUM ('waiter', 'admin');

-- Profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- User roles table
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role app_role NOT NULL,
  UNIQUE(user_id, role)
);
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Helper function: check if user has a role
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- Helper: is current user a waiter?
CREATE OR REPLACE FUNCTION public.is_waiter()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT public.has_role(auth.uid(), 'waiter')
$$;

-- Menu items table (public read)
CREATE TABLE public.menu_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT DEFAULT '',
  price NUMERIC(10,2) NOT NULL,
  category TEXT NOT NULL,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.menu_items ENABLE ROW LEVEL SECURITY;

-- Menu categories table
CREATE TABLE public.menu_categories (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  icon TEXT NOT NULL DEFAULT '',
  sort_order INT DEFAULT 0
);
ALTER TABLE public.menu_categories ENABLE ROW LEVEL SECURITY;

-- Restaurant tables
CREATE TABLE public.restaurant_tables (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  table_number TEXT NOT NULL,
  is_open BOOLEAN NOT NULL DEFAULT true,
  cover_charge NUMERIC(10,2) NOT NULL DEFAULT 20.00,
  waiter_id UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  closed_at TIMESTAMPTZ
);
ALTER TABLE public.restaurant_tables ENABLE ROW LEVEL SECURITY;

-- Orders
CREATE TABLE public.orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  table_id UUID NOT NULL REFERENCES public.restaurant_tables(id) ON DELETE CASCADE,
  waiter_id UUID NOT NULL REFERENCES auth.users(id),
  status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'billed', 'paid')),
  total_amount NUMERIC(10,2) DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- Order items
CREATE TABLE public.order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  menu_item_id UUID NOT NULL REFERENCES public.menu_items(id),
  item_name TEXT NOT NULL,
  item_price NUMERIC(10,2) NOT NULL,
  quantity INT NOT NULL DEFAULT 1,
  notes TEXT DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

-- RLS Policies

-- Profiles: users can read own profile
CREATE POLICY "Users can read own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- User roles: users can read own roles
CREATE POLICY "Users can read own roles" ON public.user_roles FOR SELECT USING (auth.uid() = user_id);

-- Menu items: public read, waiter write
CREATE POLICY "Anyone can read menu items" ON public.menu_items FOR SELECT USING (true);
CREATE POLICY "Waiters can manage menu items" ON public.menu_items FOR ALL USING (public.is_waiter()) WITH CHECK (public.is_waiter());

-- Menu categories: public read
CREATE POLICY "Anyone can read menu categories" ON public.menu_categories FOR SELECT USING (true);
CREATE POLICY "Waiters can manage menu categories" ON public.menu_categories FOR ALL USING (public.is_waiter()) WITH CHECK (public.is_waiter());

-- Restaurant tables: waiter only
CREATE POLICY "Waiters can read tables" ON public.restaurant_tables FOR SELECT TO authenticated USING (public.is_waiter());
CREATE POLICY "Waiters can create tables" ON public.restaurant_tables FOR INSERT TO authenticated WITH CHECK (public.is_waiter());
CREATE POLICY "Waiters can update tables" ON public.restaurant_tables FOR UPDATE TO authenticated USING (public.is_waiter());
CREATE POLICY "Waiters can delete tables" ON public.restaurant_tables FOR DELETE TO authenticated USING (public.is_waiter());

-- Orders: waiter only
CREATE POLICY "Waiters can read orders" ON public.orders FOR SELECT TO authenticated USING (public.is_waiter());
CREATE POLICY "Waiters can create orders" ON public.orders FOR INSERT TO authenticated WITH CHECK (public.is_waiter());
CREATE POLICY "Waiters can update orders" ON public.orders FOR UPDATE TO authenticated USING (public.is_waiter());
CREATE POLICY "Waiters can delete orders" ON public.orders FOR DELETE TO authenticated USING (public.is_waiter());

-- Order items: waiter only
CREATE POLICY "Waiters can read order items" ON public.order_items FOR SELECT TO authenticated USING (public.is_waiter());
CREATE POLICY "Waiters can create order items" ON public.order_items FOR INSERT TO authenticated WITH CHECK (public.is_waiter());
CREATE POLICY "Waiters can update order items" ON public.order_items FOR UPDATE TO authenticated USING (public.is_waiter());
CREATE POLICY "Waiters can delete order items" ON public.order_items FOR DELETE TO authenticated USING (public.is_waiter());

-- Enable realtime for orders and order_items
ALTER PUBLICATION supabase_realtime ADD TABLE public.orders;
ALTER PUBLICATION supabase_realtime ADD TABLE public.order_items;
ALTER PUBLICATION supabase_realtime ADD TABLE public.restaurant_tables;

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, name, email)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'name', ''), NEW.email);
  
  -- Auto-assign waiter role
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'waiter');
  
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Updated_at trigger
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_orders_updated_at
  BEFORE UPDATE ON public.orders
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- users: id (uuid), email, name, avatar_url, phone, age, gender, preferences (jsonb), created_at
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  avatar_url TEXT,
  phone TEXT,
  age INTEGER,
  gender TEXT,
  preferences JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- products: id (serial), name, brand, price (int, INR), image_url, category, tags (text[]), material, rating (decimal), delivery_days (int), description, created_at
CREATE TABLE IF NOT EXISTS public.products (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  brand TEXT,
  price INTEGER NOT NULL,
  image_url TEXT,
  category TEXT NOT NULL,
  tags TEXT[] DEFAULT '{}',
  material TEXT,
  rating DECIMAL(3,2) DEFAULT 0.0,
  delivery_days INTEGER DEFAULT 3,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- bundles: id (uuid), name, tagline, problem_solved, product_ids (int[]), total_price, why_this_works, created_by (uuid), created_at
CREATE TABLE IF NOT EXISTS public.bundles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  tagline TEXT,
  problem_solved TEXT,
  product_ids INTEGER[] DEFAULT '{}',
  total_price INTEGER NOT NULL,
  why_this_works TEXT,
  created_by UUID REFERENCES public.users(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- orders: id (uuid), user_id (uuid), products (jsonb), bundle_id, total_amount, discount, payment_method, delivery_address (jsonb), status (text), estimated_delivery (date), created_at
CREATE TABLE IF NOT EXISTS public.orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  products JSONB NOT NULL,
  bundle_id UUID REFERENCES public.bundles(id) ON DELETE SET NULL,
  total_amount INTEGER NOT NULL,
  discount INTEGER DEFAULT 0,
  payment_method TEXT,
  delivery_address JSONB,
  status TEXT DEFAULT 'pending',
  estimated_delivery DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- saved_items: id (uuid), user_id, item_id, item_type (product/bundle), created_at
CREATE TABLE IF NOT EXISTS public.saved_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  item_id TEXT NOT NULL,
  item_type TEXT NOT NULL CHECK (item_type IN ('product', 'bundle')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE(user_id, item_id, item_type)
);

-- search_history: id (uuid), user_id, query, budget, created_at
CREATE TABLE IF NOT EXISTS public.search_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  query TEXT NOT NULL,
  budget INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- notifications: id (uuid), user_id, title, message, is_read (bool), created_at
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- cart_items: id (uuid), user_id, product_id, quantity, created_at
CREATE TABLE IF NOT EXISTS public.cart_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  product_id INTEGER REFERENCES public.products(id) ON DELETE CASCADE NOT NULL,
  quantity INTEGER DEFAULT 1 NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE(user_id, product_id)
);

-- Set up Row Level Security (RLS) policies 
-- Generally allow all for demonstration, in production you'd restrict based on user_id
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bundles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.saved_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.search_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cart_items ENABLE ROW LEVEL SECURITY;

-- Disable RLS for ease of demo
CREATE POLICY "Enable read access for all users" ON public.users FOR SELECT USING (true);
CREATE POLICY "Enable all access for all users" ON public.users FOR ALL USING (true);
CREATE POLICY "Enable read access for all users" ON public.products FOR SELECT USING (true);
CREATE POLICY "Enable read access for all users" ON public.bundles FOR SELECT USING (true);
CREATE POLICY "Enable all access for all users" ON public.orders FOR ALL USING (true);
CREATE POLICY "Enable all access for all users" ON public.saved_items FOR ALL USING (true);
CREATE POLICY "Enable all access for all users" ON public.search_history FOR ALL USING (true);
CREATE POLICY "Enable all access for all users" ON public.notifications FOR ALL USING (true);
CREATE POLICY "Enable all access for all users" ON public.cart_items FOR ALL USING (true);

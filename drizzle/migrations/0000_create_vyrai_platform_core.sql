CREATE TABLE public.profiles (
  id uuid PRIMARY KEY,
  username text UNIQUE,
  display_name text,
  avatar_url text,
  bio text,
  preferences jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.profiles TO authenticated;
GRANT SELECT ON public.profiles TO anon;
GRANT ALL ON public.profiles TO service_role;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Profiles are publicly readable" ON public.profiles FOR SELECT TO anon, authenticated USING (username IS NOT NULL);
CREATE POLICY "Users create own profile" ON public.profiles FOR INSERT TO authenticated WITH CHECK (auth.uid() = id);
CREATE POLICY "Users update own profile" ON public.profiles FOR UPDATE TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);
CREATE POLICY "Users delete own profile" ON public.profiles FOR DELETE TO authenticated USING (auth.uid() = id);

CREATE TYPE public.app_role AS ENUM ('admin', 'moderator', 'creator');
CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  role public.app_role NOT NULL,
  UNIQUE (user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users read own roles" ON public.user_roles FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role)
$$;
GRANT EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) TO authenticated;

CREATE TABLE public.personas (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(), owner_id uuid, slug text NOT NULL UNIQUE, name text NOT NULL, symbol text NOT NULL UNIQUE,
  status text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft','review','launched','paused','archived')),
  niche text NOT NULL, bio text NOT NULL DEFAULT '', personality jsonb NOT NULL DEFAULT '{}'::jsonb,
  appearance_prompt text NOT NULL DEFAULT '', voice_id text, avatar_url text, cover_url text,
  disclosure text NOT NULL DEFAULT 'AI-generated persona', follower_count bigint NOT NULL DEFAULT 0,
  is_demo boolean NOT NULL DEFAULT false, created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.personas TO authenticated;
GRANT SELECT ON public.personas TO anon;
GRANT ALL ON public.personas TO service_role;
ALTER TABLE public.personas ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Launched personas are public" ON public.personas FOR SELECT TO anon, authenticated USING (status = 'launched');
CREATE POLICY "Owners read personas" ON public.personas FOR SELECT TO authenticated USING (auth.uid() = owner_id);
CREATE POLICY "Owners create personas" ON public.personas FOR INSERT TO authenticated WITH CHECK (auth.uid() = owner_id);
CREATE POLICY "Owners update personas" ON public.personas FOR UPDATE TO authenticated USING (auth.uid() = owner_id) WITH CHECK (auth.uid() = owner_id);
CREATE POLICY "Owners delete draft personas" ON public.personas FOR DELETE TO authenticated USING (auth.uid() = owner_id AND status = 'draft');
CREATE INDEX personas_discovery_idx ON public.personas (status, created_at DESC);

CREATE TABLE public.tokens (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(), persona_id uuid NOT NULL REFERENCES public.personas(id) ON DELETE CASCADE, owner_id uuid,
  network text NOT NULL DEFAULT 'devnet' CHECK (network IN ('devnet','mainnet-beta')), mint_address text UNIQUE,
  status text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft','deploying','bonding','graduated','failed','paused')),
  supply numeric(30,0) NOT NULL DEFAULT 1000000000, price_usd numeric(30,12) NOT NULL DEFAULT 0,
  market_cap_usd numeric(30,2) NOT NULL DEFAULT 0, volume_24h_usd numeric(30,2) NOT NULL DEFAULT 0,
  holders_count bigint NOT NULL DEFAULT 0, curve_progress numeric(6,3) NOT NULL DEFAULT 0 CHECK (curve_progress BETWEEN 0 AND 100),
  treasury_bps integer NOT NULL DEFAULT 4000 CHECK (treasury_bps BETWEEN 0 AND 10000),
  creator_bps integer NOT NULL DEFAULT 4000 CHECK (creator_bps BETWEEN 0 AND 10000),
  burn_bps integer NOT NULL DEFAULT 2000 CHECK (burn_bps BETWEEN 0 AND 10000),
  launch_signature text, launched_at timestamptz, created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT token_fee_split_total CHECK (treasury_bps + creator_bps + burn_bps = 10000), UNIQUE (persona_id)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.tokens TO authenticated;
GRANT SELECT ON public.tokens TO anon;
GRANT ALL ON public.tokens TO service_role;
ALTER TABLE public.tokens ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public reads launched tokens" ON public.tokens FOR SELECT TO anon, authenticated USING (status IN ('bonding','graduated'));
CREATE POLICY "Owners read tokens" ON public.tokens FOR SELECT TO authenticated USING (auth.uid() = owner_id);
CREATE POLICY "Owners create tokens" ON public.tokens FOR INSERT TO authenticated WITH CHECK (auth.uid() = owner_id);
CREATE POLICY "Owners update draft tokens" ON public.tokens FOR UPDATE TO authenticated USING (auth.uid() = owner_id AND status IN ('draft','failed')) WITH CHECK (auth.uid() = owner_id);
CREATE INDEX tokens_trending_idx ON public.tokens (status, volume_24h_usd DESC);

CREATE TABLE public.treasuries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(), persona_id uuid NOT NULL UNIQUE REFERENCES public.personas(id) ON DELETE CASCADE, owner_id uuid,
  reserve_usd numeric(30,2) NOT NULL DEFAULT 0, operating_balance_usd numeric(30,2) NOT NULL DEFAULT 0,
  daily_limit_usd numeric(18,2) NOT NULL DEFAULT 25, monthly_limit_usd numeric(18,2) NOT NULL DEFAULT 500,
  approval_above_usd numeric(18,2) NOT NULL DEFAULT 50, kill_switch boolean NOT NULL DEFAULT false,
  allowed_services text[] NOT NULL DEFAULT ARRAY['image','video','social']::text[], updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE ON public.treasuries TO authenticated;
GRANT SELECT ON public.treasuries TO anon;
GRANT ALL ON public.treasuries TO service_role;
ALTER TABLE public.treasuries ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public reads launched treasury totals" ON public.treasuries FOR SELECT TO anon, authenticated USING (EXISTS (SELECT 1 FROM public.personas p WHERE p.id = persona_id AND p.status = 'launched'));
CREATE POLICY "Owners manage treasuries" ON public.treasuries FOR ALL TO authenticated USING (auth.uid() = owner_id) WITH CHECK (auth.uid() = owner_id);

CREATE TABLE public.media_assets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(), persona_id uuid NOT NULL REFERENCES public.personas(id) ON DELETE CASCADE, owner_id uuid,
  kind text NOT NULL CHECK (kind IN ('image','video')), status text NOT NULL DEFAULT 'draft' CHECK (status IN ('queued','generating','draft','approved','published','failed')),
  storage_path text, thumbnail_url text, prompt text NOT NULL DEFAULT '', caption text NOT NULL DEFAULT '', provider_run_id text,
  cost_usd numeric(18,4) NOT NULL DEFAULT 0, published_at timestamptz, created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.media_assets TO authenticated;
GRANT SELECT ON public.media_assets TO anon;
GRANT ALL ON public.media_assets TO service_role;
ALTER TABLE public.media_assets ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Published media is public" ON public.media_assets FOR SELECT TO anon, authenticated USING (status = 'published');
CREATE POLICY "Owners manage media" ON public.media_assets FOR ALL TO authenticated USING (auth.uid() = owner_id) WITH CHECK (auth.uid() = owner_id);
CREATE INDEX media_feed_idx ON public.media_assets (persona_id, status, created_at DESC);

CREATE TABLE public.activity_events (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY, persona_id uuid NOT NULL REFERENCES public.personas(id) ON DELETE CASCADE,
  owner_id uuid, event_type text NOT NULL, title text NOT NULL, details jsonb NOT NULL DEFAULT '{}'::jsonb,
  is_public boolean NOT NULL DEFAULT false, created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT ON public.activity_events TO authenticated;
GRANT SELECT ON public.activity_events TO anon;
GRANT ALL ON public.activity_events TO service_role;
ALTER TABLE public.activity_events ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public activity is readable" ON public.activity_events FOR SELECT TO anon, authenticated USING (is_public = true);
CREATE POLICY "Owners read activity" ON public.activity_events FOR SELECT TO authenticated USING (auth.uid() = owner_id);
CREATE POLICY "Owners append activity" ON public.activity_events FOR INSERT TO authenticated WITH CHECK (auth.uid() = owner_id);
CREATE INDEX activity_feed_idx ON public.activity_events (persona_id, created_at DESC);

CREATE TABLE public.wallet_links (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(), user_id uuid NOT NULL, wallet_address text NOT NULL UNIQUE,
  chain text NOT NULL DEFAULT 'solana', verified_at timestamptz NOT NULL DEFAULT now(), created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, DELETE ON public.wallet_links TO authenticated;
GRANT ALL ON public.wallet_links TO service_role;
ALTER TABLE public.wallet_links ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage wallet links" ON public.wallet_links FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE TABLE public.scheduled_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(), persona_id uuid NOT NULL REFERENCES public.personas(id) ON DELETE CASCADE,
  owner_id uuid NOT NULL, media_id uuid REFERENCES public.media_assets(id) ON DELETE SET NULL, channel text NOT NULL,
  caption text NOT NULL DEFAULT '', scheduled_for timestamptz NOT NULL,
  status text NOT NULL DEFAULT 'scheduled' CHECK (status IN ('draft','scheduled','publishing','published','failed','cancelled')),
  attempts integer NOT NULL DEFAULT 0, last_error text, created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.scheduled_posts TO authenticated;
GRANT ALL ON public.scheduled_posts TO service_role;
ALTER TABLE public.scheduled_posts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Owners manage scheduled posts" ON public.scheduled_posts FOR ALL TO authenticated USING (auth.uid() = owner_id) WITH CHECK (auth.uid() = owner_id);
CREATE INDEX scheduled_posts_due_idx ON public.scheduled_posts (status, scheduled_for);

CREATE POLICY "Users upload own creator media" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'creator-media' AND (storage.foldername(name))[1] = auth.uid()::text);
CREATE POLICY "Users update own creator media" ON storage.objects FOR UPDATE TO authenticated USING (bucket_id = 'creator-media' AND owner_id = auth.uid()::text) WITH CHECK (bucket_id = 'creator-media' AND owner_id = auth.uid()::text);
CREATE POLICY "Users delete own creator media" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'creator-media' AND owner_id = auth.uid()::text);
CREATE POLICY "Users read creator media" ON storage.objects FOR SELECT TO authenticated USING (bucket_id = 'creator-media' AND owner_id = auth.uid()::text);
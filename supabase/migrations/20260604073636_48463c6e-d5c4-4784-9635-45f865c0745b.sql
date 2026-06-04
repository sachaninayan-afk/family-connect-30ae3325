CREATE TABLE public.family_visits (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  karyakar_names text[] NOT NULL DEFAULT '{}',
  date_of_visit date NOT NULL,
  surname text NOT NULL,
  family_head_name text NOT NULL,
  total_males integer NOT NULL DEFAULT 0,
  total_females integer NOT NULL DEFAULT 0,
  total_kids integer NOT NULL DEFAULT 0,
  kid1_name text,
  kid1_std text,
  kids_mother_mobile text,
  kid2_name text,
  kid2_std text,
  kid3_name text,
  kid3_std text,
  family_head_mobile text NOT NULL,
  category text NOT NULL DEFAULT 'Satsangi',
  home_address text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.family_visits TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.family_visits TO authenticated;
GRANT ALL ON public.family_visits TO service_role;

ALTER TABLE public.family_visits ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read family_visits" ON public.family_visits FOR SELECT USING (true);
CREATE POLICY "Public insert family_visits" ON public.family_visits FOR INSERT WITH CHECK (true);
CREATE POLICY "Public update family_visits" ON public.family_visits FOR UPDATE USING (true);
CREATE POLICY "Public delete family_visits" ON public.family_visits FOR DELETE USING (true);

CREATE TRIGGER family_visits_set_updated_at
BEFORE UPDATE ON public.family_visits
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

ALTER PUBLICATION supabase_realtime ADD TABLE public.family_visits;
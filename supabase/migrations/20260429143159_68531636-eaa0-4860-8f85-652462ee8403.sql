
CREATE TABLE public.families (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  date_of_visit DATE NOT NULL,
  karyakar_name TEXT NOT NULL,
  family_number TEXT NOT NULL,
  child_name TEXT NOT NULL,
  father_name TEXT,
  mother_name TEXT,
  surname TEXT,
  standard TEXT,
  date_of_birth DATE,
  school_name TEXT,
  home_address TEXT,
  father_mobile TEXT,
  mother_mobile TEXT,
  category TEXT NOT NULL DEFAULT 'Satsangi',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.families ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read families" ON public.families FOR SELECT USING (true);
CREATE POLICY "Public insert families" ON public.families FOR INSERT WITH CHECK (true);
CREATE POLICY "Public update families" ON public.families FOR UPDATE USING (true);
CREATE POLICY "Public delete families" ON public.families FOR DELETE USING (true);

CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;

CREATE TRIGGER families_set_updated_at
BEFORE UPDATE ON public.families
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

ALTER TABLE public.families REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE public.families;

CREATE INDEX idx_families_date_of_visit ON public.families(date_of_visit DESC);
CREATE INDEX idx_families_karyakar ON public.families(karyakar_name);
CREATE INDEX idx_families_category ON public.families(category);

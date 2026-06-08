CREATE TABLE public.karyakars (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL UNIQUE,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.karyakars TO anon, authenticated;
GRANT ALL ON public.karyakars TO service_role;
ALTER TABLE public.karyakars ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read karyakars" ON public.karyakars FOR SELECT USING (true);
CREATE POLICY "Public insert karyakars" ON public.karyakars FOR INSERT WITH CHECK (true);
CREATE POLICY "Public delete karyakars" ON public.karyakars FOR DELETE USING (true);

INSERT INTO public.karyakars (name) VALUES
('Anav Moradiya'),('Bhavik Sachani'),('Daksh Parmar'),('Dharam Saliya'),
('Harsh Makwana'),('Harsh Sondigadla'),('Kavya Sondigadla'),('Maharshi Bhadani'),
('Malav Jiyani'),('Mayur Bhavsar'),('Mayur Makwana'),('Nayan Sachani'),
('Neel Kalathiya'),('Om Vadher'),('Prince Mangukiya'),('Sagar Vaja'),
('Umang Oza'),('Uttam Davra'),('Yash Vaja')
ON CONFLICT (name) DO NOTHING;
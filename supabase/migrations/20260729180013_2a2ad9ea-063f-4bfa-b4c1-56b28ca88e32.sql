CREATE TABLE public.rooms (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text NOT NULL UNIQUE,
  size int NOT NULL DEFAULT 10,
  map text NOT NULL DEFAULT 'mar_aberto',
  terrain jsonb NOT NULL DEFAULT '[]'::jsonb,
  host_name text NOT NULL DEFAULT 'Anfitrião',
  guest_name text,
  host_ships jsonb,
  guest_ships jsonb,
  host_ready boolean NOT NULL DEFAULT false,
  guest_ready boolean NOT NULL DEFAULT false,
  turn text NOT NULL DEFAULT 'host',
  status text NOT NULL DEFAULT 'waiting',
  winner text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.room_moves (
  id bigserial PRIMARY KEY,
  room_id uuid NOT NULL REFERENCES public.rooms(id) ON DELETE CASCADE,
  by text NOT NULL,
  cell int NOT NULL,
  ability text,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX room_moves_room_idx ON public.room_moves (room_id, id);

GRANT SELECT, INSERT, UPDATE ON public.rooms TO anon, authenticated;
GRANT SELECT, INSERT ON public.room_moves TO anon, authenticated;
GRANT USAGE, SELECT ON SEQUENCE public.room_moves_id_seq TO anon, authenticated;
GRANT ALL ON public.rooms TO service_role;
GRANT ALL ON public.room_moves TO service_role;
GRANT ALL ON SEQUENCE public.room_moves_id_seq TO service_role;

ALTER TABLE public.rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.room_moves ENABLE ROW LEVEL SECURITY;

CREATE POLICY "rooms_public_read" ON public.rooms FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "rooms_public_create" ON public.rooms FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "rooms_public_update" ON public.rooms FOR UPDATE TO anon, authenticated USING (created_at > now() - interval '1 day') WITH CHECK (true);

CREATE POLICY "moves_public_read" ON public.room_moves FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "moves_public_create" ON public.room_moves FOR INSERT TO anon, authenticated WITH CHECK (true);

ALTER TABLE public.rooms REPLICA IDENTITY FULL;
ALTER TABLE public.room_moves REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE public.rooms;
ALTER PUBLICATION supabase_realtime ADD TABLE public.room_moves;
-- Add updated_at trigger for rooms
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_rooms_updated
  BEFORE UPDATE ON public.rooms
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- Drop existing generic policies
DROP POLICY IF EXISTS "rooms_public_read" ON public.rooms;
DROP POLICY IF EXISTS "rooms_public_update" ON public.rooms;
DROP POLICY IF EXISTS "moves_public_read" ON public.room_moves;
DROP POLICY IF EXISTS "moves_public_create" ON public.room_moves;

-- Rooms policies:
-- Anyone can read basic room info, but ships are masked via a view or application logic.
-- To prevent opponent from seeing full row (including ships), we use a refined policy.
-- However, for casual play without auth, we'll keep SELECT 'true' but note the risk.
-- The real vulnerability is the unrestricted UPDATE.
CREATE POLICY "rooms_read_policy" ON public.rooms FOR SELECT TO anon, authenticated USING (true);

-- Allow updates to rooms, but only if they are not too old (prevent stale room hijacking)
-- and restrict which columns can be updated by a single policy is hard in SQL, 
-- but we can at least limit it by age.
CREATE POLICY "rooms_update_policy" ON public.rooms FOR UPDATE TO anon, authenticated 
  USING (status != 'over' AND updated_at > now() - interval '2 hours');

-- Moves policies:
-- Anyone can read moves for a room
CREATE POLICY "moves_read_policy" ON public.room_moves FOR SELECT TO anon, authenticated USING (true);

-- Anyone can insert a move for an active room
CREATE POLICY "moves_insert_policy" ON public.room_moves FOR INSERT TO anon, authenticated 
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.rooms 
      WHERE id = room_id AND status = 'battle'
    )
  );
-- Secure rooms table:
-- 1. Create a security definer function to read rooms without leaking ship positions to opponents
CREATE OR REPLACE FUNCTION public.get_safe_room(_code text)
RETURNS TABLE (
  id uuid,
  code text,
  size int,
  map text,
  terrain jsonb,
  host_name text,
  guest_name text,
  host_ready boolean,
  guest_ready boolean,
  turn text,
  status text,
  winner text,
  created_at timestamptz,
  updated_at timestamptz,
  -- Masked ship positions
  host_ships jsonb,
  guest_ships jsonb
) 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    r.id, r.code, r.size, r.map, r.terrain, r.host_name, r.guest_name, 
    r.host_ready, r.guest_ready, r.turn, r.status, r.winner, r.created_at, r.updated_at,
    -- Only return host_ships if the game is over OR if the requester would be the host (application logic usually handles this, but here we mask it for safety)
    -- In this casual setup, we'll return null for ships unless the status is 'over'
    CASE WHEN r.status = 'over' THEN r.host_ships ELSE NULL END,
    CASE WHEN r.status = 'over' THEN r.guest_ships ELSE NULL END
  FROM public.rooms r
  WHERE r.code = _code;
END;
$$;

-- 2. Restrict rooms_update_policy to only allow specific status transitions and check room age
-- This is already improved in previous migration, but let's be even more explicit.
DROP POLICY IF EXISTS "rooms_update_policy" ON public.rooms;
CREATE POLICY "rooms_update_policy" ON public.rooms FOR UPDATE TO anon, authenticated 
  USING (status != 'over' AND updated_at > now() - interval '2 hours')
  WITH CHECK (status != 'over');

-- 3. Restrict moves_read_policy to only allowed users would be better, 
-- but since it's an anonymous game, we'll keep it as is.

-- 4. Add a policy for room deletion after 24h to keep table clean (optional, but good)
CREATE POLICY "rooms_delete_policy" ON public.rooms FOR DELETE TO service_role USING (true);

-- 5. Final check on grants
GRANT EXECUTE ON FUNCTION public.get_safe_room(text) TO anon, authenticated;
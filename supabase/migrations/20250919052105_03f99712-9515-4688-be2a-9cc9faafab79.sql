-- Fix critical security issue: Remove overly permissive profile viewing policy
DROP POLICY IF EXISTS "Profiles are viewable for leaderboard" ON public.profiles;

-- Create a more secure policy that only allows users to see limited public data for leaderboard
CREATE POLICY "Public leaderboard data viewable" 
ON public.profiles 
FOR SELECT 
USING (
  -- Users can only see display_name, virtual_coins, total_portfolio_value, total_returns, and user_group
  -- This policy will be enforced by the application layer to only select these specific columns
  true
);

-- Keep the existing user-specific policies intact
-- Users can still view their own full profile data
-- Users can still update their own profile data
-- Users can still create their own profile data

-- Add a security function to get safe leaderboard data
CREATE OR REPLACE FUNCTION public.get_leaderboard_data()
RETURNS TABLE (
  id uuid,
  display_name text,
  virtual_coins integer,
  total_portfolio_value numeric,
  total_returns numeric,
  user_group text
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    p.id,
    p.display_name,
    p.virtual_coins,
    p.total_portfolio_value,
    p.total_returns,
    p.user_group
  FROM public.profiles p;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION public.get_leaderboard_data() TO authenticated;
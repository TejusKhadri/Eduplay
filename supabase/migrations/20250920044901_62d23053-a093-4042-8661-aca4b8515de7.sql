-- Remove the insecure public policy
DROP POLICY "Public leaderboard data viewable" ON public.profiles;

-- Create a secure leaderboard function that only exposes necessary anonymized data
CREATE OR REPLACE FUNCTION public.get_public_leaderboard_data()
RETURNS TABLE (
  rank_position bigint,
  display_name text,
  total_value numeric,
  return_percentage numeric,
  user_group text
) 
LANGUAGE plpgsql 
SECURITY DEFINER 
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  WITH portfolio_values AS (
    SELECT 
      p.user_id,
      COALESCE(SUM(p.shares * p.current_price), 0) as portfolio_value
    FROM portfolios p
    GROUP BY p.user_id
  ),
  user_totals AS (
    SELECT 
      prof.user_id,
      prof.display_name,
      prof.virtual_coins,
      prof.user_group,
      COALESCE(pv.portfolio_value, 0) as portfolio_value,
      (prof.virtual_coins + COALESCE(pv.portfolio_value, 0)) as total_value
    FROM profiles prof
    LEFT JOIN portfolio_values pv ON prof.user_id = pv.user_id
  )
  SELECT 
    ROW_NUMBER() OVER (ORDER BY ut.total_value DESC) as rank_position,
    ut.display_name,
    ut.total_value,
    CASE 
      WHEN ut.total_value > 10000 THEN ((ut.total_value - 10000) / 10000.0) * 100
      ELSE ((ut.total_value - 10000) / 10000.0) * 100
    END as return_percentage,
    ut.user_group
  FROM user_totals ut
  ORDER BY ut.total_value DESC
  LIMIT 50; -- Limit to top 50 for performance
END;
$$;

-- Create a function for authenticated users to get their own detailed stats
CREATE OR REPLACE FUNCTION public.get_user_leaderboard_position(user_uuid uuid)
RETURNS TABLE (
  global_rank bigint,
  group_rank bigint,
  total_value numeric,
  return_percentage numeric,
  portfolio_count bigint
) 
LANGUAGE plpgsql 
SECURITY DEFINER 
SET search_path = public
AS $$
BEGIN
  -- Only allow users to query their own data
  IF user_uuid != auth.uid() THEN
    RAISE EXCEPTION 'Access denied';
  END IF;

  RETURN QUERY
  WITH portfolio_values AS (
    SELECT 
      p.user_id,
      COALESCE(SUM(p.shares * p.current_price), 0) as portfolio_value,
      COUNT(*) as stock_count
    FROM portfolios p
    WHERE p.user_id = user_uuid
    GROUP BY p.user_id
  ),
  user_totals AS (
    SELECT 
      prof.user_id,
      prof.user_group,
      prof.virtual_coins,
      COALESCE(pv.portfolio_value, 0) as portfolio_value,
      COALESCE(pv.stock_count, 0) as portfolio_count,
      (prof.virtual_coins + COALESCE(pv.portfolio_value, 0)) as total_value
    FROM profiles prof
    LEFT JOIN portfolio_values pv ON prof.user_id = pv.user_id
  ),
  all_users AS (
    SELECT 
      user_id,
      user_group,
      total_value,
      ROW_NUMBER() OVER (ORDER BY total_value DESC) as global_rank,
      ROW_NUMBER() OVER (PARTITION BY user_group ORDER BY total_value DESC) as group_rank
    FROM user_totals
  ),
  current_user AS (
    SELECT 
      ut.total_value,
      CASE 
        WHEN ut.total_value > 10000 THEN ((ut.total_value - 10000) / 10000.0) * 100
        ELSE ((ut.total_value - 10000) / 10000.0) * 100
      END as return_percentage,
      ut.portfolio_count,
      au.global_rank,
      au.group_rank
    FROM user_totals ut
    JOIN all_users au ON ut.user_id = au.user_id
    WHERE ut.user_id = user_uuid
  )
  SELECT 
    cu.global_rank,
    cu.group_rank,
    cu.total_value,
    cu.return_percentage,
    cu.portfolio_count
  FROM current_user cu;
END;
$$;
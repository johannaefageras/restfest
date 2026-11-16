-- Gives a visitor's try back when Claude never answered (the API was busy or unreachable), so a failure
-- that cost nothing doesn't use up one of the day's fridge photos or recipes. Removes the newest request
-- ai_allow recorded for this visitor and kind. Called by the Edge Functions (refundCap in _shared/limits.ts).
create function public.ai_refund(p_kind text, p_ip_hash text)
returns void
language sql
security definer
set search_path = public
as $$
  delete from ai_requests
  where id = (
    select id from ai_requests
    where kind = p_kind and ip_hash = p_ip_hash and created_at > now() - interval '1 day'
    order by created_at desc, id desc
    limit 1
  );
$$;

revoke execute on function public.ai_refund(text, text) from public, anon, authenticated;

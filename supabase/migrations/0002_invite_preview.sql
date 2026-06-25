-- Lets an unauthenticated or non-member visitor preview an invite by its
-- (effectively unguessable UUID) token, without granting broad SELECT access
-- to family_invites via RLS — RLS there is still scoped to existing family
-- members only. Returns only what's needed to render the accept-invite page.
create or replace function public.get_invite_preview(_token uuid)
returns table (
  family_name text,
  invited_role text,
  status text,
  expires_at timestamptz
)
language plpgsql security definer
set search_path = public
as $$
begin
  return query
  select f.name, fi.invited_role, fi.status, fi.expires_at
  from public.family_invites fi
  join public.families f on f.id = fi.family_id
  where fi.token = _token;
end;
$$;

grant execute on function public.get_invite_preview(uuid) to authenticated, anon;

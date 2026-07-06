-- Security hardening per AUDIT_REPORT.md (2026-07-02): C1, C2, H2, M1, M2, M5, L7.
-- Memberships are created ONLY by the security-definer RPCs
-- (create_family_with_owner, accept_family_invite); direct client writes to
-- sensitive columns are removed below via policy drops and column-level grants.

-- =========================================================================
-- C1: any authenticated user could insert themselves into any family.
-- The app never inserts into family_members from the client; both RPCs
-- bypass RLS, so this policy was pure attack surface.
-- =========================================================================
drop policy "Users can insert their own membership" on public.family_members;

-- =========================================================================
-- C2: the UPDATE policy had no with-check, so a member could move their row
-- to another family_id or escalate role. Members only legitimately edit
-- display_name/color; lock everything else with column-level grants.
-- =========================================================================
revoke update on public.family_members from authenticated;
grant update (display_name, color) on public.family_members to authenticated;

-- =========================================================================
-- H2: direct UPDATE let members bypass the invite/swap state machines.
-- State transitions stay RPC-only; the app's revokeInvite needs status.
-- =========================================================================
revoke update on public.families from authenticated;
grant update (name) on public.families to authenticated;

revoke update on public.family_invites from authenticated;
grant update (status) on public.family_invites to authenticated;

-- Swap status/response transitions go through accept_swap_request /
-- decline_swap_request only. No direct column updates until the swap UI
-- needs them (then add a cancel_swap_request RPC, not a grant).
revoke update on public.swap_requests from authenticated;

-- =========================================================================
-- L7: invite INSERT could hand-craft token/status/expires_at. Restrict the
-- insertable columns to what the app actually sends; defaults fill the rest.
-- =========================================================================
revoke insert on public.family_invites from authenticated;
grant insert (family_id, invited_email, invited_role, invited_by)
  on public.family_invites to authenticated;

-- =========================================================================
-- M2: prevent duplicate pending invites for the same email in a family.
-- (If this fails on an existing database, clear duplicate pending invites
-- first: keep the newest, revoke the rest.)
-- =========================================================================
create unique index family_invites_one_pending_per_email
  on public.family_invites (family_id, lower(invited_email))
  where status = 'pending';

-- =========================================================================
-- M5: the app assumes one family per user; enforce it in both RPCs.
-- Exception messages are stable codes the app maps to friendly copy.
-- =========================================================================
create or replace function public.create_family_with_owner(
  _name text,
  _display_name text,
  _color text default '#3b82f6'
)
returns uuid
language plpgsql security definer
set search_path = public
as $$
declare
  _family_id uuid;
begin
  if exists (select 1 from public.family_members where user_id = auth.uid()) then
    raise exception 'already_in_family';
  end if;

  insert into public.families (name, created_by)
  values (_name, auth.uid())
  returning id into _family_id;

  insert into public.family_members (family_id, user_id, role, display_name, color)
  values (_family_id, auth.uid(), 'parent', _display_name, _color);

  return _family_id;
end;
$$;

-- =========================================================================
-- M1 (decided 2026-07-06: bind invites to the invited email) + M2 + M5.
-- An invite can only be accepted by a user logged in with the exact email
-- it was sent to; joining while already in a family raises instead of
-- silently burning the invite.
-- =========================================================================
create or replace function public.accept_family_invite(
  _token uuid,
  _display_name text,
  _color text default '#3b82f6'
)
returns uuid
language plpgsql security definer
set search_path = public
as $$
declare
  _invite record;
begin
  select * into _invite
  from public.family_invites
  where token = _token and status = 'pending' and expires_at > now();

  if not found then
    raise exception 'invite_not_found';
  end if;

  if lower(coalesce(auth.jwt() ->> 'email', '')) <> lower(_invite.invited_email) then
    raise exception 'invite_email_mismatch';
  end if;

  if exists (select 1 from public.family_members where user_id = auth.uid()) then
    raise exception 'already_in_family';
  end if;

  insert into public.family_members (family_id, user_id, role, display_name, color)
  values (_invite.family_id, auth.uid(), _invite.invited_role, _display_name, _color);

  update public.family_invites
  set status = 'accepted'
  where id = _invite.id;

  return _invite.family_id;
end;
$$;

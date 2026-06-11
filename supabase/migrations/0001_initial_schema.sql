-- FTP (Forward Thinking Parents) initial schema
-- Tables, RLS policies, and helper functions for the MVP:
-- families, membership/invites, children, custody schedules + overrides,
-- swap requests, notifications, notes/reminders.

create extension if not exists pgcrypto;

-- =========================================
-- families
-- =========================================
create table public.families (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  created_by uuid not null references auth.users(id),
  created_at timestamptz not null default now()
);

-- =========================================
-- family_members
-- =========================================
create table public.family_members (
  id uuid primary key default gen_random_uuid(),
  family_id uuid not null references public.families(id) on delete cascade,
  user_id uuid not null references auth.users(id),
  role text not null check (role in ('parent','co_parent','guardian')),
  display_name text not null,
  color text not null default '#3b82f6',
  created_at timestamptz not null default now(),
  unique (family_id, user_id)
);

create index family_members_family_id_idx on public.family_members (family_id);
create index family_members_user_id_idx on public.family_members (user_id);

-- =========================================
-- family_invites
-- =========================================
create table public.family_invites (
  id uuid primary key default gen_random_uuid(),
  family_id uuid not null references public.families(id) on delete cascade,
  invited_email text not null,
  invited_role text not null check (invited_role in ('co_parent','guardian')),
  token uuid not null default gen_random_uuid() unique,
  status text not null default 'pending' check (status in ('pending','accepted','expired','revoked')),
  invited_by uuid not null references auth.users(id),
  created_at timestamptz not null default now(),
  expires_at timestamptz not null default (now() + interval '7 days')
);

create index family_invites_family_id_idx on public.family_invites (family_id);

-- =========================================
-- children (parent-managed profiles, no auth account)
-- =========================================
create table public.children (
  id uuid primary key default gen_random_uuid(),
  family_id uuid not null references public.families(id) on delete cascade,
  first_name text not null,
  date_of_birth date,
  avatar_url text,
  created_by uuid not null references auth.users(id),
  created_at timestamptz not null default now()
);

create index children_family_id_idx on public.children (family_id);

-- =========================================
-- custody_schedules (recurring pattern definition)
-- =========================================
create table public.custody_schedules (
  id uuid primary key default gen_random_uuid(),
  family_id uuid not null references public.families(id) on delete cascade,
  name text not null,
  pattern_type text not null check (pattern_type in ('weekly','alternating_weeks','custom')),
  cycle_start_date date not null,
  cycle_length_days int not null default 7,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create index custody_schedules_family_id_idx on public.custody_schedules (family_id);

-- =========================================
-- custody_schedule_blocks (who has custody during which days of the cycle)
-- =========================================
create table public.custody_schedule_blocks (
  id uuid primary key default gen_random_uuid(),
  schedule_id uuid not null references public.custody_schedules(id) on delete cascade,
  parent_member_id uuid not null references public.family_members(id) on delete cascade,
  cycle_day_start int not null,
  cycle_day_end int not null,
  start_time time not null default '00:00',
  end_time time not null default '00:00',
  label text,
  check (cycle_day_end > cycle_day_start)
);

create index custody_schedule_blocks_schedule_id_idx on public.custody_schedule_blocks (schedule_id);

-- =========================================
-- swap_requests
-- =========================================
create table public.swap_requests (
  id uuid primary key default gen_random_uuid(),
  family_id uuid not null references public.families(id) on delete cascade,
  requested_by uuid not null references public.family_members(id) on delete cascade,
  responder_id uuid references public.family_members(id) on delete set null,
  request_type text not null check (request_type in ('swap','give_up','request_time')),
  affected_dates date[] not null,
  proposed_assigned_member_id uuid not null references public.family_members(id),
  message text,
  status text not null default 'pending' check (status in ('pending','accepted','declined','cancelled')),
  responded_at timestamptz,
  response_message text,
  created_at timestamptz not null default now()
);

create index swap_requests_family_id_idx on public.swap_requests (family_id);

-- =========================================
-- custody_overrides (one-off exceptions, authoritative over the recurring pattern)
-- =========================================
create table public.custody_overrides (
  id uuid primary key default gen_random_uuid(),
  family_id uuid not null references public.families(id) on delete cascade,
  schedule_id uuid references public.custody_schedules(id) on delete set null,
  date date not null,
  assigned_member_id uuid not null references public.family_members(id),
  reason text,
  created_by uuid not null references auth.users(id),
  source_request_id uuid references public.swap_requests(id) on delete set null,
  created_at timestamptz not null default now(),
  unique (family_id, date)
);

create index custody_overrides_family_id_date_idx on public.custody_overrides (family_id, date);

-- =========================================
-- notifications
-- =========================================
create table public.notifications (
  id uuid primary key default gen_random_uuid(),
  family_id uuid not null references public.families(id) on delete cascade,
  recipient_user_id uuid not null references auth.users(id),
  type text not null check (type in (
    'swap_request_new','swap_request_accepted','swap_request_declined',
    'upcoming_change_reminder','family_invite','note_reminder'
  )),
  title text not null,
  body text not null,
  related_request_id uuid references public.swap_requests(id) on delete set null,
  is_read boolean not null default false,
  email_sent_at timestamptz,
  created_at timestamptz not null default now()
);

create index notifications_recipient_idx on public.notifications (recipient_user_id, is_read);

-- =========================================
-- notes (standalone notes/reminders for family members and children)
-- =========================================
create table public.notes (
  id uuid primary key default gen_random_uuid(),
  family_id uuid not null references public.families(id) on delete cascade,
  author_member_id uuid not null references public.family_members(id) on delete cascade,
  title text not null,
  body text,
  target_type text not null default 'family' check (target_type in ('family','member','child')),
  target_id uuid,
  reminder_at timestamptz,
  is_done boolean not null default false,
  created_at timestamptz not null default now()
);

create index notes_family_id_idx on public.notes (family_id);

-- =========================================================================
-- Helper & security-definer functions
-- =========================================================================

-- Is the current user a member of the given family?
create or replace function public.is_family_member(_family_id uuid)
returns boolean
language sql security definer stable
set search_path = public
as $$
  select exists (
    select 1 from public.family_members
    where family_id = _family_id and user_id = auth.uid()
  );
$$;

grant execute on function public.is_family_member(uuid) to authenticated;

-- Create a new family and add the calling user as its first ('parent') member.
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
  insert into public.families (name, created_by)
  values (_name, auth.uid())
  returning id into _family_id;

  insert into public.family_members (family_id, user_id, role, display_name, color)
  values (_family_id, auth.uid(), 'parent', _display_name, _color);

  return _family_id;
end;
$$;

grant execute on function public.create_family_with_owner(text, text, text) to authenticated;

-- Accept a pending family invite by token, adding the calling user as a member.
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
    raise exception 'Invite not found or expired';
  end if;

  insert into public.family_members (family_id, user_id, role, display_name, color)
  values (_invite.family_id, auth.uid(), _invite.invited_role, _display_name, _color)
  on conflict (family_id, user_id) do nothing;

  update public.family_invites
  set status = 'accepted'
  where id = _invite.id;

  return _invite.family_id;
end;
$$;

grant execute on function public.accept_family_invite(uuid, text, text) to authenticated;

-- Accept a pending swap request: write custody_overrides for each affected date
-- and mark the request accepted, atomically.
create or replace function public.accept_swap_request(_request_id uuid)
returns void
language plpgsql security definer
set search_path = public
as $$
declare
  _req record;
  _d date;
begin
  select * into _req from public.swap_requests where id = _request_id;

  if not found then
    raise exception 'Swap request not found';
  end if;

  if _req.status <> 'pending' then
    raise exception 'Swap request is not pending';
  end if;

  if not public.is_family_member(_req.family_id) then
    raise exception 'Not authorized';
  end if;

  foreach _d in array _req.affected_dates loop
    insert into public.custody_overrides
      (family_id, date, assigned_member_id, reason, created_by, source_request_id)
    values
      (_req.family_id, _d, _req.proposed_assigned_member_id, 'Swap request accepted', auth.uid(), _req.id)
    on conflict (family_id, date) do update
      set assigned_member_id = excluded.assigned_member_id,
          reason = excluded.reason,
          source_request_id = excluded.source_request_id,
          created_by = excluded.created_by;
  end loop;

  update public.swap_requests
  set status = 'accepted', responded_at = now()
  where id = _request_id;
end;
$$;

grant execute on function public.accept_swap_request(uuid) to authenticated;

-- Decline a pending swap request.
create or replace function public.decline_swap_request(_request_id uuid, _response_message text default null)
returns void
language plpgsql security definer
set search_path = public
as $$
begin
  update public.swap_requests
  set status = 'declined', responded_at = now(), response_message = _response_message
  where id = _request_id
    and status = 'pending'
    and public.is_family_member(family_id);

  if not found then
    raise exception 'Swap request not found or not pending';
  end if;
end;
$$;

grant execute on function public.decline_swap_request(uuid, text) to authenticated;

-- =========================================================================
-- Row Level Security
-- =========================================================================

alter table public.families enable row level security;
alter table public.family_members enable row level security;
alter table public.family_invites enable row level security;
alter table public.children enable row level security;
alter table public.custody_schedules enable row level security;
alter table public.custody_schedule_blocks enable row level security;
alter table public.custody_overrides enable row level security;
alter table public.swap_requests enable row level security;
alter table public.notifications enable row level security;
alter table public.notes enable row level security;

-- families
create policy "Members can view their families"
  on public.families for select
  using (public.is_family_member(id));

create policy "Authenticated users can create families"
  on public.families for insert
  with check (auth.uid() = created_by);

create policy "Members can update their families"
  on public.families for update
  using (public.is_family_member(id));

-- family_members
create policy "Members can view family members"
  on public.family_members for select
  using (public.is_family_member(family_id));

create policy "Users can insert their own membership"
  on public.family_members for insert
  with check (user_id = auth.uid());

create policy "Members can update their own membership row"
  on public.family_members for update
  using (user_id = auth.uid());

-- family_invites
create policy "Members can view invites for their family"
  on public.family_invites for select
  using (public.is_family_member(family_id));

create policy "Members can create invites"
  on public.family_invites for insert
  with check (public.is_family_member(family_id) and invited_by = auth.uid());

create policy "Members can update invites"
  on public.family_invites for update
  using (public.is_family_member(family_id));

-- children
create policy "Members can view children"
  on public.children for select
  using (public.is_family_member(family_id));

create policy "Members can insert children"
  on public.children for insert
  with check (public.is_family_member(family_id) and created_by = auth.uid());

create policy "Members can update children"
  on public.children for update
  using (public.is_family_member(family_id));

create policy "Members can delete children"
  on public.children for delete
  using (public.is_family_member(family_id));

-- custody_schedules
create policy "Members can view schedules"
  on public.custody_schedules for select
  using (public.is_family_member(family_id));

create policy "Members can insert schedules"
  on public.custody_schedules for insert
  with check (public.is_family_member(family_id));

create policy "Members can update schedules"
  on public.custody_schedules for update
  using (public.is_family_member(family_id));

create policy "Members can delete schedules"
  on public.custody_schedules for delete
  using (public.is_family_member(family_id));

-- custody_schedule_blocks (joins through custody_schedules.family_id)
create policy "Members can view schedule blocks"
  on public.custody_schedule_blocks for select
  using (exists (
    select 1 from public.custody_schedules s
    where s.id = schedule_id and public.is_family_member(s.family_id)
  ));

create policy "Members can insert schedule blocks"
  on public.custody_schedule_blocks for insert
  with check (exists (
    select 1 from public.custody_schedules s
    where s.id = schedule_id and public.is_family_member(s.family_id)
  ));

create policy "Members can update schedule blocks"
  on public.custody_schedule_blocks for update
  using (exists (
    select 1 from public.custody_schedules s
    where s.id = schedule_id and public.is_family_member(s.family_id)
  ));

create policy "Members can delete schedule blocks"
  on public.custody_schedule_blocks for delete
  using (exists (
    select 1 from public.custody_schedules s
    where s.id = schedule_id and public.is_family_member(s.family_id)
  ));

-- custody_overrides
create policy "Members can view overrides"
  on public.custody_overrides for select
  using (public.is_family_member(family_id));

create policy "Members can insert overrides"
  on public.custody_overrides for insert
  with check (public.is_family_member(family_id));

create policy "Members can update overrides"
  on public.custody_overrides for update
  using (public.is_family_member(family_id));

create policy "Members can delete overrides"
  on public.custody_overrides for delete
  using (public.is_family_member(family_id));

-- swap_requests
create policy "Members can view swap requests"
  on public.swap_requests for select
  using (public.is_family_member(family_id));

create policy "Members can create swap requests"
  on public.swap_requests for insert
  with check (
    public.is_family_member(family_id)
    and exists (
      select 1 from public.family_members fm
      where fm.id = requested_by and fm.user_id = auth.uid()
    )
  );

create policy "Members can update swap requests"
  on public.swap_requests for update
  using (public.is_family_member(family_id));

-- notifications (no client insert policy: written server-side / via functions)
create policy "Recipients can view their notifications"
  on public.notifications for select
  using (recipient_user_id = auth.uid());

create policy "Recipients can update their notifications"
  on public.notifications for update
  using (recipient_user_id = auth.uid());

-- notes
create policy "Members can view notes"
  on public.notes for select
  using (public.is_family_member(family_id));

create policy "Members can create notes"
  on public.notes for insert
  with check (
    public.is_family_member(family_id)
    and exists (
      select 1 from public.family_members fm
      where fm.id = author_member_id and fm.user_id = auth.uid()
    )
  );

create policy "Members can update notes"
  on public.notes for update
  using (public.is_family_member(family_id));

create policy "Members can delete notes"
  on public.notes for delete
  using (public.is_family_member(family_id));

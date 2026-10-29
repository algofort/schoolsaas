-- Shared Gate 0. Apply once to the designated school development project.
begin;

create schema if not exists school_private;
revoke all on schema school_private from public, anon;
grant usage on schema school_private to authenticated;

create table public.schools (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(btrim(name)) between 2 and 120),
  timezone text not null default 'Asia/Karachi' check (timezone = 'Asia/Karachi'),
  currency text not null default 'PKR' check (currency = 'PKR'),
  created_by uuid not null unique references auth.users(id),
  created_at timestamptz not null default now()
);
create table public.school_memberships (
  school_id uuid not null references public.schools(id),
  user_id uuid not null references auth.users(id),
  role text not null check (role in ('owner', 'admin', 'teacher', 'staff', 'accountant')),
  active boolean not null default true,
  created_at timestamptz not null default now(),
  primary key (school_id, user_id)
);
create index school_memberships_user_idx on public.school_memberships(user_id, school_id) where active;

create table public.branches (
  id uuid primary key default gen_random_uuid(),
  school_id uuid not null references public.schools(id),
  name text not null check (char_length(btrim(name)) between 2 and 100),
  created_at timestamptz not null default now(),
  unique (school_id, id),
  unique (school_id, name)
);
create table public.academic_sessions (
  id uuid primary key default gen_random_uuid(),
  school_id uuid not null references public.schools(id),
  name text not null check (char_length(btrim(name)) between 2 and 60),
  starts_on date not null,
  ends_on date not null check (ends_on >= starts_on),
  created_at timestamptz not null default now(),
  unique (school_id, id),
  unique (school_id, name)
);
create table public.classes (
  id uuid primary key default gen_random_uuid(),
  school_id uuid not null references public.schools(id),
  branch_id uuid not null,
  name text not null check (char_length(btrim(name)) between 1 and 60),
  created_at timestamptz not null default now(),
  unique (school_id, id),
  unique (school_id, branch_id, name),
  foreign key (school_id, branch_id) references public.branches(school_id, id)
);
create table public.sections (
  id uuid primary key default gen_random_uuid(),
  school_id uuid not null references public.schools(id),
  class_id uuid not null,
  name text not null check (char_length(btrim(name)) between 1 and 40),
  created_at timestamptz not null default now(),
  unique (school_id, id),
  unique (school_id, class_id, name),
  foreign key (school_id, class_id) references public.classes(school_id, id)
);
create table public.audit_events (
  id uuid primary key default gen_random_uuid(),
  school_id uuid not null references public.schools(id),
  actor_id uuid references auth.users(id),
  action text not null,
  entity_id uuid not null,
  created_at timestamptz not null default now()
);
create index audit_events_school_created_idx on public.audit_events(school_id, created_at desc);
create index audit_events_actor_idx on public.audit_events(actor_id);

-- Helpers bypass membership RLS solely to look up the CURRENT user, never a supplied user ID.
-- Hidden schema prevents direct Data API RPC exposure. EXECUTE is explicitly restricted below.
create function school_private.has_school_access(target_school uuid)
returns boolean language sql stable security definer set search_path = '' as $$
  select auth.uid() is not null and exists (
    select 1 from public.school_memberships m
    where m.school_id = target_school and m.user_id = (select auth.uid()) and m.active
  );
$$;
create function school_private.can_manage_school(target_school uuid)
returns boolean language sql stable security definer set search_path = '' as $$
  select auth.uid() is not null and exists (
    select 1 from public.school_memberships m
    where m.school_id = target_school and m.user_id = (select auth.uid())
      and m.active and m.role in ('owner', 'admin')
  );
$$;
revoke all on function school_private.has_school_access(uuid), school_private.can_manage_school(uuid) from public, anon;
grant execute on function school_private.has_school_access(uuid), school_private.can_manage_school(uuid) to authenticated;

alter table public.schools enable row level security;
alter table public.school_memberships enable row level security;
alter table public.branches enable row level security;
alter table public.academic_sessions enable row level security;
alter table public.classes enable row level security;
alter table public.sections enable row level security;
alter table public.audit_events enable row level security;

-- Clear platform defaults. No direct membership/owner/audit write privileges.
revoke all on public.schools, public.school_memberships, public.branches, public.academic_sessions,
  public.classes, public.sections, public.audit_events from anon, authenticated;
grant select on public.schools, public.school_memberships, public.audit_events to authenticated;
grant update (name) on public.schools to authenticated;
grant select, insert, update on public.branches, public.academic_sessions, public.classes, public.sections to authenticated;

create policy schools_read on public.schools for select to authenticated
  using (school_private.has_school_access(id));
create policy schools_rename on public.schools for update to authenticated
  using (school_private.can_manage_school(id)) with check (school_private.can_manage_school(id));
create policy own_membership_read on public.school_memberships for select to authenticated
  using (user_id = (select auth.uid()) and active);
create policy audit_read on public.audit_events for select to authenticated
  using (school_private.can_manage_school(school_id));

do $$
declare t text;
begin
  foreach t in array array['branches','academic_sessions','classes','sections'] loop
    execute format('create policy %I on public.%I for select to authenticated using (school_private.has_school_access(school_id))', t || '_read', t);
    execute format('create policy %I on public.%I for insert to authenticated with check (school_private.can_manage_school(school_id))', t || '_insert', t);
    execute format('create policy %I on public.%I for update to authenticated using (school_private.can_manage_school(school_id)) with check (school_private.can_manage_school(school_id))', t || '_update', t);
  end loop;
end;
$$;

create function school_private.prevent_tenant_move()
returns trigger language plpgsql security invoker set search_path = '' as $$
begin
  if new.school_id is distinct from old.school_id or new.id is distinct from old.id then
    raise exception 'School and record IDs are immutable' using errcode = '23514';
  end if;
  return new;
end;
$$;
revoke all on function school_private.prevent_tenant_move() from public, anon, authenticated;
do $$
declare t text;
begin
  foreach t in array array['branches','academic_sessions','classes','sections'] loop
    execute format('create trigger prevent_tenant_move before update on public.%I for each row execute function school_private.prevent_tenant_move()', t);
  end loop;
end;
$$;

-- Atomic bootstrap is the only way a signed-in user can create their own initial membership.
-- One owned school per account for this gate; no accepting a role/user ID from the client.
create function school_private.create_school(school_name text, branch_name text)
returns uuid language plpgsql security definer set search_path = '' as $$
declare new_school uuid; current_user_id uuid := auth.uid();
begin
  if current_user_id is null or coalesce(auth.jwt()->>'is_anonymous', 'false') = 'true' then
    raise exception 'A verified account is required' using errcode = '42501';
  end if;
  if not exists (select 1 from auth.users u where u.id = current_user_id and u.email_confirmed_at is not null) then
    raise exception 'Confirm your email first' using errcode = '42501';
  end if;
  if school_name is null or char_length(btrim(school_name)) not between 2 and 120
    or branch_name is null or char_length(btrim(branch_name)) not between 2 and 100 then
    raise exception 'Invalid school or branch name' using errcode = '22023';
  end if;
  insert into public.schools(name, created_by) values (btrim(school_name), current_user_id) returning id into new_school;
  insert into public.school_memberships(school_id, user_id, role) values (new_school, current_user_id, 'owner');
  insert into public.branches(school_id, name) values (new_school, btrim(branch_name));
  insert into public.audit_events(school_id, actor_id, action, entity_id)
    values (new_school, current_user_id, 'school.created', new_school);
  return new_school;
end;
$$;
revoke all on function school_private.create_school(text,text) from public, anon;
grant execute on function school_private.create_school(text,text) to authenticated;

create function public.create_school(school_name text, branch_name text)
returns uuid language sql security invoker set search_path = '' as $$
  select school_private.create_school(school_name, branch_name);
$$;
revoke all on function public.create_school(text,text) from public, anon;
grant execute on function public.create_school(text,text) to authenticated;

comment on table public.school_memberships is 'Authorization source. No client writes. Provision team access through reviewed administration only.';
comment on table public.audit_events is 'Append-only audit store; foundation currently records school bootstrap only.';
notify pgrst, 'reload schema';
commit;

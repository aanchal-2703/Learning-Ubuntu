-- Apply in the Supabase SQL Editor for the requested public, no-login app.
-- This intentionally lets anyone with the public API key browse event/user IDs,
-- create open events, and create/read registrations. No update/delete is granted.

alter table public.events enable row level security;
alter table public.users enable row level security;
alter table public.registrations enable row level security;

grant usage on schema public to anon;
grant select on table public.events to anon;
grant insert (organizer_id, title, capacity, status) on table public.events to anon;
grant select (id, role) on table public.users to anon;
grant select, insert on table public.registrations to anon;

drop policy if exists pulse_public_events_read on public.events;
create policy pulse_public_events_read
  on public.events for select to anon
  using (true);

drop policy if exists pulse_public_events_create on public.events;
create policy pulse_public_events_create
  on public.events for insert to anon
  with check (
    status = 'open'
    and exists (select 1 from public.users u where u.id = organizer_id)
  );

drop policy if exists pulse_public_users_read_ids on public.users;
create policy pulse_public_users_read_ids
  on public.users for select to anon
  using (true);

drop policy if exists pulse_public_registrations_read on public.registrations;
create policy pulse_public_registrations_read
  on public.registrations for select to anon
  using (true);

drop policy if exists pulse_public_registrations_create on public.registrations;
create policy pulse_public_registrations_create
  on public.registrations for insert to anon
  with check (
    exists (
      select 1 from public.events e
      where e.id = event_id and e.status = 'open'
    )
    and exists (select 1 from public.users u where u.id = user_id)
  );

-- ============================================================================
-- Admin board security (run in Supabase → SQL Editor)
--
-- STEP 1: run this whole section once.
--   - Creates an `admins` table keyed by user id (not by email).
--   - Replaces every existing RLS policy on "Attendance" with:
--       * members can add attendance only for themselves
--       * members can read only their own attendance
--       * admins can read everyone's attendance
--   - Nobody can update or delete attendance from the app.
-- ============================================================================

-- 1. Admins table -------------------------------------------------------------
create table if not exists public.admins (
  user_id uuid primary key references auth.users (id) on delete cascade,
  created_at timestamptz not null default now()
);

alter table public.admins enable row level security;

-- A signed-in user may see only their own row, which is how the admin page
-- knows whether to show the board. There are no insert/update/delete
-- policies, so admins can only be added here in the SQL editor.
drop policy if exists "Users can see their own admin row" on public.admins;
create policy "Users can see their own admin row"
  on public.admins
  for select
  to authenticated
  using (user_id = (select auth.uid()));

-- Add the admin accounts (they must already be registered).
insert into public.admins (user_id)
select id
from auth.users
where email in (
  'victor.ava.ivanov@gmail.com',
  'info@lisichka-muenchen.de'
)
on conflict (user_id) do nothing;

-- 2. is_admin() helper ----------------------------------------------------------
-- SECURITY DEFINER so the Attendance policy can check `admins` regardless of
-- the caller's own access to that table.
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.admins where user_id = (select auth.uid())
  );
$$;

revoke execute on function public.is_admin() from public, anon;
grant execute on function public.is_admin() to authenticated;

-- 3. Attendance policies ---------------------------------------------------------
alter table public."Attendance" enable row level security;

-- Remove the old policies (including the email-based admin policy),
-- whatever they were named.
do $$
declare
  p record;
begin
  for p in
    select policyname
    from pg_policies
    where schemaname = 'public' and tablename = 'Attendance'
  loop
    execute format('drop policy %I on public."Attendance"', p.policyname);
  end loop;
end $$;

create policy "Members add their own attendance"
  on public."Attendance"
  for insert
  to authenticated
  with check (user_id = (select auth.uid()));

create policy "Members read own attendance, admins read all"
  on public."Attendance"
  for select
  to authenticated
  using (user_id = (select auth.uid()) or (select public.is_admin()));


-- ============================================================================
-- STEP 2 (after the new app code is deployed): delete the stored emails.
--
-- The app no longer writes emails into "Attendance". Once the new version is
-- live on Vercel, uncomment and run this to remove the column and the emails
-- already stored in it. This cannot be undone.
-- ============================================================================

alter table public."Attendance" drop column email;


-- ============================================================================
-- Check: list the policies now on these tables.
-- ============================================================================
-- select tablename, policyname, cmd, roles, qual, with_check
-- from pg_policies
-- where schemaname = 'public' and tablename in ('Attendance', 'admins');


-- ===========================================================================

--ADD A NEW ADMIN
-- insert into public.admins (user_id) select id from auth.users where email = 'someone@example.com';


-- ============================================================================
-- VERIFY: run a query as a specific signed-in user.
--
-- Put a member's email in the marked spot, run the whole block, then repeat
-- with an admin's email. Everything is rolled back, so it changes nothing.
--
-- Expected for a normal member:  is_admin = false, other_peoples_rows = 0
-- Expected for an admin:         is_admin = true,  other_peoples_rows > 0
--                                (if anyone else has checked in)
-- ============================================================================

begin;
  select set_config(
    'request.jwt.claims',
    (select json_build_object('sub', id, 'role', 'authenticated')::text
       from auth.users
      where email = 'someone@example.com'),   -- <-- email to test
    true
  );
  set local role authenticated;

  select
    public.is_admin()                                          as is_admin,
    (select count(*) from public."Attendance")                 as visible_rows,
    (select count(*) from public."Attendance"
      where user_id <> auth.uid())                             as other_peoples_rows,
    (select count(*) from public.admins)                       as visible_admin_rows;
rollback;

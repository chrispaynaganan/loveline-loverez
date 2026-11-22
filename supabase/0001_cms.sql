-- Boses Filipina CMS: tables, security rules and file storage.
-- Run once in Supabase → SQL Editor. Safe to run again.

-- ---------------------------------------------------------------
-- Who can edit: anyone signed in whose email is listed here.
-- ---------------------------------------------------------------
create table if not exists public.editors (
  email text primary key
);
alter table public.editors enable row level security;

create or replace function public.is_editor()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.editors
    where lower(email) = lower(coalesce(auth.jwt() ->> 'email', ''))
  );
$$;

drop policy if exists "editors see themselves" on public.editors;
create policy "editors see themselves" on public.editors
  for select to authenticated using (public.is_editor());

-- ---------------------------------------------------------------
-- Single-value settings: the profile/about content and the rate card's notes.
-- ---------------------------------------------------------------
create table if not exists public.site_settings (
  key text primary key,
  value jsonb not null,
  updated_at timestamptz not null default now()
);

-- ---------------------------------------------------------------
-- Lists
-- ---------------------------------------------------------------
create table if not exists public.demo_reels (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  category text not null default '',
  blurb text not null default '',
  duration text,
  source jsonb not null default '{"kind":"none"}',
  is_new boolean not null default false,
  featured boolean not null default true,
  paper text not null default 'cream' check (paper in ('kraft','blush','butter','sage','cream')),
  sort integer not null default 0,
  published boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.video_reels (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  client text not null default '',
  label text not null default '',
  blurb text not null default '',
  duration text,
  poster text not null default '',
  orientation text not null default 'landscape' check (orientation in ('portrait','landscape')),
  source jsonb not null default '{"kind":"none"}',
  sort integer not null default 0,
  published boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.rates (
  id uuid primary key default gen_random_uuid(),
  grp text not null default 'Commercial',
  service text not null,
  unit text not null default '',
  price_php numeric,
  price_usd numeric,
  note text,
  sort integer not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.testimonials (
  id uuid primary key default gen_random_uuid(),
  quote text not null,
  highlights text[] not null default '{}',
  role text not null default '',
  company text not null default '',
  sort integer not null default 0,
  published boolean not null default true,
  created_at timestamptz not null default now()
);

-- Bookings sent from the contact page
create table if not exists public.inquiries (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  name text not null check (char_length(name) between 1 and 200),
  email text not null check (char_length(email) between 3 and 320),
  project_type text check (char_length(project_type) <= 200),
  script_length text check (char_length(script_length) <= 200),
  deadline date,
  message text not null check (char_length(message) between 1 and 5000),
  status text not null default 'new' check (status in ('new','replied','archived'))
);

-- ---------------------------------------------------------------
-- Security rules
--   Everyone can read published content. Only editors can change it.
--   Visitors can send an inquiry but never read them.
-- ---------------------------------------------------------------
do $$
declare t text;
begin
  foreach t in array array['site_settings','demo_reels','video_reels','rates','testimonials'] loop
    execute format('alter table public.%I enable row level security', t);
    execute format('drop policy if exists "public reads" on public.%I', t);
    execute format('drop policy if exists "editors write" on public.%I', t);
    execute format('create policy "editors write" on public.%I for all to authenticated using (public.is_editor()) with check (public.is_editor())', t);
  end loop;
end $$;

create policy "public reads" on public.site_settings for select using (true);
create policy "public reads" on public.rates for select using (true);
create policy "public reads" on public.demo_reels for select using (published or public.is_editor());
create policy "public reads" on public.video_reels for select using (published or public.is_editor());
create policy "public reads" on public.testimonials for select using (published or public.is_editor());

alter table public.inquiries enable row level security;
drop policy if exists "visitors send" on public.inquiries;
drop policy if exists "editors manage" on public.inquiries;
create policy "visitors send" on public.inquiries for insert to anon, authenticated with check (status = 'new');
create policy "editors manage" on public.inquiries for all to authenticated using (public.is_editor()) with check (public.is_editor());

-- ---------------------------------------------------------------
-- Table access for the website's key (newer projects don't grant it by default).
-- The rules above still decide what each person can see or change.
-- ---------------------------------------------------------------
grant usage on schema public to anon, authenticated;
grant select on public.site_settings, public.demo_reels, public.video_reels, public.rates, public.testimonials to anon, authenticated;
grant insert, update, delete on public.site_settings, public.demo_reels, public.video_reels, public.rates, public.testimonials to authenticated;
grant insert on public.inquiries to anon, authenticated;
grant select, update, delete on public.inquiries to authenticated;
grant select on public.editors to authenticated;
grant execute on function public.is_editor() to anon, authenticated;

-- ---------------------------------------------------------------
-- File storage for audio, video and images (public to read, editors upload)
-- ---------------------------------------------------------------
insert into storage.buckets (id, name, public)
values ('media', 'media', true)
on conflict (id) do update set public = true;

drop policy if exists "editors upload media" on storage.objects;
drop policy if exists "editors update media" on storage.objects;
drop policy if exists "editors delete media" on storage.objects;
create policy "editors upload media" on storage.objects
  for insert to authenticated with check (bucket_id = 'media' and public.is_editor());
create policy "editors update media" on storage.objects
  for update to authenticated using (bucket_id = 'media' and public.is_editor());
create policy "editors delete media" on storage.objects
  for delete to authenticated using (bucket_id = 'media' and public.is_editor());

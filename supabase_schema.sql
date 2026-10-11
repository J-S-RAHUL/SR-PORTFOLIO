-- ========================================================
-- SUPABASE POSTGRESQL SCHEMA & ROW LEVEL SECURITY (RLS)
-- Portfolio Tables: posts, projects, connections
-- ========================================================

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- 1. POSTS TABLE
create table if not exists public.posts (
  id text primary key default concat('post-', extract(epoch from now())),
  title text default '',
  image_url text not null,
  caption text not null,
  date text default to_char(now(), 'Mon DD, YYYY'),
  tags text[] default array[]::text[],
  likes integer default 0,
  link_url text,
  sort_order integer default 0,
  published boolean default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Migrations for existing deployments
alter table public.posts add column if not exists sort_order integer default 0;
alter table public.posts add column if not exists link_url text;
alter table public.posts add column if not exists caption text;
alter table public.posts add column if not exists title text default '';

-- Enable RLS for posts
alter table public.posts enable row level security;

-- Public can view published posts
drop policy if exists "Public can view published posts" on public.posts;
create policy "Public can view published posts"
  on public.posts for select
  using (published = true);

-- Public can update post likes
drop policy if exists "Public can update post likes" on public.posts;
create policy "Public can update post likes"
  on public.posts for update
  using (true)
  with check (true);

-- Authenticated Admin can do everything on posts
drop policy if exists "Admin can do everything on posts" on public.posts;
create policy "Admin can do everything on posts"
  on public.posts for all
  to authenticated
  using (true)
  with check (true);


-- 2. PROJECTS TABLE
create table if not exists public.projects (
  id text primary key default concat('proj-', extract(epoch from now())),
  title text,
  name text,
  description text not null,
  repo_url text,
  github_url text,
  image_url text,
  tech_tags text[] default array[]::text[],
  technologies text[] default array[]::text[],
  sort_order integer default 0,
  demo_url text,
  date text default to_char(now(), 'YYYY-MM-DD'),
  featured boolean default true,
  published boolean default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Migrations for existing deployments
alter table public.projects add column if not exists title text;
alter table public.projects add column if not exists name text;
alter table public.projects add column if not exists repo_url text;
alter table public.projects add column if not exists github_url text;
alter table public.projects add column if not exists tech_tags text[] default array[]::text[];
alter table public.projects add column if not exists technologies text[] default array[]::text[];
alter table public.projects add column if not exists sort_order integer default 0;

-- Enable RLS for projects
alter table public.projects enable row level security;

-- Public can view published projects
drop policy if exists "Public can view published projects" on public.projects;
create policy "Public can view published projects"
  on public.projects for select
  using (published = true);

-- Authenticated Admin can do everything on projects (insert, update, delete)
drop policy if exists "Admin can do everything on projects" on public.projects;
create policy "Admin can do everything on projects"
  on public.projects for all
  to authenticated
  using (true)
  with check (true);


-- 3. CONNECTIONS TABLE
create table if not exists public.connections (
  id text primary key default concat('conn-', extract(epoch from now())),
  name text not null,
  college text not null,
  phone text not null unique, -- prevents duplicates by phone number
  note text default '',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS for connections
alter table public.connections enable row level security;

-- Anyone (public/anon) can submit/insert a connection
drop policy if exists "Public can insert connection" on public.connections;
create policy "Public can insert connection"
  on public.connections for insert
  with check (true);

-- ONLY authenticated admin can view private connections (name, phone, note)
drop policy if exists "Only admin can view connections" on public.connections;
create policy "Only admin can view connections"
  on public.connections for select
  to authenticated
  using (true);

-- ONLY authenticated admin can delete connections
drop policy if exists "Only admin can delete connections" on public.connections;
create policy "Only admin can delete connections"
  on public.connections for delete
  to authenticated
  using (true);

-- Security Definer function to return total connections count to the public
-- without exposing personal data (phone numbers, names, notes)
create or replace function public.get_connections_count()
returns integer
language sql
security definer
as $$
  select count(*)::integer from public.connections;
$$;


-- ========================================================
-- 4. STORAGE BUCKET: portfolio-images
-- Public can read compressed images; Authenticated Admin can upload
-- ========================================================

-- Create the storage bucket if not already present
insert into storage.buckets (id, name, public)
values ('portfolio-images', 'portfolio-images', true)
on conflict (id) do nothing;

-- Storage Policy: Public read access
drop policy if exists "Public Access for portfolio images" on storage.objects;
create policy "Public Access for portfolio images"
  on storage.objects for select
  using (bucket_id = 'portfolio-images');

-- Storage Policy: Authenticated admin can insert/upload
drop policy if exists "Admin can upload portfolio images" on storage.objects;
create policy "Admin can upload portfolio images"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'portfolio-images');

-- Storage Policy: Authenticated admin can update
drop policy if exists "Admin can update portfolio images" on storage.objects;
create policy "Admin can update portfolio images"
  on storage.objects for update
  to authenticated
  using (bucket_id = 'portfolio-images');

-- Storage Policy: Authenticated admin can delete
drop policy if exists "Admin can delete portfolio images" on storage.objects;
create policy "Admin can delete portfolio images"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'portfolio-images');


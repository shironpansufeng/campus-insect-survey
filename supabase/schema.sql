create extension if not exists "pgcrypto";

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  name text,
  role text not null default 'student' check (role in ('student', 'teacher')),
  created_at timestamptz not null default now()
);

create table if not exists public.insect_records (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  insect_name text not null,
  location text not null,
  habitat text not null,
  count integer not null check (count > 0),
  observed_at date not null,
  note text,
  image_url text,
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected')),
  reviewed_by uuid references public.profiles(id) on delete set null,
  reviewed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_insect_records_updated_at on public.insect_records;
create trigger set_insect_records_updated_at
before update on public.insect_records
for each row
execute function public.set_updated_at();

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, name)
  values (new.id, new.raw_user_meta_data ->> 'name')
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row
execute function public.handle_new_user();

create or replace function public.is_teacher(uid uuid)
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1
    from public.profiles
    where id = uid and role = 'teacher'
  );
$$;

alter table public.profiles enable row level security;
alter table public.insect_records enable row level security;

drop policy if exists "Profiles are viewable by owner or teacher" on public.profiles;
create policy "Profiles are viewable by owner or teacher"
on public.profiles
for select
using (auth.uid() = id or public.is_teacher(auth.uid()));

drop policy if exists "Users can update own profile" on public.profiles;
create policy "Users can update own profile"
on public.profiles
for update
using (auth.uid() = id);

drop policy if exists "Approved records are public" on public.insect_records;
create policy "Approved records are public"
on public.insect_records
for select
using (
  status = 'approved'
  or auth.uid() = user_id
  or public.is_teacher(auth.uid())
);

drop policy if exists "Authenticated users can create pending records" on public.insect_records;
create policy "Authenticated users can create pending records"
on public.insect_records
for insert
with check (
  auth.uid() = user_id
  and status = 'pending'
);

drop policy if exists "Teachers can update records" on public.insect_records;
create policy "Teachers can update records"
on public.insect_records
for update
using (public.is_teacher(auth.uid()))
with check (public.is_teacher(auth.uid()));

insert into storage.buckets (id, name, public)
values ('record-images', 'record-images', true)
on conflict (id) do nothing;

drop policy if exists "Public can read record images" on storage.objects;
create policy "Public can read record images"
on storage.objects
for select
using (bucket_id = 'record-images');

drop policy if exists "Authenticated users can upload record images" on storage.objects;
create policy "Authenticated users can upload record images"
on storage.objects
for insert
with check (
  bucket_id = 'record-images'
  and auth.role() = 'authenticated'
);

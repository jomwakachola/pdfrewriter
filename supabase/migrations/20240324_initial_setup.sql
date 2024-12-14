-- Create a secure profiles table that extends the auth.users table
create table public.profiles (
  id uuid references auth.users on delete cascade not null primary key,
  full_name text,
  avatar_url text,
  website text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  
  -- Add any additional profile fields you need
  bio text,
  location text,
  
  constraint username_length check (char_length(full_name) >= 2)
);

-- Create indexes for better query performance
create index profiles_full_name_idx on public.profiles (full_name);
create index profiles_created_at_idx on public.profiles (created_at);

-- Set up Row Level Security (RLS)
alter table public.profiles enable row level security;

-- Create policies
-- 1. Allow users to view their own profile
create policy "Users can view own profile"
  on public.profiles for select
  using ( auth.uid() = id );

-- 2. Allow users to update their own profile
create policy "Users can update own profile"
  on public.profiles for update
  using ( auth.uid() = id );

-- 3. Allow users to view other profiles (optional, remove if you want profiles to be private)
create policy "Profiles are viewable by everyone"
  on public.profiles for select
  using ( true );

-- Create a trigger to handle updated_at
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger on_profile_updated
  before update on public.profiles
  for each row
  execute procedure public.handle_updated_at();

-- Create a function to handle new user signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name)
  values (
    new.id,
    new.raw_user_meta_data->>'full_name'
  );
  return new;
end;
$$ language plpgsql security definer;

-- Trigger the function every time a user is created
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Secure the buckets table if you plan to use Storage
insert into storage.buckets (id, name, public)
values ('avatars', 'avatars', true);

-- Set up storage policies
create policy "Avatar images are publicly accessible"
  on storage.objects for select
  using ( bucket_id = 'avatars' );

create policy "Anyone can upload an avatar"
  on storage.objects for insert
  with check (
    bucket_id = 'avatars' AND
    auth.role() = 'authenticated'
  );

create policy "Users can update their own avatar"
  on storage.objects for update
  using ( auth.uid() = owner )
  with check ( bucket_id = 'avatars' );

-- Function to check if email is verified
create or replace function auth.email_verified()
returns boolean as $$
begin
  return (
    select confirmed_at is not null
    from auth.users
    where id = auth.uid()
  );
end;
$$ language plpgsql security definer;

-- Optional: Create a view for public profile data
create view public.public_profiles as
select
  id,
  full_name,
  avatar_url,
  website,
  bio,
  location,
  created_at
from public.profiles;

-- Grant appropriate privileges
grant usage on schema public to anon, authenticated;
grant select on public.public_profiles to anon, authenticated;
grant all on public.profiles to authenticated;
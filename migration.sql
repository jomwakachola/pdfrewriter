-- Create rewrites table
create table public.rewrites (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users not null,
  file_name text not null,
  file_size integer not null,
  status text not null default 'completed',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  
  constraint valid_status check (status in ('completed', 'failed'))
);

-- Create versions table for storing multiple versions per rewrite
create table public.rewrite_versions (
  id uuid default gen_random_uuid() primary key,
  rewrite_id uuid references public.rewrites on delete cascade not null,
  version_number integer not null,
  content text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create indexes
create index rewrites_user_id_idx on public.rewrites(user_id);
create index rewrites_created_at_idx on public.rewrites(created_at);
create index rewrite_versions_rewrite_id_idx on public.rewrite_versions(rewrite_id);

-- Set up RLS policies
alter table public.rewrites enable row level security;
alter table public.rewrite_versions enable row level security;

-- Users can only view their own rewrites
create policy "Users can view own rewrites"
  on public.rewrites for select
  using (auth.uid() = user_id);

-- Users can only insert their own rewrites
create policy "Users can insert own rewrites"
  on public.rewrites for insert
  with check (auth.uid() = user_id);

-- Users can only delete their own rewrites
create policy "Users can delete own rewrites"
  on public.rewrites for delete
  using (auth.uid() = user_id);

-- Users can view versions of their own rewrites
create policy "Users can view own rewrite versions"
  on public.rewrite_versions for select
  using (
    exists (
      select 1 from public.rewrites
      where id = rewrite_versions.rewrite_id
      and user_id = auth.uid()
    )
  );

-- Users can insert versions to their own rewrites
create policy "Users can insert own rewrite versions"
  on public.rewrite_versions for insert
  with check (
    exists (
      select 1 from public.rewrites
      where id = rewrite_versions.rewrite_id
      and user_id = auth.uid()
    )
  );

-- Users can delete versions of their own rewrites
create policy "Users can delete own rewrite versions"
  on public.rewrite_versions for delete
  using (
    exists (
      select 1 from public.rewrites
      where id = rewrite_versions.rewrite_id
      and user_id = auth.uid()
    )
  );
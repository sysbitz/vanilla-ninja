-- Initial schema for JS Quest
-- Mirrors the migration applied to the Lovable Cloud project.

-- ============== PROFILES ==============
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text not null default '',
  avatar_url text,
  bio text default '',
  level int not null default 1,
  xp int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "Profiles are viewable by authenticated users"
  on public.profiles for select to authenticated using (true);
create policy "Users can insert own profile"
  on public.profiles for insert to authenticated with check (auth.uid() = id);
create policy "Users can update own profile"
  on public.profiles for update to authenticated using (auth.uid() = id);

-- updated_at helper
create or replace function public.set_updated_at()
returns trigger language plpgsql set search_path = public as $$
begin new.updated_at = now(); return new; end;
$$;

create trigger profiles_set_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, display_name, avatar_url)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'display_name', split_part(new.email, '@', 1)),
    new.raw_user_meta_data ->> 'avatar_url'
  ) on conflict (id) do nothing;
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ============== LEVEL PROGRESS ==============
create table public.level_progress (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  level_id text not null,
  completed boolean not null default false,
  stars smallint not null default 0,
  attempts int not null default 0,
  solution_revealed boolean not null default false,
  completed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, level_id)
);

alter table public.level_progress enable row level security;

create policy "Users can view own progress"
  on public.level_progress for select to authenticated using (auth.uid() = user_id);
create policy "Users can insert own progress"
  on public.level_progress for insert to authenticated with check (auth.uid() = user_id);
create policy "Users can update own progress"
  on public.level_progress for update to authenticated using (auth.uid() = user_id);
create policy "Users can delete own progress"
  on public.level_progress for delete to authenticated using (auth.uid() = user_id);

create trigger level_progress_set_updated_at
  before update on public.level_progress
  for each row execute function public.set_updated_at();

create index level_progress_user_idx on public.level_progress(user_id);

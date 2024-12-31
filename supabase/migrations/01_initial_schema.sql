-- Enable necessary extensions
create extension if not exists "uuid-ossp";

-- Create users table
create table if not exists public.users (
    id uuid primary key default uuid_generate_v4(),
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    email text unique not null,
    role text not null check (role in ('parent', 'child')),
    full_name text not null
);

-- Create profiles table
create table if not exists public.profiles (
    id uuid primary key default uuid_generate_v4(),
    user_id uuid references public.users(id) on delete cascade not null,
    academic_level text not null,
    difficulty_settings jsonb default '{}'::jsonb,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create categories table
create table if not exists public.categories (
    id uuid primary key default uuid_generate_v4(),
    name text not null,
    parent_id uuid references public.categories(id),
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create questions table
create table if not exists public.questions (
    id uuid primary key default uuid_generate_v4(),
    category_id uuid references public.categories(id) on delete cascade not null,
    question_text text not null,
    answers jsonb not null,
    correct_answer text not null,
    academic_level text not null,
    difficulty integer not null check (difficulty between 1 and 10),
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create audiobooks table
create table if not exists public.audiobooks (
    id uuid primary key default uuid_generate_v4(),
    title text not null,
    description text not null,
    audio_url text not null,
    duration integer not null, -- in seconds
    age_range text[] not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create quiz_results table
create table if not exists public.quiz_results (
    id uuid primary key default uuid_generate_v4(),
    user_id uuid references public.users(id) on delete cascade not null,
    quiz_date timestamp with time zone default timezone('utc'::text, now()) not null,
    score numeric not null check (score >= 0 and score <= 10),
    questions jsonb not null,
    category_id uuid references public.categories(id) on delete cascade not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create audiobook_progress table
create table if not exists public.audiobook_progress (
    id uuid primary key default uuid_generate_v4(),
    user_id uuid references public.users(id) on delete cascade not null,
    audiobook_id uuid references public.audiobooks(id) on delete cascade not null,
    progress numeric not null check (progress >= 0 and progress <= 100),
    last_position integer not null default 0,
    completed boolean not null default false,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create parent_settings table
create table if not exists public.parent_settings (
    id uuid primary key default uuid_generate_v4(),
    user_id uuid references public.users(id) on delete cascade not null,
    pin text not null check (length(pin) = 4),
    subscription_status text not null default 'free' check (subscription_status in ('free', 'premium')),
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create security policies
alter table public.users enable row level security;
alter table public.profiles enable row level security;
alter table public.categories enable row level security;
alter table public.questions enable row level security;
alter table public.audiobooks enable row level security;
alter table public.quiz_results enable row level security;
alter table public.audiobook_progress enable row level security;
alter table public.parent_settings enable row level security;

-- Users policies
create policy "Users can view their own data"
    on public.users for select
    using (auth.uid() = id);

create policy "Users can update their own data"
    on public.users for update
    using (auth.uid() = id);

-- Profiles policies
create policy "Users can view their own profile"
    on public.profiles for select
    using (auth.uid() = user_id);

create policy "Users can update their own profile"
    on public.profiles for update
    using (auth.uid() = user_id);

-- Categories policies (readable by all authenticated users)
create policy "Categories are viewable by all authenticated users"
    on public.categories for select
    using (auth.role() = 'authenticated');

-- Questions policies (readable by all authenticated users)
create policy "Questions are viewable by all authenticated users"
    on public.questions for select
    using (auth.role() = 'authenticated');

-- Audiobooks policies (readable by all authenticated users)
create policy "Audiobooks are viewable by all authenticated users"
    on public.audiobooks for select
    using (auth.role() = 'authenticated');

-- Quiz results policies
create policy "Users can view their own quiz results"
    on public.quiz_results for select
    using (auth.uid() = user_id);

create policy "Users can insert their own quiz results"
    on public.quiz_results for insert
    with check (auth.uid() = user_id);

-- Audiobook progress policies
create policy "Users can view their own audiobook progress"
    on public.audiobook_progress for select
    using (auth.uid() = user_id);

create policy "Users can update their own audiobook progress"
    on public.audiobook_progress for update
    using (auth.uid() = user_id);

create policy "Users can insert their own audiobook progress"
    on public.audiobook_progress for insert
    with check (auth.uid() = user_id);

-- Parent settings policies
create policy "Parents can view their own settings"
    on public.parent_settings for select
    using (auth.uid() = user_id);

create policy "Parents can update their own settings"
    on public.parent_settings for update
    using (auth.uid() = user_id);

-- Create functions for updating timestamps
create or replace function public.handle_updated_at()
returns trigger as $$
begin
    new.updated_at = now();
    return new;
end;
$$ language plpgsql;

-- Create triggers for updating timestamps
create trigger handle_updated_at
    before update on public.profiles
    for each row
    execute function public.handle_updated_at();

create trigger handle_updated_at
    before update on public.audiobook_progress
    for each row
    execute function public.handle_updated_at();

create trigger handle_updated_at
    before update on public.parent_settings
    for each row
    execute function public.handle_updated_at();

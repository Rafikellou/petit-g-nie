-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Clean up existing tables if they exist
drop table if exists quiz_progress;
drop table if exists question_responses;
drop table if exists questions;

-- Create questions table
create table questions (
  id uuid default uuid_generate_v4() primary key,
  class text not null,
  subject text not null,
  topic text not null,
  period text not null,
  specificity text not null,
  type text not null,
  question text not null,
  options jsonb not null,
  correct_answer text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create RLS policies for questions
alter table questions enable row level security;

create policy "Questions are viewable by everyone"
  on questions for select
  using (true);

-- Create question responses table
create table question_responses (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users not null,
  question_id uuid references questions not null,
  selected_answer text not null,
  is_correct boolean not null,
  timestamp timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create RLS policies for question responses
alter table question_responses enable row level security;

create policy "Users can insert their own responses"
  on question_responses for insert
  with check (auth.uid() = user_id);

create policy "Users can view their own responses"
  on question_responses for select
  using (auth.uid() = user_id);

-- Create quiz progress table
create table quiz_progress (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users not null,
  total_questions integer default 0,
  correct_answers integer default 0,
  last_question_timestamp timestamp with time zone,
  subject text,
  topic text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create RLS policies for quiz progress
alter table quiz_progress enable row level security;

create policy "Users can insert their own progress"
  on quiz_progress for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own progress"
  on quiz_progress for update
  using (auth.uid() = user_id);

create policy "Users can view their own progress"
  on quiz_progress for select
  using (auth.uid() = user_id);

-- Create indexes for better performance
create index idx_questions_class on questions(class);
create index idx_questions_subject on questions(subject);
create index idx_questions_topic on questions(topic);
create index idx_questions_period on questions(period);
create index idx_question_responses_user on question_responses(user_id);
create index idx_question_responses_question on question_responses(question_id);
create index idx_quiz_progress_user on quiz_progress(user_id);

-- Create function to update updated_at timestamp
create or replace function update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- Create trigger for quiz_progress
create trigger update_quiz_progress_updated_at
  before update on quiz_progress
  for each row
  execute function update_updated_at_column();

-- Ejecutá este SQL en Supabase > SQL Editor.
-- Política: el público puede insertar participaciones, pero no leerlas ni modificarlas.
create table if not exists public.quiz_responses (
  id bigint generated always as identity primary key,
  submitted_at timestamptz not null default now(),
  score integer not null check (score between 0 and 6),
  total_questions integer not null default 6 check (total_questions = 6),
  answers jsonb not null
);

alter table public.quiz_responses enable row level security;

drop policy if exists "Public can submit quiz responses" on public.quiz_responses;
create policy "Public can submit quiz responses"
on public.quiz_responses
for insert
to anon
with check (
  score between 0 and 6
  and total_questions = 6
  and jsonb_typeof(answers) = 'array'
);

-- No crear políticas SELECT públicas. Consultá resultados desde el panel autenticado de Supabase.

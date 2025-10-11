-- Tabela de agendamentos
create table if not exists public.appointments (
  id bigserial primary key,
  name text not null,
  phone text not null,
  service text not null,
  date date not null,
  time time not null,
  notes text,
  source text default 'landing',
  status text default 'pending',
  created_at timestamptz default now()
);

-- (Opcional) Política de RLS básica: leitura pública e inserção anônima
alter table public.appointments enable row level security;

create policy if not exists appointments_select on public.appointments
  for select using (true);

create policy if not exists appointments_insert on public.appointments
  for insert with check (true);

-- Índice único opcional para evitar duplicidade de slot por serviço
create unique index if not exists uniq_service_date_time on public.appointments(service, date, time);

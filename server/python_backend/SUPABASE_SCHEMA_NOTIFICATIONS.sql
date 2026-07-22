create table if not exists public.voltkraft_notifications (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  source text not null default 'VoltKraft',
  channel text not null default 'telegram',
  title text,
  subtitle text,
  module text,
  status text,
  message text not null,
  telegram_update_id bigint,
  telegram_chat_id text,
  telegram_message_id bigint,
  telegram_sender text,
  payload jsonb not null default '{}'::jsonb
);

alter table public.voltkraft_notifications
  add column if not exists telegram_update_id bigint,
  add column if not exists telegram_chat_id text,
  add column if not exists telegram_message_id bigint,
  add column if not exists telegram_sender text;

create index if not exists voltkraft_notifications_created_at_idx
  on public.voltkraft_notifications (created_at desc);

create index if not exists voltkraft_notifications_channel_idx
  on public.voltkraft_notifications (channel);

create unique index if not exists voltkraft_notifications_telegram_update_id_uidx
  on public.voltkraft_notifications (telegram_update_id)
  where telegram_update_id is not null;

alter table public.voltkraft_notifications enable row level security;

-- Gunakan service_role key hanya di server VoltKraft untuk insert data.
-- Jangan taruh service_role key di frontend/aplikasi client.
-- Policy baca untuk aplikasi sebaiknya dibuat terpisah sesuai pola login app.

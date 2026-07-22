# Panduan Telegram ke Supabase

Tujuan skema ini:

```text
VoltKraft -> Telegram
Telegram webhook -> Supabase Edge Function -> Supabase table
```

Dengan skema ini server VoltKraft tidak perlu komunikasi langsung ke Supabase.

## Langkah Berikutnya yang Aman

Urutan kerja yang disarankan:

1. Siapkan table di Supabase dengan `SUPABASE_SCHEMA_NOTIFICATIONS.sql`.
2. Deploy Edge Function `telegram-to-supabase`.
3. Simpan API key Supabase sebagai secret Edge Function, bukan di server VoltKraft.
4. Buat secret Telegram webhook yang sama di Supabase dan file lokal.
5. Aktifkan webhook Telegram dengan `setup_telegram_supabase_webhook.ps1`.
6. Test dengan kirim pesan biasa ke bot/grup Telegram.
7. Setelah test berhasil, baru sambungkan alarm VoltKraft ke Telegram.

## 1. Buat Table Supabase

Jalankan isi file `SUPABASE_SCHEMA_NOTIFICATIONS.sql` di Supabase SQL Editor.

Table default:

```text
public.voltkraft_notifications
```

## 2. Deploy Edge Function

Deploy function:

```powershell
supabase functions deploy telegram-to-supabase
```

Function akan memakai URL:

```text
https://PROJECT_REF.supabase.co/functions/v1/telegram-to-supabase
```

## 3. Simpan Secret di Supabase

API key Supabase jangan ditaruh di server VoltKraft untuk skema ini.
Simpan `service_role` key sebagai secret Edge Function:

```powershell
supabase secrets set PANDUGIXVOLTKRAFT_SERVICE_ROLE_KEY="ISI_SERVICE_ROLE_KEY"
supabase secrets set TELEGRAM_WEBHOOK_SECRET="ISI_SECRET_RANDOM_PANJANG"
supabase secrets set SUPABASE_NOTIFICATIONS_TABLE="voltkraft_notifications"
```

`SUPABASE_URL` biasanya sudah tersedia di environment Supabase Function. Jika belum, set juga:

```powershell
supabase secrets set SUPABASE_URL="https://PROJECT_REF.supabase.co"
```

## 4. Siapkan File Lokal untuk Setup Webhook Telegram

Buat file:

```text
telegram_supabase_webhook_url.txt
telegram_webhook_secret.txt
```

Isi `telegram_supabase_webhook_url.txt`:

```text
https://PROJECT_REF.supabase.co/functions/v1/telegram-to-supabase
```

Isi `telegram_webhook_secret.txt` harus sama dengan `TELEGRAM_WEBHOOK_SECRET` yang disimpan di Supabase.
Gunakan karakter `A-Z`, `a-z`, `0-9`, `_`, atau `-`.

## 5. Aktifkan Webhook Telegram

Jalankan:

```powershell
.\setup_telegram_supabase_webhook.ps1
```

Script ini membaca:

```text
telegram_token.txt
telegram_supabase_webhook_url.txt
telegram_webhook_secret.txt
```

Lalu memanggil Telegram `setWebhook`.

## 6. Test Direct Dari VoltKraft

Skema final untuk data Supabase adalah POST langsung dari server VoltKraft ke
Supabase Edge Function. Telegram tetap dipakai untuk notifikasi grup, tetapi
Bot Listener tidak lagi menjadi jalur utama Supabase.

Jalankan dari folder server VoltKraft:

```powershell
.\.venv\Scripts\python.exe .\test_supabase_notification.py
```

Output yang diharapkan:

```text
[SUPABASE EDGE] Notifikasi terkirim ke Edge Function.
Supabase Edge Function test notification sent.
```

Catatan: webhook Telegram menerima pesan yang masuk ke bot. Pesan yang dikirim
keluar oleh bot melalui `sendMessage` tidak selalu masuk lagi sebagai webhook
update. Karena itu jalur bot pengirim -> grup -> bot listener tidak dipakai
lagi sebagai jalur utama Supabase.

Cek data:

```sql
select *
from public.voltkraft_notifications
order by created_at desc
limit 20;
```

## Troubleshooting Insert Gagal

Jika test POST ke Edge Function menghasilkan:

```json
{"ok":false,"error":"Supabase insert failed"}
```

Cek di Supabase:

1. SQL terbaru `SUPABASE_SCHEMA_NOTIFICATIONS.sql` sudah dijalankan ulang.
2. Table `public.voltkraft_notifications` ada.
3. Kolom `telegram_update_id`, `telegram_chat_id`, `telegram_message_id`, dan `telegram_sender` ada.
4. Secret `PANDUGIXVOLTKRAFT_SERVICE_ROLE_KEY` berisi service role key yang benar.
5. Secret `SUPABASE_NOTIFICATIONS_TABLE` berisi `voltkraft_notifications`.
6. Cek logs Edge Function `telegram-to-supabase` untuk error detail dari PostgREST.

## Catatan Aman

- Jangan taruh `service_role` key di frontend.
- Untuk skema ini, jangan taruh `service_role` key di server VoltKraft.
- `service_role` key hanya ditaruh di Supabase secrets dengan nama `PANDUGIXVOLTKRAFT_SERVICE_ROLE_KEY`.
- `telegram_webhook_secret.txt` dipakai server VoltKraft sebagai header secret saat POST ke Edge Function dan harus sama dengan secret di Supabase.
- Server VoltKraft mengirim notifikasi ke Telegram untuk grup, lalu POST langsung ke Edge Function untuk data Supabase.

## Referensi Resmi

- Telegram Bot API `setWebhook`: https://core.telegram.org/bots/api#setwebhook
- Supabase Edge Function secrets: https://supabase.com/docs/guides/functions/secrets

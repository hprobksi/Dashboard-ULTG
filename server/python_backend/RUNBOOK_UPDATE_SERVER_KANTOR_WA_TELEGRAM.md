# Runbook Update Server Kantor - WAHA + Telegram Supabase

Dokumen ini dipakai untuk update server VoltKraft yang sudah berjalan di laptop kantor.
Tujuannya: menambahkan/memastikan Telegram dan WhatsApp WAHA bisa terkoneksi tanpa menimpa database, token, atau config penting server kantor.

## Ringkasan Skema

Telegram:

Server VoltKraft -> Bot Telegram pengirim -> Grup Telegram.

Supabase:

Server VoltKraft -> Supabase Edge Function `telegram-to-supabase` -> tabel `voltkraft_notifications`.

Catatan: jalur Bot pengirim -> Grup Telegram -> Bot Listener tidak dipakai lagi
sebagai jalur utama Supabase, karena Telegram tidak meneruskan pesan dari bot
lain ke bot listener seperti pesan manusia biasa.

WhatsApp:

Server VoltKraft -> WAHA lokal di laptop server kantor -> Grup WhatsApp.

Mode WhatsApp lama MPWA tetap ada di script sebagai cadangan, tetapi produksi WAHA aktif jika file `whatsapp_gateway_mode.txt` berisi `waha`.

## File Yang Dicopy Otomatis

Paket update gabungan akan mengcopy file berikut ke server kantor:

```text
api.py
test_telegram_notification.py
test_supabase_notification.py
test_waha_whatsapp_notification.py
setup_telegram_supabase_webhook.ps1
SETUP-WAHA-VOLTKRAFT-SERVER.ps1
APPLY-UPDATE-TELEGRAM-SUPABASE.ps1
BUAT-PAKET-UPDATE-TELEGRAM-SUPABASE.ps1
APPLY-UPDATE-WA-TELEGRAM.ps1
BUAT-PAKET-UPDATE-WA-TELEGRAM.ps1
SUPABASE_SCHEMA_NOTIFICATIONS.sql
PANDUAN_TELEGRAM_KE_SUPABASE.md
RUNBOOK_UPDATE_SERVER_KANTOR_WA_TELEGRAM.md
WAHA_CONFIG_CONTOH.txt
CATATAN_PERUBAHAN_TELEGRAM_VOLTKRAFT.txt
CATATAN_PERUBAHAN_WAHA_VOLTKRAFT.txt
DAFTAR_UPDATE_SERVER_KANTOR_TELEGRAM_SUPABASE.txt
DAFTAR_UPDATE_SERVER_KANTOR_WAHA.txt
supabase\config.toml
supabase\functions\telegram-to-supabase\index.ts
```

## File Yang Tidak Boleh Ditimpa Otomatis

File berikut sengaja tidak dimasukkan ke paket dan jangan dicopy asal dari laptop development:

```text
voltkraf.db
*.db-wal
*.db-shm
alarms_log.json
trend_data.json
telegram_token.txt
telegram_listener_token.txt
telegram_chat_id.txt
telegram_webhook_secret.txt
telegram_supabase_webhook_url.txt
whatsapp_*.txt
waha_base_url.txt
waha_session.txt
waha_api_key.txt
waha_chat_id.txt
whatsapp_gateway_mode.txt
kredensial.json
voltkraf_admin_credentials.json
runtime-localhost
__pycache__
node_modules
```

## Data Yang Perlu Disiapkan

Siapkan data berikut sebelum update:

```text
Path folder project VoltKraft di server kantor
Token Bot Telegram pengirim VoltKraft
Token Bot Telegram Listener
Telegram group id: -5133586778
Telegram webhook URL: https://zavtvdaqpkoblmbbessl.supabase.co/functions/v1/telegram-to-supabase
Telegram webhook secret yang sama dengan secret Supabase
WhatsApp group id WAHA: 120363427024048580@g.us
```

Secret Supabase yang harus ada di Supabase project teman Mas:

```text
PANDUGIXVOLTKRAFT_SERVICE_ROLE_KEY
TELEGRAM_WEBHOOK_SECRET
SUPABASE_NOTIFICATIONS_TABLE=voltkraft_notifications
```

Catatan: `PANDUGIXVOLTKRAFT_SERVICE_ROLE_KEY` adalah nama secret service role yang sudah disesuaikan karena nama default ditolak.

## Step 1 - Buat Paket Update Dari Laptop Development

Jalankan di laptop development, dari folder project ini:

```powershell
cd C:\Users\rhard\Documents\DC_Monitoring
powershell -ExecutionPolicy Bypass -File .\BUAT-PAKET-UPDATE-WA-TELEGRAM.ps1
```

Output akan membuat folder seperti:

```text
release-packages\update-wa-telegram-YYYYMMDD-HHMMSS
```

Copy satu folder paket itu ke laptop server kantor. Jangan copy seluruh folder project development.

## Step 2 - Apply Paket Di Server Kantor

Buka PowerShell di laptop server kantor.

Masuk ke folder paket yang tadi dicopy:

```powershell
cd "C:\Path\Ke\update-wa-telegram-YYYYMMDD-HHMMSS"
```

Jalankan apply. Ganti path project sesuai lokasi project di server kantor:

```powershell
powershell -ExecutionPolicy Bypass -File .\APPLY-UPDATE-WA-TELEGRAM.ps1 -ProjectDir "C:\Path\Ke\DC_Monitoring"
```

Script ini akan:

1. Backup file lama ke folder `backups\wa-telegram-update-YYYYMMDD-HHMMSS`.
2. Copy file script/dokumentasi baru.
3. Tidak menimpa token, database, config WA/Telegram, dan file runtime.

## Step 3 - Validasi Script Python

Masuk ke folder project server kantor:

```powershell
cd "C:\Path\Ke\DC_Monitoring"
```

Jalankan validasi:

```powershell
.\.venv\Scripts\python.exe -m py_compile .\api.py .\test_telegram_notification.py .\test_supabase_notification.py .\test_waha_whatsapp_notification.py
```

Jika tidak muncul error, script Python aman secara syntax.

Jika `.venv` tidak ada, gunakan Python server kantor:

```powershell
python -m py_compile .\api.py .\test_telegram_notification.py .\test_supabase_notification.py .\test_waha_whatsapp_notification.py
```

## Step 4 - Konfigurasi Telegram Di Server Kantor

Di folder project server kantor, pastikan file berikut ada:

```text
telegram_token.txt
telegram_listener_token.txt
telegram_chat_id.txt
telegram_webhook_secret.txt
telegram_supabase_webhook_url.txt
```

Isi `telegram_chat_id.txt` untuk kirim alarm ke grup:

```powershell
Set-Content -LiteralPath .\telegram_chat_id.txt -Value "-5133586778" -NoNewline
```

Isi webhook URL jika belum ada:

```powershell
Set-Content -LiteralPath .\telegram_supabase_webhook_url.txt -Value "https://zavtvdaqpkoblmbbessl.supabase.co/functions/v1/telegram-to-supabase" -NoNewline
```

Jangan tampilkan token/secret di layar publik. Isi manual dengan Notepad atau PowerShell `Read-Host`.

Contoh isi token secara aman:

```powershell
$token = Read-Host "Paste token Bot Telegram pengirim"
Set-Content -LiteralPath .\telegram_token.txt -Value $token.Trim() -NoNewline

$listenerToken = Read-Host "Paste token Bot Telegram Listener"
Set-Content -LiteralPath .\telegram_listener_token.txt -Value $listenerToken.Trim() -NoNewline

$secret = Read-Host "Paste TELEGRAM_WEBHOOK_SECRET"
Set-Content -LiteralPath .\telegram_webhook_secret.txt -Value $secret.Trim() -NoNewline
```

## Step 5 - Aktifkan Webhook Bot Listener Telegram

Pastikan Bot Listener sudah masuk ke grup Telegram yang sama.

Di BotFather untuk Bot Listener, privacy sebaiknya dimatikan:

```text
/setprivacy -> pilih Bot Listener -> Disable
```

Set webhook:

```powershell
powershell -ExecutionPolicy Bypass -File .\setup_telegram_supabase_webhook.ps1 -BotTokenPath .\telegram_listener_token.txt
```

Cek webhook:

```powershell
$botToken = (Get-Content -LiteralPath .\telegram_listener_token.txt -Raw).Trim()
Invoke-RestMethod -Uri "https://api.telegram.org/bot$botToken/getWebhookInfo"
```

Yang diharapkan:

```text
url = https://zavtvdaqpkoblmbbessl.supabase.co/functions/v1/telegram-to-supabase
pending_update_count = 0 atau kecil
last_error_message = kosong/null
```

Catatan: Bot Listener sekarang hanya cadangan/debug. Jalur utama Supabase adalah
POST direct dari server VoltKraft ke Edge Function.

## Step 6 - Test Telegram Ke Grup

Jalankan test Telegram dari server kantor:

```powershell
.\.venv\Scripts\python.exe .\test_telegram_notification.py
```

Yang harus dicek:

1. Pesan test masuk ke grup Telegram.
2. Tidak perlu mengandalkan Bot Listener untuk data Supabase.

## Step 6B - Test Direct Supabase Edge Function

Pastikan file berikut ada di folder project server kantor:

```text
telegram_supabase_webhook_url.txt
telegram_webhook_secret.txt
```

Isi URL jika belum ada:

```powershell
Set-Content -LiteralPath .\telegram_supabase_webhook_url.txt -Value "https://zavtvdaqpkoblmbbessl.supabase.co/functions/v1/telegram-to-supabase" -NoNewline
```

Jalankan test direct:

```powershell
.\.venv\Scripts\python.exe .\test_supabase_notification.py
```

Yang diharapkan:

```text
[SUPABASE EDGE] Notifikasi terkirim ke Edge Function.
Supabase Edge Function test notification sent.
```

Lalu cek row baru di tabel `voltkraft_notifications`.

Cek di Supabase:

```sql
select *
from public.voltkraft_notifications
order by created_at desc
limit 20;
```

Jika direct Edge Function gagal, cek:

```text
telegram_webhook_secret.txt sama dengan TELEGRAM_WEBHOOK_SECRET di Supabase
telegram_supabase_webhook_url.txt benar
Supabase secret PANDUGIXVOLTKRAFT_SERVICE_ROLE_KEY sudah benar
Endpoint Supabase Edge Function sudah dideploy ulang
```

## Step 7 - Siapkan WAHA Di Server Kantor

Sebelum WAHA aktif, pastikan MPWA lama tidak berjalan dengan nomor WhatsApp yang sama.

Hal yang wajib:

1. Stop gateway MPWA lama jika memakai nomor yang sama.
2. Logout tautan lama di WhatsApp bila masih nyangkut.
3. Pastikan Docker Desktop sudah terinstall dan berjalan.

Cek Docker:

```powershell
docker --version
docker ps
```

## Step 8 - Jalankan Setup WAHA

Dari folder project server kantor:

```powershell
cd "C:\Path\Ke\DC_Monitoring"
powershell -ExecutionPolicy Bypass -File .\SETUP-WAHA-VOLTKRAFT-SERVER.ps1 -ChatId "120363427024048580@g.us"
```

Script ini akan:

1. Menjalankan container Docker `voltkraft-waha`.
2. Membuat `waha_base_url.txt`.
3. Membuat `waha_session.txt`.
4. Membuat `waha_api_key.txt`.
5. Membuat `waha_chat_id.txt`.
6. Membuat `whatsapp_gateway_mode.txt` berisi `waha`.

Buka dashboard:

```text
http://localhost:3000/dashboard
```

Login memakai username/password yang muncul dari output script.

Scan QR WhatsApp dari HP operasional. Tunggu sampai session `default` status `WORKING`.

## Step 9 - Test WAHA

Setelah session WAHA `WORKING`, jalankan:

```powershell
.\.venv\Scripts\python.exe .\test_waha_whatsapp_notification.py
```

Yang diharapkan:

1. Pesan test masuk ke grup WhatsApp.
2. Tidak ada polling peralatan yang dijalankan oleh script test ini.
3. Mode WhatsApp test dipaksa WAHA hanya untuk proses test.

Cek session via API:

```powershell
$apiKey = (Get-Content -LiteralPath .\waha_api_key.txt -Raw).Trim()
Invoke-RestMethod -Uri http://localhost:3000/api/sessions -Headers @{ "X-Api-Key" = $apiKey }
```

Status yang diharapkan:

```text
WORKING
```

## Step 10 - Restart Server VoltKraft

Setelah Telegram dan WAHA test berhasil, restart aplikasi VoltKraft server kantor.

Jika server dijalankan dengan script lama, gunakan salah satu yang sesuai:

```powershell
.\STOP-VOLTKRAF-LOCALHOST.cmd
.\START-VOLTKRAF-LOCALHOST.cmd
```

Atau jika mode LAN:

```powershell
.\START-VOLTKRAF-SERVER-LAN.cmd
```

Jika server dijalankan dari jendela PowerShell/CMD manual, stop proses lama lalu jalankan lagi dengan cara server kantor biasanya dijalankan.

Jika server dijalankan lewat Task Scheduler, restart task VoltKraft dari Task Scheduler.

## Step 11 - Cek Setelah Server Online

Cek hal berikut:

1. Dashboard VoltKraft bisa dibuka.
2. `docker ps` menampilkan container `voltkraft-waha` status Up.
3. WAHA dashboard session `default` status `WORKING`.
4. Alarm test Telegram masuk ke grup Telegram.
5. Test direct Supabase Edge Function berhasil.
6. Row baru masuk ke Supabase `voltkraft_notifications`.
7. Alarm test WhatsApp masuk ke grup WhatsApp.
8. Tidak ada MPWA lama yang jalan dengan nomor WhatsApp sama.

## Rollback Jika Ada Masalah

Apply script membuat backup di:

```text
backups\wa-telegram-update-YYYYMMDD-HHMMSS
```

Rollback script utama:

1. Stop server VoltKraft.
2. Copy balik file yang bermasalah dari folder backup, terutama `api.py`.
3. Jika ingin kembali ke MPWA, ubah mode:

```powershell
Set-Content -LiteralPath .\whatsapp_gateway_mode.txt -Value "mpwa" -NoNewline
```

Atau hapus `whatsapp_gateway_mode.txt` agar default kembali ke MPWA.

Stop WAHA jika perlu:

```powershell
docker stop voltkraft-waha
```

Start lagi MPWA lama jika memang mau balik ke skema lama.

## Checklist Akhir

```text
[ ] Paket update dibuat dari laptop development
[ ] Paket dicopy ke server kantor
[ ] APPLY-UPDATE-WA-TELEGRAM.ps1 sukses
[ ] py_compile sukses
[ ] telegram_chat_id.txt berisi -5133586778
[ ] Test Telegram masuk grup
[ ] test_supabase_notification.py berhasil POST direct ke Edge Function
[ ] Row masuk Supabase
[ ] Docker berjalan
[ ] WAHA container voltkraft-waha berjalan
[ ] WAHA session default WORKING
[ ] test_waha_whatsapp_notification.py masuk grup WA
[ ] MPWA lama tidak aktif bersamaan dengan WAHA untuk nomor yang sama
[ ] Server VoltKraft direstart
```

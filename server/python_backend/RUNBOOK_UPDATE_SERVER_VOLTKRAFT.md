# Runbook Update Server VoltKraft

Dokumen ini dipakai untuk update server VoltKraft yang sudah berjalan, dari laptop development ke server produksi/kantor.

Tujuan utama:

- Update file aplikasi tanpa menimpa database, token, credential, log, dan file runtime.
- Membuat backup sebelum update.
- Menjalankan post-check setelah server hidup kembali.
- Rollback otomatis jika update gagal.
- Mengirim satu notifikasi final setelah post-check sukses.

## Prinsip Aman

Jangan copy seluruh folder project development ke server. Gunakan paket update.

File yang tidak ikut paket:

```text
*.db
*.db-wal
*.db-shm
*.log
runtime-localhost
backups
.venv
node_modules
telegram_*.txt
whatsapp_*.txt
waha_*.txt
supabase_api_key.txt
supabase_url.txt
pme_*.txt
kredensial.json
voltkraf_admin_credentials.json
alarms_log.json
trend_data.json
```

## Step 1 - Buat Paket Dari Laptop Development

Dari folder project development:

```powershell
cd C:\Users\rhard\Documents\DC_Monitoring
powershell -ExecutionPolicy Bypass -File .\BUAT-PAKET-UPDATE-VOLTKRAFT.ps1
```

Secara default script tidak menjalankan build frontend ulang, agar tampilan fixed baseline yang sudah benar tidak tertimpa.

Gunakan build frontend hanya jika memang sedang mengubah UI React dan sudah siap memvalidasi tampilannya:

```powershell
powershell -ExecutionPolicy Bypass -File .\BUAT-PAKET-UPDATE-VOLTKRAFT.ps1 -BuildFrontend
```

Output dibuat di:

```text
release-packages\update-voltkraft-YYYYMMDD-HHMMSS
release-packages\update-voltkraft-YYYYMMDD-HHMMSS.zip
```

Copy folder atau ZIP itu ke server.

## Step 2 - Apply Di Server

Extract ZIP jika masih berupa ZIP, lalu jalankan dari folder paket:

Cara paling mudah:

```powershell
.\APPLY-UPDATE-VOLTKRAFT.cmd
```

Wrapper `.cmd` akan meminta folder project VoltKraft di server dan pilihan mode LAN.

Cara manual PowerShell:

```powershell
powershell -ExecutionPolicy Bypass -File .\APPLY-UPDATE-VOLTKRAFT.ps1 -ProjectDir "C:\Path\Ke\DC_Monitoring" -EnableLan
```

Jika server hanya localhost:

```powershell
powershell -ExecutionPolicy Bypass -File .\APPLY-UPDATE-VOLTKRAFT.ps1 -ProjectDir "C:\Path\Ke\DC_Monitoring"
```

Jika dependency Python tidak berubah dan ingin lebih cepat:

```powershell
powershell -ExecutionPolicy Bypass -File .\APPLY-UPDATE-VOLTKRAFT.ps1 -ProjectDir "C:\Path\Ke\DC_Monitoring" -EnableLan -SkipDependencyInstall
```

## Yang Dilakukan Script Apply

```text
1. Baca manifest paket.
2. Stop server VoltKraft.
3. Backup database dan file yang akan ditimpa.
4. Copy file update.
5. Verifikasi SHA256.
6. Install dependency Python jika tidak diskip.
7. Compile check api.py dan database.py.
8. Start server.
9. Cek /api/health dan /api/server/health.
10. Simpan riwayat update.
11. Kirim satu notifikasi update sukses.
```

## Rollback

Jika copy, checksum, compile, start, atau post-check gagal, script akan:

```text
1. Stop server hasil update.
2. Restore file lama dari backup.
3. Restore database backup.
4. Start server lama.
5. Simpan status rolled_back.
```

Riwayat dan backup ada di:

```text
.release\history\<package_id>\
```

Manifest versi aktif ada di:

```text
.release\installed-version.json
```

## Notifikasi

Script apply mengirim satu notifikasi final setelah server sehat kembali.

Notifikasi recovery bawaan aplikasi tetap dipertahankan:

- Jika gateway WhatsApp/server benar-benar offline, aplikasi tetap menandai recovery pending.
- Saat koneksi pulih, aplikasi mengirim satu notifikasi recovery dan membuang antrean lama agar tidak spam.
- Restart biasa tidak otomatis membuat recovery pending baru.

Jika sedang test apply berulang dan tidak ingin kirim notifikasi update:

```powershell
powershell -ExecutionPolicy Bypass -File .\APPLY-UPDATE-VOLTKRAFT.ps1 -ProjectDir "C:\Path\Ke\DC_Monitoring" -SkipUpdateNotification
```

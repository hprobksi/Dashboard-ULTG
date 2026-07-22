param(
    [string]$SourceDir = (Get-Location).Path,
    [string]$OutputRoot = ""
)

$ErrorActionPreference = "Stop"

$filesToPackage = @(
    "api.py",
    "test_telegram_notification.py",
    "test_supabase_notification.py",
    "test_waha_whatsapp_notification.py",
    "setup_telegram_supabase_webhook.ps1",
    "SETUP-WAHA-VOLTKRAFT-SERVER.ps1",
    "APPLY-UPDATE-TELEGRAM-SUPABASE.ps1",
    "BUAT-PAKET-UPDATE-TELEGRAM-SUPABASE.ps1",
    "APPLY-UPDATE-WA-TELEGRAM.ps1",
    "BUAT-PAKET-UPDATE-WA-TELEGRAM.ps1",
    "SUPABASE_SCHEMA_NOTIFICATIONS.sql",
    "PANDUAN_TELEGRAM_KE_SUPABASE.md",
    "RUNBOOK_UPDATE_SERVER_KANTOR_WA_TELEGRAM.md",
    "WAHA_CONFIG_CONTOH.txt",
    "CATATAN_PERUBAHAN_TELEGRAM_VOLTKRAFT.txt",
    "CATATAN_PERUBAHAN_WAHA_VOLTKRAFT.txt",
    "DAFTAR_UPDATE_SERVER_KANTOR_TELEGRAM_SUPABASE.txt",
    "DAFTAR_UPDATE_SERVER_KANTOR_WAHA.txt",
    "supabase\config.toml",
    "supabase\functions\telegram-to-supabase\index.ts"
)

$sensitiveFiles = @(
    "*.db",
    "*.db-wal",
    "*.db-shm",
    "alarms_log.json",
    "trend_data.json",
    "telegram_token.txt",
    "telegram_listener_token.txt",
    "telegram_chat_id.txt",
    "telegram_webhook_secret.txt",
    "telegram_supabase_webhook_url.txt",
    "supabase_api_key.txt",
    "supabase_url.txt",
    "whatsapp_api_key.txt",
    "whatsapp_endpoint_url.txt",
    "whatsapp_group_number.txt",
    "whatsapp_reconnect_url.txt",
    "whatsapp_sender.txt",
    "whatsapp_gateway_mode.txt",
    "waha_base_url.txt",
    "waha_session.txt",
    "waha_api_key.txt",
    "waha_chat_id.txt",
    "kredensial.json",
    "voltkraf_admin_credentials.json",
    "runtime-localhost",
    "__pycache__",
    "node_modules"
)

$sourcePath = (Resolve-Path -LiteralPath $SourceDir).Path
if ([string]::IsNullOrWhiteSpace($OutputRoot)) {
    $OutputRoot = Join-Path $sourcePath "release-packages"
}

$timestamp = Get-Date -Format "yyyyMMdd-HHmmss"
$packageDir = Join-Path $OutputRoot "update-wa-telegram-$timestamp"
New-Item -ItemType Directory -Path $packageDir -Force | Out-Null

foreach ($relativePath in $filesToPackage) {
    $sourceFile = Join-Path $sourcePath $relativePath
    if (-not (Test-Path -LiteralPath $sourceFile)) {
        throw "File sumber tidak ditemukan: $sourceFile"
    }

    $targetFile = Join-Path $packageDir $relativePath
    $targetParent = Split-Path -Parent $targetFile
    if ($targetParent) {
        New-Item -ItemType Directory -Path $targetParent -Force | Out-Null
    }
    Copy-Item -LiteralPath $sourceFile -Destination $targetFile -Force
}

$manifestPath = Join-Path $packageDir "MANIFEST-UPDATE-WA-TELEGRAM.txt"
@(
    "MANIFEST UPDATE WA + TELEGRAM VOLTKRAFT",
    "Dibuat: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')",
    "",
    "File dalam paket:",
    ($filesToPackage | ForEach-Object { "- $_" }),
    "",
    "File sensitif/runtime yang SENGAJA tidak dimasukkan:",
    ($sensitiveFiles | ForEach-Object { "- $_" }),
    "",
    "Cara apply di server kantor:",
    "1. Copy folder paket ini ke laptop server kantor.",
    "2. Dari PowerShell di folder paket, jalankan:",
    "   powershell -ExecutionPolicy Bypass -File .\APPLY-UPDATE-WA-TELEGRAM.ps1 -ProjectDir ""C:\Path\Ke\DC_Monitoring""",
    "3. Setelah apply, ikuti RUNBOOK_UPDATE_SERVER_KANTOR_WA_TELEGRAM.md.",
    "",
    "Catatan penting:",
    "- Jangan copy database atau token secara asal.",
    "- MPWA lama dan WAHA jangan aktif bersamaan jika memakai nomor WhatsApp yang sama.",
    "- Bot pengirim Telegram dan Bot Listener Telegram adalah dua token yang berbeda."
) | Set-Content -LiteralPath $manifestPath

Write-Host "Paket update dibuat:"
Write-Host "  $packageDir"
Write-Host ""
Write-Host "File sensitif, database, dan config runtime tidak dimasukkan ke paket."

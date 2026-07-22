param(
    [string]$ProjectDir = (Get-Location).Path,
    [string]$PackageDir = (Get-Location).Path
)

$ErrorActionPreference = "Stop"

$filesToCopy = @(
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

$blockedPatterns = @(
    "*.db",
    "*.db-wal",
    "*.db-shm",
    "*.log",
    "*.err.log",
    "telegram_*.txt",
    "supabase_api_key.txt",
    "supabase_url.txt",
    "whatsapp_*.txt",
    "waha_base_url.txt",
    "waha_session.txt",
    "waha_api_key.txt",
    "waha_chat_id.txt",
    "kredensial.json",
    "voltkraf_admin_credentials.json",
    "alarms_log.json",
    "trend_data.json"
)

function Test-BlockedFile {
    param([string]$RelativePath)

    $leaf = Split-Path -Leaf $RelativePath
    foreach ($pattern in $blockedPatterns) {
        if ($leaf -like $pattern -or $RelativePath -like $pattern) {
            return $true
        }
    }
    return $false
}

function Copy-WithBackup {
    param(
        [string]$SourcePath,
        [string]$TargetPath,
        [string]$RelativePath,
        [string]$BackupRoot
    )

    if (Test-BlockedFile -RelativePath $RelativePath) {
        throw "File terblokir tidak boleh dicopy otomatis: $RelativePath"
    }

    if (-not (Test-Path -LiteralPath $SourcePath)) {
        throw "File paket tidak ditemukan: $SourcePath"
    }

    if (Test-Path -LiteralPath $TargetPath) {
        $backupPath = Join-Path $BackupRoot $RelativePath
        $backupParent = Split-Path -Parent $backupPath
        if ($backupParent) {
            New-Item -ItemType Directory -Path $backupParent -Force | Out-Null
        }
        Copy-Item -LiteralPath $TargetPath -Destination $backupPath -Force
    }

    $targetParent = Split-Path -Parent $TargetPath
    if ($targetParent) {
        New-Item -ItemType Directory -Path $targetParent -Force | Out-Null
    }
    Copy-Item -LiteralPath $SourcePath -Destination $TargetPath -Force
}

$projectPath = (Resolve-Path -LiteralPath $ProjectDir).Path
$packagePath = (Resolve-Path -LiteralPath $PackageDir).Path
$timestamp = Get-Date -Format "yyyyMMdd-HHmmss"
$backupDir = Join-Path $projectPath "backups\wa-telegram-update-$timestamp"

Write-Host "ProjectDir : $projectPath"
Write-Host "PackageDir : $packagePath"
Write-Host "BackupDir  : $backupDir"
Write-Host ""

New-Item -ItemType Directory -Path $backupDir -Force | Out-Null

foreach ($relativePath in $filesToCopy) {
    $sourcePath = Join-Path $packagePath $relativePath
    $targetPath = Join-Path $projectPath $relativePath

    Copy-WithBackup `
        -SourcePath $sourcePath `
        -TargetPath $targetPath `
        -RelativePath $relativePath `
        -BackupRoot $backupDir

    Write-Host "Updated: $relativePath"
}

Write-Host ""
Write-Host "Update WA + Telegram selesai."
Write-Host "Backup file lama ada di:"
Write-Host "  $backupDir"
Write-Host ""
Write-Host "File sensitif/config runtime TIDAK ditimpa otomatis."
Write-Host "Cek/buat manual di server kantor sesuai runbook:"
Write-Host "  telegram_token.txt"
Write-Host "  telegram_listener_token.txt"
Write-Host "  telegram_chat_id.txt"
Write-Host "  telegram_webhook_secret.txt"
Write-Host "  telegram_supabase_webhook_url.txt"
Write-Host "  waha_base_url.txt"
Write-Host "  waha_session.txt"
Write-Host "  waha_api_key.txt"
Write-Host "  waha_chat_id.txt"
Write-Host "  whatsapp_gateway_mode.txt"
Write-Host ""
Write-Host "Langkah lanjut:"
Write-Host "  Baca RUNBOOK_UPDATE_SERVER_KANTOR_WA_TELEGRAM.md"
Write-Host "  Jalankan validasi Python dari folder project server kantor."

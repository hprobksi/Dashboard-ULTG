param(
    [string]$ProjectDir = (Get-Location).Path,
    [string]$PackageDir = (Get-Location).Path
)

$ErrorActionPreference = "Stop"

$filesToCopy = @(
    "api.py",
    "test_telegram_notification.py",
    "test_supabase_notification.py",
    "setup_telegram_supabase_webhook.ps1",
    "SUPABASE_SCHEMA_NOTIFICATIONS.sql",
    "PANDUAN_TELEGRAM_KE_SUPABASE.md",
    "CATATAN_PERUBAHAN_TELEGRAM_VOLTKRAFT.txt",
    "supabase\config.toml",
    "supabase\functions\telegram-to-supabase\index.ts"
)

$blockedPatterns = @(
    "*.db",
    "*.db-wal",
    "*.db-shm",
    "telegram_token.txt",
    "telegram_listener_token.txt",
    "telegram_chat_id.txt",
    "telegram_webhook_secret.txt",
    "telegram_supabase_webhook_url.txt",
    "supabase_api_key.txt",
    "supabase_url.txt",
    "whatsapp_*.txt",
    "waha_*.txt",
    "kredensial.json",
    "voltkraf_admin_credentials.json"
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

$projectPath = (Resolve-Path -LiteralPath $ProjectDir).Path
$packagePath = (Resolve-Path -LiteralPath $PackageDir).Path
$timestamp = Get-Date -Format "yyyyMMdd-HHmmss"
$backupDir = Join-Path $projectPath "backups\telegram-supabase-update-$timestamp"

Write-Host "ProjectDir : $projectPath"
Write-Host "PackageDir : $packagePath"
Write-Host "BackupDir  : $backupDir"
Write-Host ""

New-Item -ItemType Directory -Path $backupDir -Force | Out-Null

foreach ($relativePath in $filesToCopy) {
    if (Test-BlockedFile -RelativePath $relativePath) {
        throw "Blocked file unexpectedly listed for copy: $relativePath"
    }

    $sourcePath = Join-Path $packagePath $relativePath
    $targetPath = Join-Path $projectPath $relativePath

    if (-not (Test-Path -LiteralPath $sourcePath)) {
        throw "File paket tidak ditemukan: $sourcePath"
    }

    if (Test-Path -LiteralPath $targetPath) {
        $backupPath = Join-Path $backupDir $relativePath
        $backupParent = Split-Path -Parent $backupPath
        if ($backupParent) {
            New-Item -ItemType Directory -Path $backupParent -Force | Out-Null
        }
        Copy-Item -LiteralPath $targetPath -Destination $backupPath -Force
    }

    $targetParent = Split-Path -Parent $targetPath
    if ($targetParent) {
        New-Item -ItemType Directory -Path $targetParent -Force | Out-Null
    }
    Copy-Item -LiteralPath $sourcePath -Destination $targetPath -Force
    Write-Host "Updated: $relativePath"
}

Write-Host ""
Write-Host "Update Telegram/Supabase selesai."
Write-Host "Backup file lama ada di:"
Write-Host "  $backupDir"
Write-Host ""
Write-Host "File config/token TIDAK ditimpa. Cek manual di server kantor:"
Write-Host "  telegram_token.txt"
Write-Host "  telegram_listener_token.txt"
Write-Host "  telegram_chat_id.txt"
Write-Host "  telegram_webhook_secret.txt"
Write-Host "  telegram_supabase_webhook_url.txt"
Write-Host ""
Write-Host "Setelah update, jalankan validasi:"
Write-Host "  .\.venv\Scripts\python.exe -m py_compile .\api.py .\test_telegram_notification.py .\test_supabase_notification.py"

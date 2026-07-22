param(
    [string]$SourceDir = (Get-Location).Path,
    [string]$OutputRoot = ""
)

$ErrorActionPreference = "Stop"

$filesToPackage = @(
    "api.py",
    "test_telegram_notification.py",
    "test_supabase_notification.py",
    "setup_telegram_supabase_webhook.ps1",
    "APPLY-UPDATE-TELEGRAM-SUPABASE.ps1",
    "SUPABASE_SCHEMA_NOTIFICATIONS.sql",
    "PANDUAN_TELEGRAM_KE_SUPABASE.md",
    "CATATAN_PERUBAHAN_TELEGRAM_VOLTKRAFT.txt",
    "DAFTAR_UPDATE_SERVER_KANTOR_TELEGRAM_SUPABASE.txt",
    "supabase\config.toml",
    "supabase\functions\telegram-to-supabase\index.ts"
)

$sensitiveFiles = @(
    "telegram_token.txt",
    "telegram_listener_token.txt",
    "telegram_chat_id.txt",
    "telegram_webhook_secret.txt",
    "telegram_supabase_webhook_url.txt",
    "supabase_api_key.txt",
    "supabase_url.txt",
    "whatsapp_api_key.txt",
    "whatsapp_sender.txt",
    "whatsapp_group_number.txt",
    "waha_api_key.txt"
)

$sourcePath = (Resolve-Path -LiteralPath $SourceDir).Path
if ([string]::IsNullOrWhiteSpace($OutputRoot)) {
    $OutputRoot = Join-Path $sourcePath "release-packages"
}

$timestamp = Get-Date -Format "yyyyMMdd-HHmmss"
$packageDir = Join-Path $OutputRoot "update-telegram-supabase-$timestamp"
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

$manifestPath = Join-Path $packageDir "MANIFEST-UPDATE-TELEGRAM-SUPABASE.txt"
@(
    "MANIFEST UPDATE TELEGRAM SUPABASE",
    "Dibuat: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')",
    "",
    "File dalam paket:",
    ($filesToPackage | ForEach-Object { "- $_" }),
    "",
    "File sensitif yang SENGAJA tidak dimasukkan:",
    ($sensitiveFiles | ForEach-Object { "- $_" }),
    "",
    "Cara apply di server kantor:",
    "1. Copy folder paket ini ke folder server VoltKraft.",
    "2. Dari PowerShell di folder paket, jalankan:",
    "   powershell -ExecutionPolicy Bypass -File .\APPLY-UPDATE-TELEGRAM-SUPABASE.ps1 -ProjectDir C:\Path\Ke\VoltKraft",
    "3. Cek file config/token manual sesuai DAFTAR_UPDATE_SERVER_KANTOR_TELEGRAM_SUPABASE.txt."
) | Set-Content -LiteralPath $manifestPath

Write-Host "Paket update dibuat:"
Write-Host "  $packageDir"
Write-Host ""
Write-Host "File sensitif tidak dimasukkan ke paket."

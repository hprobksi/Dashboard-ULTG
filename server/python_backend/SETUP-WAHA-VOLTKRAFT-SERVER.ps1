param(
    [string]$ProjectDir = (Get-Location).Path,
    [string]$ContainerName = "voltkraft-waha",
    [string]$Image = "devlikeapro/waha:latest",
    [string]$Port = "3000",
    [string]$Session = "default",
    [string]$ApiKey = "",
    [string]$DashboardUsername = "admin",
    [string]$DashboardPassword = "",
    [string]$ChatId = ""
)

$ErrorActionPreference = "Stop"

function New-RandomSecret {
    param([int]$Length = 32)
    $chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789_-".ToCharArray()
    -join (1..$Length | ForEach-Object { $chars | Get-Random })
}

function Write-TextFileNoNewline {
    param(
        [string]$Path,
        [string]$Value
    )
    Set-Content -LiteralPath $Path -Value $Value -NoNewline
}

$projectPath = Resolve-Path -LiteralPath $ProjectDir
$projectPath = $projectPath.Path

if (-not (Get-Command docker -ErrorAction SilentlyContinue)) {
    throw "Docker tidak ditemukan. Install/start Docker Desktop dulu."
}

if ([string]::IsNullOrWhiteSpace($ApiKey)) {
    $ApiKey = New-RandomSecret 40
}

if ([string]::IsNullOrWhiteSpace($DashboardPassword)) {
    $DashboardPassword = $ApiKey
}

if ([string]::IsNullOrWhiteSpace($ChatId)) {
    $fallbackChatFile = Join-Path $projectPath "whatsapp_group_number.txt"
    if (Test-Path -LiteralPath $fallbackChatFile) {
        $ChatId = (Get-Content -LiteralPath $fallbackChatFile -Raw).Trim()
    }
}

if ([string]::IsNullOrWhiteSpace($ChatId)) {
    throw "ChatId kosong. Isi -ChatId atau pastikan whatsapp_group_number.txt tersedia."
}

$existing = docker ps -a --filter "name=^/$ContainerName$" --format "{{.Names}}"
if ($existing -eq $ContainerName) {
    Write-Host "Container $ContainerName sudah ada. Stop dan hapus container lama..."
    docker stop $ContainerName | Out-Null
    docker rm $ContainerName | Out-Null
}

Write-Host "Menjalankan WAHA container $ContainerName..."
docker run -d --name $ContainerName `
    -p "$Port`:3000" `
    -e WAHA_PRINT_QR=true `
    -e WAHA_SESSION=$Session `
    -e WAHA_API_KEY=$ApiKey `
    -e WAHA_DASHBOARD_USERNAME=$DashboardUsername `
    -e WAHA_DASHBOARD_PASSWORD=$DashboardPassword `
    --restart unless-stopped `
    $Image | Out-Null

Write-TextFileNoNewline -Path (Join-Path $projectPath "waha_base_url.txt") -Value "http://localhost:$Port"
Write-TextFileNoNewline -Path (Join-Path $projectPath "waha_session.txt") -Value $Session
Write-TextFileNoNewline -Path (Join-Path $projectPath "waha_api_key.txt") -Value $ApiKey
Write-TextFileNoNewline -Path (Join-Path $projectPath "waha_chat_id.txt") -Value $ChatId
Write-TextFileNoNewline -Path (Join-Path $projectPath "whatsapp_gateway_mode.txt") -Value "waha"

Write-Host ""
Write-Host "WAHA siap di:"
Write-Host "  http://localhost:$Port/dashboard"
Write-Host ""
Write-Host "Dashboard login:"
Write-Host "  Username: $DashboardUsername"
Write-Host "  Password: $DashboardPassword"
Write-Host ""
Write-Host "API key disimpan di:"
Write-Host "  $projectPath\\waha_api_key.txt"
Write-Host ""
Write-Host "Config VoltKraft dibuat:"
Write-Host "  waha_base_url.txt"
Write-Host "  waha_session.txt"
Write-Host "  waha_api_key.txt"
Write-Host "  waha_chat_id.txt"
Write-Host "  whatsapp_gateway_mode.txt"
Write-Host ""
Write-Host "Langkah berikutnya:"
Write-Host "1. Buka dashboard WAHA dan scan QR WhatsApp."
Write-Host "2. Pastikan session $Session status WORKING."
Write-Host "3. Jalankan test:"
Write-Host "   .\\.venv\\Scripts\\python.exe .\\test_waha_whatsapp_notification.py"

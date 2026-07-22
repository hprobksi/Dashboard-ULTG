param(
    [string]$BotTokenPath = ".\telegram_token.txt",
    [string]$WebhookUrlPath = ".\telegram_supabase_webhook_url.txt",
    [string]$WebhookSecretPath = ".\telegram_webhook_secret.txt"
)

$ErrorActionPreference = "Stop"

function Read-RequiredTextFile {
    param(
        [string]$Path,
        [string]$Label
    )

    if (-not (Test-Path -LiteralPath $Path)) {
        throw "$Label belum ada: $Path"
    }

    $value = (Get-Content -LiteralPath $Path -Raw).Trim()
    if ([string]::IsNullOrWhiteSpace($value)) {
        throw "$Label kosong: $Path"
    }

    return $value
}

$botToken = Read-RequiredTextFile -Path $BotTokenPath -Label "Telegram bot token"
$webhookUrl = Read-RequiredTextFile -Path $WebhookUrlPath -Label "Telegram webhook URL Supabase"
$webhookSecret = Read-RequiredTextFile -Path $WebhookSecretPath -Label "Telegram webhook secret"

if (-not $webhookUrl.StartsWith("https://")) {
    throw "Webhook URL wajib HTTPS: $webhookUrl"
}

if ($webhookSecret -notmatch '^[A-Za-z0-9_-]{1,256}$') {
    throw "Webhook secret hanya boleh berisi A-Z, a-z, 0-9, underscore, atau dash, panjang 1-256 karakter."
}

$setWebhookUrl = "https://api.telegram.org/bot$botToken/setWebhook"
$body = @{
    url = $webhookUrl
    secret_token = $webhookSecret
    drop_pending_updates = "false"
    allowed_updates = '["message","edited_message","channel_post","edited_channel_post"]'
}

$response = Invoke-RestMethod -Method Post -Uri $setWebhookUrl -Body $body

if (-not $response.ok) {
    throw "Telegram setWebhook gagal: $($response | ConvertTo-Json -Compress)"
}

Write-Host "Telegram webhook aktif:"
Write-Host "  URL     : $webhookUrl"
Write-Host "  Result  : $($response.description)"

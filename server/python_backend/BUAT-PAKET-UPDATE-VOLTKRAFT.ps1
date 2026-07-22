param(
    [string]$SourceDir = (Get-Location).Path,
    [string]$OutputRoot = "",
    [string]$Version = "",
    [switch]$BuildFrontend,
    [switch]$SkipFrontendBuild,
    [switch]$NoZip
)

$ErrorActionPreference = "Stop"

function Resolve-FullPath {
    param([string]$PathValue)
    return [System.IO.Path]::GetFullPath((Resolve-Path -LiteralPath $PathValue).Path).TrimEnd("\")
}

function Assert-ChildPath {
    param(
        [string]$ChildPath,
        [string]$ParentPath
    )
    $childFull = [System.IO.Path]::GetFullPath($ChildPath).TrimEnd("\")
    $parentFull = [System.IO.Path]::GetFullPath($ParentPath).TrimEnd("\")
    if (-not $childFull.StartsWith($parentFull, [System.StringComparison]::OrdinalIgnoreCase)) {
        throw "Path tidak aman: $childFull bukan bagian dari $parentFull"
    }
}

function Copy-RelativeFile {
    param(
        [string]$RootPath,
        [string]$TargetRoot,
        [string]$RelativePath
    )
    $sourcePath = Join-Path $RootPath $RelativePath
    if (-not (Test-Path -LiteralPath $sourcePath)) {
        return
    }

    $targetPath = Join-Path $TargetRoot $RelativePath
    $targetParent = Split-Path -Parent $targetPath
    if ($targetParent) {
        New-Item -ItemType Directory -Force -Path $targetParent | Out-Null
    }
    Copy-Item -LiteralPath $sourcePath -Destination $targetPath -Force
}

function Copy-RelativeDirectory {
    param(
        [string]$RootPath,
        [string]$TargetRoot,
        [string]$RelativePath
    )
    $sourcePath = Join-Path $RootPath $RelativePath
    if (-not (Test-Path -LiteralPath $sourcePath)) {
        return
    }

    $targetPath = Join-Path $TargetRoot $RelativePath
    New-Item -ItemType Directory -Force -Path $targetPath | Out-Null
    robocopy $sourcePath $targetPath /E /XD "wheelhouse" "thirdparty" "node_modules" "__pycache__" /R:2 /W:1 /NFL /NDL /NP | Out-Host
    if ($LASTEXITCODE -gt 7) {
        throw "Gagal menyalin folder $RelativePath. Kode robocopy: $LASTEXITCODE"
    }
}

function Copy-DashboardFixedBaseline {
    param(
        [string]$RootPath,
        [string]$TargetRoot
    )

    $baselineRoot = Join-Path $TargetRoot ".dashboard-fixed-baseline\dashboard-ui\dist"
    New-Item -ItemType Directory -Force -Path $baselineRoot | Out-Null
    New-Item -ItemType Directory -Force -Path (Join-Path $baselineRoot "assets") | Out-Null

    $baselineFiles = @(
        "dashboard-ui\dist\index.html",
        "dashboard-ui\dist\favicon.svg",
        "dashboard-ui\dist\icons.svg",
        "dashboard-ui\dist\logo-pln.png",
        "dashboard-ui\dist\logo-voltkraft.png",
        "dashboard-ui\dist\assets\index-fixed-baseline.css",
        "dashboard-ui\dist\assets\index-fixed-baseline.js"
    )

    foreach ($relativePath in $baselineFiles) {
        $sourcePath = Join-Path $RootPath $relativePath
        if (-not (Test-Path -LiteralPath $sourcePath)) {
            continue
        }

        $targetRelative = $relativePath.Substring("dashboard-ui\dist\".Length)
        $targetPath = Join-Path $baselineRoot $targetRelative
        $targetParent = Split-Path -Parent $targetPath
        if ($targetParent) {
            New-Item -ItemType Directory -Force -Path $targetParent | Out-Null
        }
        Copy-Item -LiteralPath $sourcePath -Destination $targetPath -Force
    }
}

function Ensure-DashboardFixedAssetNames {
    param([string]$RootPath)

    $distRoot = Join-Path $RootPath "dashboard-ui\dist"
    $indexPath = Join-Path $distRoot "index.html"
    $assetsRoot = Join-Path $distRoot "assets"
    if (-not (Test-Path -LiteralPath $indexPath)) {
        throw "dashboard-ui/dist/index.html tidak ditemukan."
    }
    if (-not (Test-Path -LiteralPath $assetsRoot)) {
        throw "dashboard-ui/dist/assets tidak ditemukan."
    }

    $content = Get-Content -Raw -LiteralPath $indexPath
    $jsMatch = [regex]::Match($content, 'src="/assets/([^"]+\.js)"')
    $cssMatch = [regex]::Match($content, 'href="/assets/([^"]+\.css)"')
    if (-not $jsMatch.Success) {
        throw "Referensi JS dashboard-ui/dist tidak ditemukan."
    }
    if (-not $cssMatch.Success) {
        throw "Referensi CSS dashboard-ui/dist tidak ditemukan."
    }

    $sourceJs = Join-Path $assetsRoot $jsMatch.Groups[1].Value
    $sourceCss = Join-Path $assetsRoot $cssMatch.Groups[1].Value
    $targetJs = Join-Path $assetsRoot "index-fixed-baseline.js"
    $targetCss = Join-Path $assetsRoot "index-fixed-baseline.css"
    if (-not (Test-Path -LiteralPath $sourceJs)) {
        throw "Asset JS dashboard tidak ditemukan: $sourceJs"
    }
    if (-not (Test-Path -LiteralPath $sourceCss)) {
        throw "Asset CSS dashboard tidak ditemukan: $sourceCss"
    }

    Copy-Item -LiteralPath $sourceJs -Destination $targetJs -Force
    Copy-Item -LiteralPath $sourceCss -Destination $targetCss -Force
    $content = $content -replace 'src="/assets/[^"]+\.js"', 'src="/assets/index-fixed-baseline.js"'
    $content = $content -replace 'href="/assets/[^"]+\.css"', 'href="/assets/index-fixed-baseline.css"'
    Set-Content -LiteralPath $indexPath -Value $content -Encoding UTF8
}

function Get-RelativePathCompat {
    param(
        [string]$RootPath,
        [string]$FullPath
    )
    $rootFull = [System.IO.Path]::GetFullPath($RootPath).TrimEnd("\") + "\"
    $pathFull = [System.IO.Path]::GetFullPath($FullPath)
    if (-not $pathFull.StartsWith($rootFull, [System.StringComparison]::OrdinalIgnoreCase)) {
        throw "Path $pathFull bukan bagian dari $rootFull"
    }
    return $pathFull.Substring($rootFull.Length)
}

function Write-UpdateCopyNote {
    param(
        [string]$RootPath,
        [string]$CurrentPackageId
    )

    $notePath = Join-Path $RootPath "CATATAN_COPY_UPDATE_SERVER_VOLTKRAFT.txt"
    @(
        "CATATAN COPY / UPDATE SERVER VOLTKRAFT",
        "Tanggal: $(Get-Date -Format 'yyyy-MM-dd')",
        "",
        "LOKASI PROJECT",
        "- Folder development di laptop ini:",
        "  C:\Users\rhard\Documents\DC_Monitoring",
        "- Folder aplikasi di server baru yang sudah berjalan:",
        "  D:\VoltKraft-App atau folder server lain yang benar-benar dipakai",
        "  Pakai nama folder yang benar-benar ada di server dan berisi api.py.",
        "- Paket update dibuat dari laptop development, lalu ZIP hasilnya dicopy dan di-apply ke folder server di atas.",
        "",
        "PAKET UPDATE TERBARU",
        "- Copy ke server:",
        "  release-packages\$CurrentPackageId.zip",
        "",
        "- Atau copy folder hasil extract:",
        "  release-packages\$CurrentPackageId\",
        "",
        "CARA APPLY DI SERVER",
        "1. Copy ZIP paket update ke server.",
        "2. Extract ZIP.",
        "3. Jalankan dari folder hasil extract:",
        "   APPLY-UPDATE-VOLTKRAFT.cmd",
        "4. Saat ditanya ProjectDir, isi folder aplikasi server yang benar-benar ada.",
        "   Contoh: D:\Voltkraft APP",
        "",
        "CATATAN PENTING",
        "- Tidak perlu copy api.py, dashboard-ui, atau file aplikasi satu-satu.",
        "- Script apply akan backup dulu, stop server, copy file, cek server sehat, lalu kirim notifikasi update sukses satu kali.",
        "- Tampilan utama dashboard dikunci saat apply update.",
        "- Paket membawa baseline dashboard fixed di folder repair khusus.",
        "- Script apply akan memulihkan baseline fixed hanya jika server terdeteksi belum memakai tampilan fixed.",
        "- Setelah baseline sudah fixed, file dashboard-ui/dist/assets dan index.html tidak ditimpa update berikutnya.",
        "- Apply manual dengan -UpdateDashboardBaseline tetap tersedia jika ingin memaksa overwrite baseline.",
        "- Menu/add-on baru harus memakai file add-on terpisah agar menyesuaikan tampilan yang sudah fix.",
        "- Script apply juga memastikan mode WhatsApp gateway menjadi WAHA:",
        "  whatsapp_gateway_mode.txt = waha",
        "",
        "FILE KONFIGURASI YANG HARUS ADA / DIPERTAHANKAN DI SERVER",
        "File ini tidak ikut paket update karena berisi konfigurasi runtime atau credential.",
        "",
        "WAHA / WhatsApp",
        "- waha_base_url.txt",
        "- waha_api_key.txt",
        "- waha_session.txt",
        "- waha_chat_id.txt",
        "- whatsapp_gateway_mode.txt",
        "",
        "Telegram",
        "- telegram_token.txt",
        "- telegram_chat_id.txt",
        "- telegram_listener_token.txt",
        "- telegram_webhook_secret.txt",
        "- telegram_supabase_webhook_url.txt",
        "",
        "Supabase",
        "- supabase_url.txt",
        "- supabase_api_key.txt",
        "",
        "PME / PQM Report",
        "- pme_pqm_sources.json",
        "- pme_username.txt",
        "- pme_password.txt",
        "- pme_report_cookie.txt",
        "",
        "Database dan runtime",
        "- VoltKraf.db atau voltkraf.db",
        "- VoltKraf.db-wal",
        "- VoltKraf.db-shm",
        "- runtime-localhost\",
        "",
        "CATATAN MODUL KAPASITOR",
        "- Notifikasi Kapasitor hanya untuk perubahan status CB 150kV.",
        "- Notifikasi memakai status CB 150kV Close/Open.",
        "- Isi notifikasi mencantumkan tegangan sebelum dan sesudah pada fasa tegangan tertinggi sebelum perubahan.",
        "- Offline/invalid IED tidak dikirim sebagai notifikasi CB agar tidak spam.",
        "",
        "CATATAN MODUL ANNUNCIATOR",
        "- Perubahan status Annunciator tetap dikirim ke WA/Telegram sesuai indikasi.",
        "- Kondisi normal/recovery Annunciator tetap dikirim ke WA/Telegram sesuai skema.",
        "- Pending retry alarm Annunciator otomatis dibatalkan jika port sudah normal agar tidak spam.",
        "- Jika IP/API/type sumber Annunciator berubah, channel lama dibersihkan dan polling pertama menjadi baseline tanpa mengirim alarm lama.",
        "- GI Cikarang Bay Rajapaksi 2 memakai DAS Annunciator IP 172.20.17.155 dengan API /das/api/item/28 seperti struktur Bay Kopel.",
        "- Saat update pertama, channel lama Rajapaksi 2 dibersihkan satu kali agar status dari konfigurasi lama tidak spam ke WA/Telegram.",
        "- CB OPEN / CB CLOSE tetap boleh menjadi notifikasi perubahan status sesuai kondisi dari server.",
        "",
        "CATATAN NOTIFIKASI WA / TELEGRAM",
        "- Pesan teks yang dikirim lewat jalur WhatsApp juga dikirim ke Telegram secara redundant.",
        "- Dokumen/PDF yang dikirim lewat jalur WhatsApp juga dikirim ke Telegram melalui Bot API sendDocument.",
        "- Pengiriman Telegram tidak menunggu WAHA sukses/gagal.",
        "- Pesan dan dokumen yang sama tetap dibatasi dedupe agar tidak spam saat scan/retry.",
        "- PDF PQM/PME dikirim hanya ketika ada incident baru. Scan pertama saat server hidup hanya menyimpan baseline agar riwayat lama tidak dikirim ulang.",
        "- Notifikasi WA/SERVER ONLINE hanya dikirim satu kali per proses server hidup; reconnect kecil WAHA tidak mengirim pesan gateway online berulang.",
        "- Laporan harian jam 07:00 WIB diproses maksimal satu kali per tanggal; jika WA sedang offline, laporan tidak dikirim ulang berulang-ulang ke Telegram/Supabase.",
        "",
        "CATATAN PQM GITET MUARATAWAR",
        "- Ditambahkan notifikasi beban khusus PQM dengan nama GI berisi GITET Muaratawar/Muaratawar.",
        "- Status BERBEBAN jika arus average > 10 A; TIDAK BERBEBAN jika <= 10 A.",
        "- Pembacaan pertama menjadi baseline tanpa notifikasi agar tidak spam saat server start.",
        "- Notifikasi dikirim ke WA/Telegram hanya saat berubah BERBEBAN <-> TIDAK BERBEBAN.",
        "- Notifikasi mencantumkan GI, Bay, IP alat, status, arus R/S/T, dan arus average.",
        "- ION9000 GITET Muaratawar memakai fast poll default aktif: hanya register utama dibaca agar tidak timeout; counter gangguan live dilewati.",
        "- Timeout ION9000 khusus GITET Muaratawar dinaikkan menjadi 20 detik per request dan 120 detik batas total polling.",
        "",
        "CATATAN PQM GI FAJAR TRAFO 5",
        "- Ditambahkan notifikasi beban khusus GI Fajar Trafo 5 dengan status trip/normal/tinggi.",
        "- Status BEBAN TRIP / ARUS 0 A jika arus average <= 0 A.",
        "- Status BERBEBAN NORMAL / KONSUMEN MASUK jika arus average > 0 A dan < 192 A.",
        "- Status BEBAN TINGGI jika arus average >= 192 A.",
        "- Pembacaan pertama menjadi baseline tanpa notifikasi agar tidak spam saat server start.",
        "- Notifikasi dikirim ke WA/Telegram hanya saat berubah antar status beban dan mencantumkan arus R/S/T/AVG.",
        "- Notifikasi tegangan live undervoltage/overvoltage dimatikan khusus GI Fajar Trafo 5 karena salah satu fasa memang rendah.",
        "- Notifikasi gangguan kualitas daya GI Fajar Trafo 5 tidak dikirim dari counter live saja; gangguan mengikuti validasi incident PME/PDF."
    ) | Set-Content -LiteralPath $notePath -Encoding UTF8
}

$sourcePath = Resolve-FullPath $SourceDir
if ([string]::IsNullOrWhiteSpace($OutputRoot)) {
    $OutputRoot = Join-Path $sourcePath "release-packages"
}
$outputPath = [System.IO.Path]::GetFullPath($OutputRoot)
New-Item -ItemType Directory -Force -Path $outputPath | Out-Null

if ([string]::IsNullOrWhiteSpace($Version)) {
    $Version = Get-Date -Format "yyyy.MM.dd-HHmmss"
}

$timestamp = Get-Date -Format "yyyyMMdd-HHmmss"
$packageId = "update-voltkraft-$timestamp"
$packageDir = Join-Path $outputPath $packageId
$zipPath = Join-Path $outputPath "$packageId.zip"

Write-Host ""
Write-Host "=== BUAT PAKET UPDATE VOLTKRAFT ===" -ForegroundColor Cyan
Write-Host "Source  : $sourcePath"
Write-Host "Output  : $packageDir"
Write-Host "Version : $Version"
Write-Host ""

if (Test-Path -LiteralPath $packageDir) {
    Assert-ChildPath -ChildPath $packageDir -ParentPath $outputPath
    Remove-Item -LiteralPath $packageDir -Recurse -Force
}
if (Test-Path -LiteralPath $zipPath) {
    Assert-ChildPath -ChildPath $zipPath -ParentPath $outputPath
    Remove-Item -LiteralPath $zipPath -Force
}
New-Item -ItemType Directory -Force -Path $packageDir | Out-Null

if ($BuildFrontend -and -not $SkipFrontendBuild) {
    $dashboardDir = Join-Path $sourcePath "dashboard-ui"
    if (-not (Test-Path -LiteralPath $dashboardDir)) {
        throw "Folder dashboard-ui tidak ditemukan."
    }
    $npm = Get-Command npm -ErrorAction SilentlyContinue
    if (-not $npm) {
        throw "npm tidak ditemukan. Jalankan dengan -SkipFrontendBuild hanya jika dashboard-ui/dist sudah terbaru."
    }
    Write-Host "Build frontend dashboard..."
    Push-Location $dashboardDir
    if (Test-Path -LiteralPath "package-lock.json") {
        & $npm.Source ci
    } else {
        & $npm.Source install
    }
    if ($LASTEXITCODE -ne 0) {
        throw "Gagal install dependency frontend."
    }
    & $npm.Source run build
    if ($LASTEXITCODE -ne 0) {
        throw "Gagal build frontend."
    }
    Pop-Location
} else {
    Write-Host "Build frontend dilewati. Paket memakai dashboard-ui/dist yang sedang aktif."
}

if (-not (Test-Path -LiteralPath (Join-Path $sourcePath "dashboard-ui\dist\index.html"))) {
    throw "dashboard-ui/dist belum tersedia. Build frontend dulu."
}

Ensure-DashboardFixedAssetNames -RootPath $sourcePath
Write-UpdateCopyNote -RootPath $sourcePath -CurrentPackageId $packageId

$filesToPackage = @(
    "api.py",
    "database.py",
    "modbus.py",
    "pqm_ion_xml.py",
    "itic_pdf_generator.py",
    "dfr_devices.json",
    "requirements.txt",
    "package.json",
    "package-lock.json",
    "avr_mms_node_reader.js",
    "AVR TRAFO 1 GIS NEW TAMBUN.scd",
    "AVR TRAFO 2 GIS NEW TAMBUN.scd",
    "SUPABASE_SCHEMA_NOTIFICATIONS.sql",
    "setup_telegram_supabase_webhook.ps1",
    "SETUP-WAHA-VOLTKRAFT-SERVER.ps1",
    "test_telegram_notification.py",
    "test_supabase_notification.py",
    "test_waha_whatsapp_notification.py",
    "test_dfr_diagnostic_parser.py",
    "START-VOLTKRAF-LOCALHOST.cmd",
    "STOP-VOLTKRAF-LOCALHOST.cmd",
    "START-VOLTKRAF-SERVER-LAN.cmd",
    "UPDATE-VOLTKRAF-APP.cmd",
    "UPDATE-VOLTKRAF-APP-LAN.cmd",
    "BUAT-PAKET-UPDATE-VOLTKRAFT.cmd",
    "APPLY-UPDATE-VOLTKRAFT.cmd",
    "APPLY-UPDATE-VOLTKRAFT.ps1",
    "BUAT-PAKET-UPDATE-VOLTKRAFT.ps1",
    "RUNBOOK_UPDATE_SERVER_VOLTKRAFT.md",
    "CATATAN_COPY_UPDATE_SERVER_VOLTKRAFT.txt",
    "dashboard-ui\dist\kapasitor-hmi-fixed.css",
    "dashboard-ui\dist\kapasitor-hmi-fixed.js",
    "dashboard-ui\dist\server-health-center.css",
    "dashboard-ui\dist\server-health-center.js"
)

$directoriesToPackage = @(
    "deploy\voltkraf-localhost-installer",
    "supabase\functions",
    "supabase\config.toml"
)

foreach ($relativePath in $filesToPackage) {
    Copy-RelativeFile -RootPath $sourcePath -TargetRoot $packageDir -RelativePath $relativePath
}

foreach ($relativePath in $directoriesToPackage) {
    $sourceItem = Join-Path $sourcePath $relativePath
    if (-not (Test-Path -LiteralPath $sourceItem)) {
        continue
    }
    if ((Get-Item -LiteralPath $sourceItem).PSIsContainer) {
        Copy-RelativeDirectory -RootPath $sourcePath -TargetRoot $packageDir -RelativePath $relativePath
    } else {
        Copy-RelativeFile -RootPath $sourcePath -TargetRoot $packageDir -RelativePath $relativePath
    }
}

Copy-DashboardFixedBaseline -RootPath $sourcePath -TargetRoot $packageDir

$blockedPatterns = @(
    "*.db",
    "*.db-wal",
    "*.db-shm",
    "*.log",
    "*.err.log",
    "runtime-localhost\*",
    "runtime\*",
    "backups\*",
    ".venv\*",
    "node_modules\*",
    "dashboard-ui\node_modules\*",
    "telegram_*.txt",
    "telegram*.txt",
    "supabase_api_key.txt",
    "supabase_url.txt",
    "whatsapp_*.txt",
    "waha_*.txt",
    "pme_username.txt",
    "pme_password.txt",
    "pme_report_cookie.txt",
    "pandu_gi_api_key.txt",
    "kredensial.json",
    "voltkraf_admin_credentials.json",
    "alarms_log.json",
    "trend_data.json"
)

$packageFiles = Get-ChildItem -LiteralPath $packageDir -Recurse -File | ForEach-Object {
    $relative = (Get-RelativePathCompat -RootPath $packageDir -FullPath $_.FullName).Replace("/", "\")
    foreach ($pattern in $blockedPatterns) {
        if ($relative -like $pattern -or (Split-Path -Leaf $relative) -like $pattern) {
            throw "File sensitif/runtime masuk paket dan diblokir: $relative"
        }
    }
    [PSCustomObject]@{
        path = $relative
        size_bytes = $_.Length
        sha256 = (Get-FileHash -Algorithm SHA256 -LiteralPath $_.FullName).Hash
    }
} | Sort-Object path

$manifest = [PSCustomObject]@{
    package_id = $packageId
    version = $Version
    built_at = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    source_machine = $env:COMPUTERNAME
    source_path = $sourcePath
    requires_backup = $true
    restart_after_apply = $true
    post_check = @(
        "/api/health",
        "/api/server/health"
    )
    excluded_patterns = $blockedPatterns
    files = $packageFiles
}

$manifestPath = Join-Path $packageDir ".voltkraft-update-manifest.json"
$manifest | ConvertTo-Json -Depth 8 | Set-Content -LiteralPath $manifestPath -Encoding UTF8

$readmePath = Join-Path $packageDir "CARA-APPLY-UPDATE-VOLTKRAFT.txt"
@(
    "PAKET UPDATE VOLTKRAFT",
    "Package ID : $packageId",
    "Version    : $Version",
    "Dibuat     : $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')",
    "",
    "Cara apply di server:",
    "1. Copy folder atau ZIP paket ini ke server.",
    "2. Extract ZIP jika masih berupa ZIP.",
    "3. Cara paling mudah: double-click APPLY-UPDATE-VOLTKRAFT.cmd dari folder paket.",
    "4. Atau jalankan PowerShell dari folder paket:",
    "   powershell -ExecutionPolicy Bypass -File .\APPLY-UPDATE-VOLTKRAFT.ps1 -ProjectDir ""C:\Path\Ke\DC_Monitoring"" -EnableLan",
    "",
    "Catatan:",
    "- Database, token, credential, log, dan runtime tidak disertakan.",
    "- Script apply akan backup dulu, stop server, copy file, post-check, lalu rollback otomatis jika gagal.",
    "- Notifikasi update sukses dikirim satu kali setelah post-check server sehat."
) | Set-Content -LiteralPath $readmePath -Encoding UTF8

if (-not $NoZip) {
    Write-Host "Membuat ZIP update..."
    Add-Type -AssemblyName System.IO.Compression.FileSystem
    [System.IO.Compression.ZipFile]::CreateFromDirectory(
        $packageDir,
        $zipPath,
        [System.IO.Compression.CompressionLevel]::Fastest,
        $false
    )
}

Write-Host ""
Write-Host "Paket update selesai dibuat:" -ForegroundColor Green
Write-Host "  $packageDir"
if (-not $NoZip) {
    Write-Host "  $zipPath"
}
Write-Host ""
Write-Host "File sensitif dan database tidak dimasukkan ke paket."

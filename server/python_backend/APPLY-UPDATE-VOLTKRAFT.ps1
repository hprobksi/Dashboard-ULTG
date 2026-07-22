param(
    [string]$ProjectDir = "$env:USERPROFILE\VoltKraft",
    [string]$PackageDir = (Split-Path -Parent $MyInvocation.MyCommand.Path),
    [int]$Port = 8000,
    [switch]$EnableLan,
    [switch]$SkipDependencyInstall,
    [switch]$SkipUpdateNotification,
    [switch]$UpdateDashboardBaseline,
    [switch]$DryRun
)

$ErrorActionPreference = "Stop"

function Resolve-FullPath {
    param([string]$PathValue)
    if (-not (Test-Path -LiteralPath $PathValue)) {
        throw "Path tidak ditemukan: $PathValue"
    }
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

function Test-BlockedPath {
    param([string]$RelativePath)
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
    $leaf = Split-Path -Leaf $RelativePath
    foreach ($pattern in $blockedPatterns) {
        if ($RelativePath -like $pattern -or $leaf -like $pattern) {
            return $true
        }
    }
    return $false
}

function Test-DashboardBaselinePath {
    param([string]$RelativePath)
    $normalized = ([string]$RelativePath).Replace("/", "\")
    return (
        $normalized -eq "dashboard-ui\dist\index.html" -or
        $normalized -like "dashboard-ui\dist\assets\*"
    )
}

function Test-PackageInternalPath {
    param([string]$RelativePath)
    $normalized = ([string]$RelativePath).Replace("/", "\")
    return $normalized -like ".dashboard-fixed-baseline\*"
}

function Get-TargetPython {
    param([string]$RootPath)
    $venvPython = Join-Path $RootPath ".venv\Scripts\python.exe"
    if (Test-Path -LiteralPath $venvPython) {
        return $venvPython
    }
    $python = Get-Command python -ErrorAction SilentlyContinue
    if ($python) {
        return $python.Source
    }
    $py = Get-Command py -ErrorAction SilentlyContinue
    if ($py) {
        return $py.Source
    }
    return ""
}

function Stop-VoltKraft {
    param(
        [string]$RootPath,
        [int]$ListenPort
    )
    $stopScript = Join-Path $RootPath "deploy\voltkraf-localhost-installer\stop-voltkraf-localhost.ps1"
    if (Test-Path -LiteralPath $stopScript) {
        Write-Host "Menghentikan server VoltKraft..."
        & $stopScript -Port $ListenPort
        return
    }
    Write-Warning "Script stop tidak ditemukan. Update lanjut tanpa stop otomatis."
}

function Start-VoltKraft {
    param(
        [string]$RootPath,
        [int]$ListenPort,
        [bool]$LanMode
    )
    $startScript = Join-Path $RootPath "deploy\voltkraf-localhost-installer\start-voltkraf-localhost.ps1"
    if (-not (Test-Path -LiteralPath $startScript)) {
        throw "Script start tidak ditemukan: $startScript"
    }

    Write-Host "Menjalankan server VoltKraft..."
    if ($LanMode) {
        & $startScript -Port $ListenPort -EnableLan -NoBrowser
    } else {
        & $startScript -Port $ListenPort -NoBrowser
    }
}

function Backup-Database {
    param(
        [string]$RootPath,
        [string]$BackupRoot,
        [string]$PythonExe
    )

    $candidates = @("VoltKraf.db", "voltkraf.db", "VoltKraft.db", "voltcraft.db")
    $dbPath = $null
    foreach ($candidate in $candidates) {
        $path = Join-Path $RootPath $candidate
        if (Test-Path -LiteralPath $path) {
            $dbPath = (Resolve-Path -LiteralPath $path).Path
            break
        }
    }

    if (-not $dbPath) {
        Write-Warning "Database SQLite tidak ditemukan untuk backup."
        return $null
    }

    $dbBackupDir = Join-Path $BackupRoot "database"
    New-Item -ItemType Directory -Force -Path $dbBackupDir | Out-Null
    $targetDb = Join-Path $dbBackupDir (Split-Path -Leaf $dbPath)

    if ($PythonExe -and (Test-Path -LiteralPath $PythonExe)) {
        Write-Host "Membuat backup database SQLite konsisten..."
        $backupCode = "import sqlite3, sys; src, dst = sys.argv[1], sys.argv[2]; source = sqlite3.connect(src); target = sqlite3.connect(dst); source.backup(target); target.close(); source.close()"
        & $PythonExe -c $backupCode $dbPath $targetDb
        if ($LASTEXITCODE -ne 0) {
            throw "Gagal membuat backup database SQLite."
        }
    } else {
        Write-Warning "Python tidak tersedia. Database dicopy langsung."
        Copy-Item -LiteralPath $dbPath -Destination $targetDb -Force
        foreach ($suffix in @("-wal", "-shm")) {
            $sidecar = "$dbPath$suffix"
            if (Test-Path -LiteralPath $sidecar) {
                Copy-Item -LiteralPath $sidecar -Destination (Join-Path $dbBackupDir "$(Split-Path -Leaf $dbPath)$suffix") -Force
            }
        }
    }

    return [PSCustomObject]@{
        source = $dbPath
        backup = $targetDb
    }
}

function Restore-Database {
    param([object]$DatabaseBackup)
    if (-not $DatabaseBackup) {
        return
    }
    if (-not (Test-Path -LiteralPath $DatabaseBackup.backup)) {
        return
    }
    Write-Host "Rollback database: $($DatabaseBackup.source)"
    Copy-Item -LiteralPath $DatabaseBackup.backup -Destination $DatabaseBackup.source -Force
    foreach ($suffix in @("-wal", "-shm")) {
        $sidecar = "$($DatabaseBackup.source)$suffix"
        if (Test-Path -LiteralPath $sidecar) {
            Remove-Item -LiteralPath $sidecar -Force -ErrorAction SilentlyContinue
        }
    }
}

function Backup-And-CopyFile {
    param(
        [string]$PackageRoot,
        [string]$TargetRoot,
        [string]$RelativePath,
        [string]$FileBackupRoot,
        [System.Collections.ArrayList]$RollbackItems
    )

    if (Test-BlockedPath -RelativePath $RelativePath) {
        throw "File sensitif/runtime tidak boleh dicopy otomatis: $RelativePath"
    }

    $sourcePath = Join-Path $PackageRoot $RelativePath
    $targetPath = Join-Path $TargetRoot $RelativePath
    Assert-ChildPath -ChildPath $sourcePath -ParentPath $PackageRoot
    Assert-ChildPath -ChildPath $targetPath -ParentPath $TargetRoot

    if (-not (Test-Path -LiteralPath $sourcePath)) {
        throw "File paket tidak ditemukan: $RelativePath"
    }

    $existed = Test-Path -LiteralPath $targetPath
    $backupPath = Join-Path $FileBackupRoot $RelativePath
    if ($existed) {
        $backupParent = Split-Path -Parent $backupPath
        if ($backupParent) {
            New-Item -ItemType Directory -Force -Path $backupParent | Out-Null
        }
        Copy-Item -LiteralPath $targetPath -Destination $backupPath -Force
    }

    $targetParent = Split-Path -Parent $targetPath
    if ($targetParent) {
        New-Item -ItemType Directory -Force -Path $targetParent | Out-Null
    }
    Copy-Item -LiteralPath $sourcePath -Destination $targetPath -Force

    [void]$RollbackItems.Add([PSCustomObject]@{
        path = $RelativePath
        target = $targetPath
        existed = $existed
        backup = $backupPath
    })
}

function Backup-TargetFileForRollback {
    param(
        [string]$RootPath,
        [string]$RelativePath,
        [string]$FileBackupRoot,
        [System.Collections.ArrayList]$RollbackItems
    )

    $targetPath = Join-Path $RootPath $RelativePath
    $backupPath = Join-Path $FileBackupRoot $RelativePath
    Assert-ChildPath -ChildPath $targetPath -ParentPath $RootPath
    Assert-ChildPath -ChildPath $backupPath -ParentPath $FileBackupRoot

    $existed = Test-Path -LiteralPath $targetPath
    if ($existed) {
        $backupParent = Split-Path -Parent $backupPath
        if ($backupParent) {
            New-Item -ItemType Directory -Force -Path $backupParent | Out-Null
        }
        Copy-Item -LiteralPath $targetPath -Destination $backupPath -Force
    }

    [void]$RollbackItems.Add([PSCustomObject]@{
        path = $RelativePath
        target = $targetPath
        existed = $existed
        backup = $backupPath
    })
}

function Add-TextBeforeClosingTag {
    param(
        [string]$Content,
        [string]$ClosingTag,
        [string]$TextToAdd
    )
    if ($Content -match [regex]::Escape($ClosingTag)) {
        $regex = [regex]::new([regex]::Escape($ClosingTag), [System.Text.RegularExpressions.RegexOptions]::IgnoreCase)
        return $regex.Replace($Content, "$TextToAdd`r`n$ClosingTag", 1)
    }
    return "$Content`r`n$TextToAdd"
}

function Merge-DashboardAddonRefs {
    param(
        [string]$RootPath,
        [string]$PackageRoot,
        [string]$FileBackupRoot,
        [System.Collections.ArrayList]$RollbackItems
    )

    $relativeIndex = "dashboard-ui\dist\index.html"
    $targetIndex = Join-Path $RootPath $relativeIndex
    $packageIndex = Join-Path $PackageRoot $relativeIndex

    if (-not (Test-Path -LiteralPath $targetIndex)) {
        if (-not (Test-Path -LiteralPath $packageIndex)) {
            throw "dashboard-ui/dist/index.html tidak ditemukan di target maupun paket."
        }
        Backup-And-CopyFile -PackageRoot $PackageRoot -TargetRoot $RootPath -RelativePath $relativeIndex -FileBackupRoot $FileBackupRoot -RollbackItems $RollbackItems
        return
    }

    $content = Get-Content -Raw -LiteralPath $targetIndex
    $updated = $content
    $headRefs = @()
    $bodyRefs = @()

    if ((Test-Path -LiteralPath (Join-Path $RootPath "dashboard-ui\dist\kapasitor-hmi-fixed.css")) -and $updated -notmatch "kapasitor-hmi-fixed\.css") {
        $headRefs += '  <link rel="stylesheet" crossorigin href="/kapasitor-hmi-fixed.css?v=14">'
    }
    if ((Test-Path -LiteralPath (Join-Path $RootPath "dashboard-ui\dist\server-health-center.css")) -and $updated -notmatch "server-health-center\.css") {
        $headRefs += '  <link rel="stylesheet" crossorigin href="/server-health-center.css?v=6">'
    }
    if ((Test-Path -LiteralPath (Join-Path $RootPath "dashboard-ui\dist\kapasitor-hmi-fixed.js")) -and $updated -notmatch "kapasitor-hmi-fixed\.js") {
        $bodyRefs += '    <script defer src="/kapasitor-hmi-fixed.js?v=14"></script>'
    }
    if ((Test-Path -LiteralPath (Join-Path $RootPath "dashboard-ui\dist\server-health-center.js")) -and $updated -notmatch "server-health-center\.js") {
        $bodyRefs += '    <script defer src="/server-health-center.js?v=6"></script>'
    }

    if ($headRefs.Count -gt 0) {
        $updated = Add-TextBeforeClosingTag -Content $updated -ClosingTag "</head>" -TextToAdd ($headRefs -join "`r`n")
    }
    if ($bodyRefs.Count -gt 0) {
        $updated = Add-TextBeforeClosingTag -Content $updated -ClosingTag "</body>" -TextToAdd ($bodyRefs -join "`r`n")
    }

    if ($updated -ne $content) {
        Backup-TargetFileForRollback -RootPath $RootPath -RelativePath $relativeIndex -FileBackupRoot $FileBackupRoot -RollbackItems $RollbackItems
        Set-Content -LiteralPath $targetIndex -Value $updated -Encoding UTF8
        Write-Host "Index dashboard dipertahankan; referensi add-on ditambahkan seperlunya."
    } else {
        Write-Host "Index dashboard dipertahankan; referensi add-on sudah lengkap."
    }
}

function Test-FixedDashboardBaseline {
    param([string]$RootPath)

    $indexPath = Join-Path $RootPath "dashboard-ui\dist\index.html"
    $assetCss = Join-Path $RootPath "dashboard-ui\dist\assets\index-fixed-baseline.css"
    $assetJs = Join-Path $RootPath "dashboard-ui\dist\assets\index-fixed-baseline.js"
    if (-not (Test-Path -LiteralPath $indexPath)) {
        return $false
    }
    if (-not (Test-Path -LiteralPath $assetCss) -or -not (Test-Path -LiteralPath $assetJs)) {
        return $false
    }

    $content = Get-Content -Raw -LiteralPath $indexPath
    return (
        $content -match "assets/index-fixed-baseline\.css" -and
        $content -match "assets/index-fixed-baseline\.js"
    )
}

function Restore-FixedDashboardBaselineIfNeeded {
    param(
        [string]$RootPath,
        [string]$PackageRoot,
        [string]$FileBackupRoot,
        [System.Collections.ArrayList]$RollbackItems,
        [bool]$ForceRestore
    )

    $baselineRoot = Join-Path $PackageRoot ".dashboard-fixed-baseline\dashboard-ui\dist"
    if (-not (Test-Path -LiteralPath $baselineRoot)) {
        Write-Host "Baseline fixed dashboard tidak ada di paket; dashboard target dipertahankan."
        return
    }

    if ((-not $ForceRestore) -and (Test-FixedDashboardBaseline -RootPath $RootPath)) {
        Write-Host "Dashboard sudah memakai baseline fixed; tampilan utama dipertahankan."
        return
    }

    Write-Host "Memulihkan baseline fixed dashboard agar tampilan kembali sesuai versi fix..." -ForegroundColor Yellow
    $baselineFiles = @(
        "index.html",
        "favicon.svg",
        "icons.svg",
        "logo-pln.png",
        "logo-voltkraft.png",
        "assets\index-fixed-baseline.css",
        "assets\index-fixed-baseline.js"
    )

    foreach ($relative in $baselineFiles) {
        $sourcePath = Join-Path $baselineRoot $relative
        if (-not (Test-Path -LiteralPath $sourcePath)) {
            continue
        }

        $targetRelative = Join-Path "dashboard-ui\dist" $relative
        Backup-TargetFileForRollback -RootPath $RootPath -RelativePath $targetRelative -FileBackupRoot $FileBackupRoot -RollbackItems $RollbackItems
        $targetPath = Join-Path $RootPath $targetRelative
        $targetParent = Split-Path -Parent $targetPath
        if ($targetParent) {
            New-Item -ItemType Directory -Force -Path $targetParent | Out-Null
        }
        Copy-Item -LiteralPath $sourcePath -Destination $targetPath -Force
    }
}

function Restore-Files {
    param([System.Collections.ArrayList]$RollbackItems)
    for ($index = $RollbackItems.Count - 1; $index -ge 0; $index--) {
        $item = $RollbackItems[$index]
        if ($item.existed -and (Test-Path -LiteralPath $item.backup)) {
            $parent = Split-Path -Parent $item.target
            if ($parent) {
                New-Item -ItemType Directory -Force -Path $parent | Out-Null
            }
            Copy-Item -LiteralPath $item.backup -Destination $item.target -Force
            Write-Host "Rollback file: $($item.path)"
        } elseif (-not $item.existed -and (Test-Path -LiteralPath $item.target)) {
            Remove-Item -LiteralPath $item.target -Force -ErrorAction SilentlyContinue
            Write-Host "Rollback file baru: $($item.path)"
        }
    }
}

function Verify-Hashes {
    param(
        [string]$TargetRoot,
        [object[]]$Files
    )
    foreach ($file in $Files) {
        $relative = [string]$file.path
        if (Test-BlockedPath -RelativePath $relative) {
            continue
        }
        $targetPath = Join-Path $TargetRoot $relative
        if (-not (Test-Path -LiteralPath $targetPath)) {
            throw "File hasil update tidak ditemukan: $relative"
        }
        $actual = (Get-FileHash -Algorithm SHA256 -LiteralPath $targetPath).Hash
        if ($actual -ne $file.sha256) {
            throw "Checksum tidak cocok untuk $relative"
        }
    }
}

function Ensure-WahaGatewayMode {
    param(
        [string]$RootPath,
        [string]$FileBackupRoot,
        [System.Collections.ArrayList]$RollbackItems
    )

    $relativePath = "whatsapp_gateway_mode.txt"
    $targetPath = Join-Path $RootPath $relativePath
    $backupPath = Join-Path $FileBackupRoot $relativePath
    Assert-ChildPath -ChildPath $targetPath -ParentPath $RootPath
    Assert-ChildPath -ChildPath $backupPath -ParentPath $FileBackupRoot

    $existed = Test-Path -LiteralPath $targetPath
    if ($existed) {
        $backupParent = Split-Path -Parent $backupPath
        if ($backupParent) {
            New-Item -ItemType Directory -Force -Path $backupParent | Out-Null
        }
        Copy-Item -LiteralPath $targetPath -Destination $backupPath -Force
    }

    Set-Content -LiteralPath $targetPath -Value "waha" -Encoding ASCII
    [void]$RollbackItems.Add([PSCustomObject]@{
        path = $relativePath
        target = $targetPath
        existed = $existed
        backup = $backupPath
    })
    Write-Host "Mode WhatsApp gateway diset ke WAHA."
}

function Install-Dependencies {
    param(
        [string]$RootPath,
        [string]$PythonExe
    )
    if (-not $PythonExe) {
        throw "Python tidak ditemukan untuk validasi dependency."
    }
    if ($PythonExe.EndsWith("py.exe", [System.StringComparison]::OrdinalIgnoreCase)) {
        & $PythonExe -3 -m pip install -r (Join-Path $RootPath "requirements.txt")
    } else {
        & $PythonExe -m pip install -r (Join-Path $RootPath "requirements.txt")
    }
    if ($LASTEXITCODE -ne 0) {
        throw "Gagal install/update dependency Python."
    }
}

function Test-PythonCompile {
    param(
        [string]$RootPath,
        [string]$PythonExe
    )
    if (-not $PythonExe) {
        throw "Python tidak ditemukan untuk compile check."
    }
    Push-Location $RootPath
    if ($PythonExe.EndsWith("py.exe", [System.StringComparison]::OrdinalIgnoreCase)) {
        & $PythonExe -3 -m py_compile api.py database.py
    } else {
        & $PythonExe -m py_compile api.py database.py
    }
    Pop-Location
    if ($LASTEXITCODE -ne 0) {
        throw "Compile Python gagal."
    }
}

function Test-ServerPostCheck {
    param([int]$ListenPort)
    $healthUrl = "http://127.0.0.1:$ListenPort/api/health"
    $serverHealthUrl = "http://127.0.0.1:$ListenPort/api/server/health"
    $ready = $false

    for ($i = 0; $i -lt 45; $i++) {
        try {
            $health = Invoke-RestMethod -Uri $healthUrl -TimeoutSec 3
            if ($health.status -eq "ok") {
                $ready = $true
                break
            }
        } catch {
            Start-Sleep -Seconds 1
        }
    }

    if (-not $ready) {
        throw "Post-check gagal: /api/health tidak OK."
    }

    try {
        Invoke-WebRequest -UseBasicParsing -Uri $serverHealthUrl -TimeoutSec 5 | Out-Null
    } catch {
        if ($_.Exception.Response) {
            $statusCode = [int]$_.Exception.Response.StatusCode
            if ($statusCode -eq 401) {
                return
            }
        }
        throw "Post-check gagal: /api/server/health tidak tersedia."
    }
}

function Send-UpdateNotification {
    param(
        [string]$RootPath,
        [string]$PythonExe,
        [string]$PackageId,
        [string]$Version
    )
    if (-not $PythonExe) {
        Write-Warning "Notifikasi update dilewati: Python tidak ditemukan."
        return
    }

    $message = @"
[VoltKraft Update]
Server berhasil terhubung kembali setelah update.
Status  : NORMAL - siap menerima alarm dari server sesuai skema.
Package : $PackageId
Version : $Version
Waktu   : $(Get-Date -Format "yyyy-MM-dd HH:mm:ss")

Notifikasi ini dikirim satu kali oleh APPLY-UPDATE-VOLTKRAFT setelah post-check sukses.
"@

    $encoded = [Convert]::ToBase64String([Text.Encoding]::UTF8.GetBytes($message))
    $notifyCode = @'
import base64
import sys

message = base64.b64decode(sys.argv[1]).decode("utf-8")
package_id = sys.argv[2]
import api

setting_key = f"voltkraft_update_notification_sent::{package_id}"
if api.db.get_setting(setting_key, "0") == "1":
    raise SystemExit(0)

ok = api.send_whatsapp_notification(
    message,
    allow_recovery_recap=False,
    enqueue_on_failure=False,
    respect_duplicate=False,
    fanout_secondary=True,
)
if ok:
    api.db.set_setting(api.WHATSAPP_CONNECTION_STATE_KEY, "online")
    api.db.set_setting(api.WHATSAPP_RECOVERY_RECAP_PENDING_KEY, "0")
    api.db.set_setting(setting_key, "1")
raise SystemExit(0 if ok else 2)
'@

    Push-Location $RootPath
    try {
        if ($PythonExe.EndsWith("py.exe", [System.StringComparison]::OrdinalIgnoreCase)) {
            & $PythonExe -3 -c $notifyCode $encoded $PackageId
        } else {
            & $PythonExe -c $notifyCode $encoded $PackageId
        }
        if ($LASTEXITCODE -eq 0) {
            Write-Host "Notifikasi update sukses terkirim." -ForegroundColor Green
        } else {
            Write-Warning "Notifikasi update tidak berhasil dikirim. Server tetap sudah sehat."
        }
    } finally {
        Pop-Location
    }
}

$projectPath = Resolve-FullPath $ProjectDir
$packagePath = Resolve-FullPath $PackageDir
if ($projectPath -ieq $packagePath) {
    throw "ProjectDir dan PackageDir sama. Jalankan script dari folder paket update, bukan dari folder project target."
}
if (-not (Test-Path -LiteralPath (Join-Path $projectPath "api.py"))) {
    throw "ProjectDir tidak terlihat seperti folder VoltKraft: $projectPath"
}

$manifestPath = Join-Path $packagePath ".voltkraft-update-manifest.json"
if (-not (Test-Path -LiteralPath $manifestPath)) {
    throw "Manifest update tidak ditemukan: $manifestPath"
}
$manifest = Get-Content -Raw -LiteralPath $manifestPath | ConvertFrom-Json
$packageId = [string]$manifest.package_id
$version = [string]$manifest.version
if ([string]::IsNullOrWhiteSpace($packageId)) {
    throw "Manifest tidak valid: package_id kosong."
}

$historyRoot = Join-Path $projectPath ".release\history\$packageId"
$backupRoot = Join-Path $historyRoot "backup"
$fileBackupRoot = Join-Path $backupRoot "files"
$logPath = Join-Path $historyRoot "apply.log"
New-Item -ItemType Directory -Force -Path $fileBackupRoot | Out-Null

Start-Transcript -Path $logPath -Force | Out-Null

$rollbackItems = New-Object System.Collections.ArrayList
$databaseBackup = $null
$pythonExe = Get-TargetPython -RootPath $projectPath
$applySucceeded = $false

try {
    Write-Host ""
    Write-Host "=== APPLY UPDATE VOLTKRAFT ===" -ForegroundColor Cyan
    Write-Host "Project : $projectPath"
    Write-Host "Package : $packagePath"
    Write-Host "ID      : $packageId"
    Write-Host "Version : $version"
    Write-Host ""

    if ($DryRun) {
        Write-Host "DryRun aktif. File tidak akan dicopy."
        $manifest.files | Select-Object path, size_bytes | Format-Table
        $applySucceeded = $true
        return
    }

    Stop-VoltKraft -RootPath $projectPath -ListenPort $Port
    $databaseBackup = Backup-Database -RootPath $projectPath -BackupRoot $backupRoot -PythonExe $pythonExe

    Write-Host "Menyalin file update..."
    foreach ($file in $manifest.files) {
        $relativePath = [string]$file.path
        if ($relativePath -eq ".voltkraft-update-manifest.json" -or $relativePath -eq "CARA-APPLY-UPDATE-VOLTKRAFT.txt") {
            continue
        }
        if (Test-PackageInternalPath -RelativePath $relativePath) {
            continue
        }
        if ((-not $UpdateDashboardBaseline) -and (Test-DashboardBaselinePath -RelativePath $relativePath)) {
            Write-Host "Tampilan utama dashboard dipertahankan, file dilewati: $relativePath"
            continue
        }
        Backup-And-CopyFile `
            -PackageRoot $packagePath `
            -TargetRoot $projectPath `
            -RelativePath $relativePath `
            -FileBackupRoot $fileBackupRoot `
            -RollbackItems $rollbackItems
    }

    Verify-Hashes -TargetRoot $projectPath -Files @($manifest.files | Where-Object {
        $_.path -ne ".voltkraft-update-manifest.json" -and
        $_.path -ne "CARA-APPLY-UPDATE-VOLTKRAFT.txt" -and
        (-not (Test-PackageInternalPath -RelativePath ([string]$_.path))) -and
        ($UpdateDashboardBaseline -or -not (Test-DashboardBaselinePath -RelativePath ([string]$_.path)))
    })

    Restore-FixedDashboardBaselineIfNeeded `
        -RootPath $projectPath `
        -PackageRoot $packagePath `
        -FileBackupRoot $fileBackupRoot `
        -RollbackItems $rollbackItems `
        -ForceRestore ([bool]$UpdateDashboardBaseline)

    if (-not $UpdateDashboardBaseline) {
        Merge-DashboardAddonRefs -RootPath $projectPath -PackageRoot $packagePath -FileBackupRoot $fileBackupRoot -RollbackItems $rollbackItems
    }

    Ensure-WahaGatewayMode -RootPath $projectPath -FileBackupRoot $fileBackupRoot -RollbackItems $rollbackItems

    if (-not $SkipDependencyInstall) {
        Install-Dependencies -RootPath $projectPath -PythonExe $pythonExe
    }

    Test-PythonCompile -RootPath $projectPath -PythonExe $pythonExe

    if (-not (Test-Path -LiteralPath (Join-Path $projectPath "dashboard-ui\dist\index.html"))) {
        throw "dashboard-ui/dist/index.html tidak ditemukan setelah update."
    }

    $installedManifestPath = Join-Path $projectPath ".release\installed-version.json"
    Copy-Item -LiteralPath $manifestPath -Destination $installedManifestPath -Force

    Start-VoltKraft -RootPath $projectPath -ListenPort $Port -LanMode ([bool]$EnableLan)
    Test-ServerPostCheck -ListenPort $Port

    $resultPath = Join-Path $historyRoot "apply-result.json"
    [PSCustomObject]@{
        status = "success"
        package_id = $packageId
        version = $version
        applied_at = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
        project_dir = $projectPath
        backup_dir = $backupRoot
    } | ConvertTo-Json -Depth 5 | Set-Content -LiteralPath $resultPath -Encoding UTF8

    if (-not $SkipUpdateNotification) {
        Send-UpdateNotification -RootPath $projectPath -PythonExe $pythonExe -PackageId $packageId -Version $version
    }

    $applySucceeded = $true
    Write-Host ""
    Write-Host "Update VoltKraft berhasil. Backup: $backupRoot" -ForegroundColor Green
} catch {
    Write-Host "Update gagal: $($_.Exception.Message)" -ForegroundColor Red
    try {
        Stop-VoltKraft -RootPath $projectPath -ListenPort $Port
        Restore-Files -RollbackItems $rollbackItems
        Restore-Database -DatabaseBackup $databaseBackup
        Start-VoltKraft -RootPath $projectPath -ListenPort $Port -LanMode ([bool]$EnableLan)
        [PSCustomObject]@{
            status = "rolled_back"
            package_id = $packageId
            version = $version
            failed_at = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
            error = $_.Exception.Message
            backup_dir = $backupRoot
        } | ConvertTo-Json -Depth 5 | Set-Content -LiteralPath (Join-Path $historyRoot "apply-result.json") -Encoding UTF8
        Write-Host "Rollback selesai. Server lama dicoba dijalankan kembali." -ForegroundColor Yellow
    } catch {
        Write-Host "Rollback juga gagal: $($_.Exception.Message)" -ForegroundColor Red
    }
    exit 1
} finally {
    Stop-Transcript | Out-Null
}

if (-not $applySucceeded) {
    exit 1
}
exit 0

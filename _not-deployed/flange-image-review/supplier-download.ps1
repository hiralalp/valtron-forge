param(
    [string[]]$Products = @('reducing-flanges'),
    [string]$BrowserExportPath,
    [switch]$VerifyOnly
)

$ErrorActionPreference = 'Stop'
Add-Type -AssemblyName System.Drawing
$destinationDirectory = Join-Path $PSScriptRoot 'supplier-references'
$manifestPath = Join-Path $destinationDirectory 'sources.json'
$sourceRoot = 'https://www.dynamicforgefittings.com/'
$candidatesPath = Join-Path $PSScriptRoot 'supplier-candidates.json'
$sources = @(
    @{ Product = 'plate-flanges'; Page = 'plate-flange-oldest-manufacture/'; Match = 'plate-flange' },
    @{ Product = 'reducing-flanges'; Page = 'asme-b16-5-reducing-flanges/'; Match = 'reducing-flange'; Images = @(
        @{ src = 'https://www.dynamicforgefittings.com/wp-content/uploads/2016/01/stainless-steel-asme-b16-5-reducing-flanges.jpg'; alt = 'stainless steel ASME B16.5 Reducing Flanges' },
        @{ src = 'https://www.dynamicforgefittings.com/wp-content/uploads/2016/01/carbon-steel-asme-b16-5-reducing-flanges.jpg'; alt = 'carbon steel ASME B16.5 Reducing Flanges' },
        @{ src = 'https://www.dynamicforgefittings.com/wp-content/uploads/2016/01/alloy-steel-asme-b16-5-reducing-flanges.jpg'; alt = 'alloy steel ASME B16.5 Reducing Flanges' }
    ) },
    @{ Product = 'weldo-nipo-flanges'; Page = 'asme-16-5-weldo-nipo-flanges/'; Match = 'weldo|nipo' },
    @{ Product = 'loose-flanges'; Page = 'asme-b16-5-loose-flanges/'; Match = 'loose-flange' },
    @{ Product = 'square-flanges'; Page = 'asme-b16-5-square-flanges/'; Match = 'square-flange' },
    @{ Product = 'expander-flanges'; Page = 'asme-b16-5-expander-flanges/'; Match = 'expander-flange' },
    @{ Product = 'high-hub-blind-flanges'; Page = 'asme-b16-5-high-hub-blinds-flanges/'; Match = 'high-hub' },
    @{ Product = 'spectacle-blind-flanges'; Page = 'asme-b16-5-spectacle-blind-flanges/'; Match = 'spectacle' },
    @{ Product = 'spades-ring-spacers'; Page = 'asme-b16-5-spades-ring-spacers-flanges/'; Match = 'spades|spacers' },
    @{ Product = 'lip-type-flanges'; Page = 'lip-type-flange/'; Match = 'lip-type|lip-flange' },
    @{ Product = 'puddle-flanges'; Page = 'puddle-flanges/'; Match = 'puddle' },
    @{ Product = 'forged-flanges'; Page = 'asme-16-5-forged-flanges/'; Match = 'forged-flange' },
    @{ Product = 'large-diameter-flanges'; Page = 'asme-b16-5-weld-neck-flanges-series-a-or-b/'; Match = 'series|large' }
)

if (Test-Path -LiteralPath $candidatesPath) {
    $cachedSources = ConvertFrom-Json -InputObject ([IO.File]::ReadAllText($candidatesPath))
    $sources = @($cachedSources)
}
if ($BrowserExportPath) {
    $export = [IO.File]::ReadAllText($BrowserExportPath)
    $entries = ConvertFrom-Json -InputObject ($export.Substring($export.IndexOf('[')))
    foreach ($entry in $entries) {
        $target = @($sources | Where-Object { $_.Page -eq $entry.path })
        if ($target.Count -ne 1 -or $entry.status -ne 200) { throw "Unmatched source page: $($entry.path)" }
        $target[0] | Add-Member -NotePropertyName Images -NotePropertyValue $entry.images -Force
        if ($target[0] -is [hashtable]) { $target[0]['Images'] = $entry.images }
    }
    [IO.File]::WriteAllText($candidatesPath, (ConvertTo-Json -InputObject $sources -Depth 8), [Text.UTF8Encoding]::new($false))
}

function Test-DownloadedImage {
    param([string]$Path)
    if ($Path -match '\.webp(\.part)?$') {
        $details = & node (Join-Path $PSScriptRoot 'image-info.cjs') $Path
        if ($LASTEXITCODE -ne 0) { throw "WebP decoding failed: $Path" }
        return ConvertFrom-Json -InputObject ($details -join '')
    }
    $image = [Drawing.Image]::FromFile($Path)
    try {
        [pscustomobject]@{ Width = $image.Width; Height = $image.Height }
    } finally {
        $image.Dispose()
    }
}

if (-not $VerifyOnly) {
    [IO.Directory]::CreateDirectory($destinationDirectory) | Out-Null
    $records = @()
    if (Test-Path -LiteralPath $manifestPath) {
        $saved = ConvertFrom-Json -InputObject ([IO.File]::ReadAllText($manifestPath))
        $records = @($saved)
    }
    foreach ($source in $sources) {
        if ($Products -notcontains 'all' -and $Products -notcontains $source.Product) { continue }
        $pageUrl = if ($source.Page -match '^https://') { $source.Page } else { $sourceRoot + $source.Page }
        $images = @($source.Images | Where-Object {
            $_.src -match '\.(jpg|jpeg|png|webp)(\?|$)' -and
            $_.src -notmatch 'packag|shipping|exhibition|logo'
        } | ForEach-Object { [pscustomobject]@{ src = $_.src; alt = $_.alt } } | Sort-Object src -Unique)
        if (-not $images.Count) {
            Write-Warning "No matching product image: $($source.Product)"
            continue
        }
        foreach ($candidate in $images) {
            if (-not $candidate.src) { throw 'Missing image URL' }
            $imageUrl = [uri]::new([uri]$pageUrl, [Net.WebUtility]::HtmlDecode($candidate.src)).AbsoluteUri
            $extension = [IO.Path]::GetExtension(([uri]$imageUrl).AbsolutePath).ToLowerInvariant()
            $identity = [Security.Cryptography.SHA256]::Create()
            try {
                $suffix = ([BitConverter]::ToString($identity.ComputeHash([Text.Encoding]::UTF8.GetBytes($imageUrl)))).Replace('-', '').Substring(0, 10).ToLowerInvariant()
            } finally {
                $identity.Dispose()
            }
            $file = $source.Product + '-' + $suffix + $extension
            $destination = Join-Path $destinationDirectory $file
            $existing = @($records | Where-Object { $_.file -eq $file })
            if (Test-Path -LiteralPath $destination) {
                if ($existing.Count -ne 1 -or (Get-FileHash -LiteralPath $destination -Algorithm SHA256).Hash -ne $existing[0].sha256) {
                    throw "Unverified existing file: $destination"
                }
                Write-Output "Preserved: $file"
                continue
            }
            if ($existing.Count) { throw "Manifest references missing file: $file" }
            $partial = $destination + '.part'
            try {
                Invoke-WebRequest -UseBasicParsing -Uri $imageUrl -OutFile $partial -TimeoutSec 60
                $dimensions = Test-DownloadedImage $partial
                Move-Item -LiteralPath $partial -Destination $destination
            } catch {
                if (Test-Path -LiteralPath $partial) { Remove-Item -LiteralPath $partial }
                Write-Warning "Download failed for $imageUrl : $($_.Exception.Message)"
                continue
            }
            $records += [pscustomobject]@{
                file = $file
                product = $source.Product
                sourcePage = $pageUrl
                downloadUrl = $imageUrl
                sourceAlt = [Net.WebUtility]::HtmlDecode($candidate.alt)
                downloadedUtc = [DateTime]::UtcNow.ToString('o')
                license = 'Not established; supplier copyright applies'
                permissionStatus = 'Permission required before public website use'
                reviewStatus = 'Unreviewed supplier reference; filename and alt text do not establish product accuracy'
                width = $dimensions.Width
                height = $dimensions.Height
                sizeStatus = $(if ($dimensions.Width -lt 400 -or $dimensions.Height -lt 300) { 'Low resolution; not primary product image' } else { 'Review product framing and accuracy' })
                sha256 = (Get-FileHash -LiteralPath $destination -Algorithm SHA256).Hash
                changes = 'None; unchanged supplier reference download'
            }
            [IO.File]::WriteAllText($manifestPath, (ConvertTo-Json -InputObject $records -Depth 6), [Text.UTF8Encoding]::new($false))
            Write-Output "Downloaded reference: $file ($($dimensions.Width)x$($dimensions.Height))"
        }
    }
}

if (-not (Test-Path -LiteralPath $manifestPath)) { throw 'No supplier reference manifest created' }
$manifest = ConvertFrom-Json -InputObject ([IO.File]::ReadAllText($manifestPath))
foreach ($record in $manifest) {
    $path = Join-Path $destinationDirectory $record.file
    $dimensions = Test-DownloadedImage $path
    if ($dimensions.Width -ne $record.width -or $dimensions.Height -ne $record.height -or
        (Get-FileHash -LiteralPath $path -Algorithm SHA256).Hash -ne $record.sha256) {
        throw "Integrity mismatch: $($record.file)"
    }
    if (-not $record.sourcePage -or -not $record.downloadUrl -or -not $record.permissionStatus) {
        throw "Incomplete source/permission record: $($record.file)"
    }
}
Write-Output "PASS: $($manifest.Count) supplier reference files verified; none cleared for publication."
param([switch]$VerifyOnly)

$ErrorActionPreference = 'Stop'
Add-Type -AssemblyName System.Drawing
$manifestPath = Join-Path $PSScriptRoot 'sources.json'
$headers = @{ 'User-Agent' = 'ValtronCatalogueImageResearch/1.0 (image attribution review)' }
$sources = @(
    @{
        Title = 'File:SpectacleBlindFlange.JPG'
        File = 'spectacle-blind-installation.jpg'
        Product = 'Spectacle Blinds'
        Use = 'Installation example, not an isolated catalogue product photograph.'
    },
    @{
        Title = 'File:Hygiene Bundflansch DIN 11853-2 & Hgyiene Nutflansch DIN 11853-2.jpg'
        File = 'sanitary-flanges-din-11853-2.jpg'
        Product = 'Sanitary / Hygienic Flanges'
        Use = 'Representative DIN 11853-2 flange pair from another manufacturer; not proof of Valtron stock or manufacture.'
    },
    @{
        Title = 'File:Conflat Flange.jpg'
        File = 'vacuum-conflat-flange-set.jpg'
        Product = 'Vacuum Flanges'
        Use = 'ConFlat system with gasket and blank; do not present as KF or ISO-K hardware.'
    },
    @{
        Title = 'File:Flange and Stub Flange.jpg'
        File = 'flange-and-stub-assembly.jpg'
        Product = 'Loose Flanges - candidate only'
        Use = 'Source identifies a flange and stub assembly; technical review must confirm suitability for the proposed loose/backing-flange page.'
    },
    @{
        Title = 'File:ISO-LF-Flange.png'
        File = 'vacuum-iso-lf-flange.png'
        Product = 'Vacuum Flanges'
        Use = 'ISO-LF flange and gasket illustration; not a standard process-piping flange or evidence of a pressure class.'
    }
)

function Test-ImageFile {
    param([string]$Path)
    $image = [System.Drawing.Image]::FromFile($Path)
    try {
        if ($image.Width -lt 300 -or $image.Height -lt 300) {
            throw "Image is too small for review: $Path"
        }
        [pscustomobject]@{ Width = $image.Width; Height = $image.Height }
    } finally {
        $image.Dispose()
    }
}

if (-not $VerifyOnly) {
    $records = @()
    if (Test-Path -LiteralPath $manifestPath) {
        $savedRecords = ConvertFrom-Json -InputObject ([IO.File]::ReadAllText($manifestPath))
        $records = @($savedRecords)
    }
    foreach ($source in $sources) {
        $destination = Join-Path $PSScriptRoot $source.File
        if (Test-Path -LiteralPath $destination) {
            $saved = @($records | Where-Object { $_.file -eq $source.File })
            if ($saved.Count -ne 1 -or $saved[0].sourceTitle -ne $source.Title -or
                (Get-FileHash -LiteralPath $destination -Algorithm SHA256).Hash -ne $saved[0].sha256) {
                throw "Refusing to overwrite unverified existing image: $destination"
            }
            Write-Output "Preserved verified image: $($source.File)"
            continue
        }
        if (@($records | Where-Object { $_.file -eq $source.File }).Count -gt 0) {
            throw "Manifest references a missing image; review before downloading again: $destination"
        }
        $query = 'https://commons.wikimedia.org/w/api.php?action=query&prop=imageinfo&iiprop=url%7Cextmetadata%7Csize%7Cmime&format=json&titles=' + [uri]::EscapeDataString($source.Title)
        $response = Invoke-RestMethod -Uri $query -Headers $headers -TimeoutSec 60
        $page = @($response.query.pages.PSObject.Properties.Value)[0]
        $info = $page.imageinfo[0]
        $license = $info.extmetadata.LicenseShortName.value
        if ($license -notmatch '^(CC BY(?:-SA)? [1-4]\.0|CC0|Public domain)$') {
            throw "Unreviewed license for $($source.Title): $license"
        }
        $expectedMime = if ($source.File.EndsWith('.png')) { 'image/png' } else { 'image/jpeg' }
        if ($info.mime -ne $expectedMime -or ([uri]$info.url).Host -ne 'upload.wikimedia.org') {
            throw "Unexpected download type or host for $($source.Title)"
        }
        Invoke-WebRequest -UseBasicParsing -Uri $info.url -Headers $headers -OutFile $destination -TimeoutSec 120
        $dimensions = Test-ImageFile -Path $destination
        $records += [pscustomobject]@{
            file = $source.File
            intendedProduct = $source.Product
            usageNotes = $source.Use
            reviewStatus = 'Downloaded; visual and client technical approval required before publication'
            sourceTitle = $page.title
            sourcePage = $info.descriptionurl
            downloadUrl = $info.url
            downloadedUtc = [DateTime]::UtcNow.ToString('o')
            authorHtml = $info.extmetadata.Artist.value
            creditHtml = $info.extmetadata.Credit.value
            license = $license
            licenseUrl = $info.extmetadata.LicenseUrl.value
            attributionRequired = $info.extmetadata.AttributionRequired.value
            restrictions = $info.extmetadata.Restrictions.value
            descriptionHtml = $info.extmetadata.ImageDescription.value
            changes = 'None; original image downloaded unchanged'
            width = $dimensions.Width
            height = $dimensions.Height
            sha256 = (Get-FileHash -LiteralPath $destination -Algorithm SHA256).Hash
        }
        [IO.File]::WriteAllText($manifestPath, (ConvertTo-Json -InputObject $records -Depth 8), [Text.UTF8Encoding]::new($false))
        Write-Output "Downloaded: $($source.File) [$license]"
    }
}

$manifest = ConvertFrom-Json -InputObject ([IO.File]::ReadAllText($manifestPath))
if ($manifest.Count -ne $sources.Count) {
    throw "Expected $($sources.Count) source records, found $($manifest.Count)"
}
foreach ($record in $manifest) {
    $path = Join-Path $PSScriptRoot $record.file
    $dimensions = Test-ImageFile -Path $path
    if ($dimensions.Width -ne $record.width -or $dimensions.Height -ne $record.height) {
        throw "Image dimensions differ from manifest: $($record.file)"
    }
    if ((Get-FileHash -LiteralPath $path -Algorithm SHA256).Hash -ne $record.sha256) {
        throw "Image checksum differs from manifest: $($record.file)"
    }
    if (-not $record.authorHtml -or -not $record.licenseUrl -or -not $record.sourcePage) {
        throw "Incomplete attribution: $($record.file)"
    }
}
Write-Output "PASS: $($manifest.Count) images decode correctly and match their attribution manifests and SHA-256 checksums."
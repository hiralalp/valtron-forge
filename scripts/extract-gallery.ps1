$ErrorActionPreference = 'Stop'
Add-Type -AssemblyName System.Drawing
$root = Split-Path $PSScriptRoot -Parent
$sourcePath = Join-Path $root '_not-deployed\catalogue-page-3-native-000.jpg'
$destination = Join-Path $root 'img\gallery'
New-Item -ItemType Directory -Force -Path $destination | Out-Null
& pdfimages -f 3 -l 3 -j (Join-Path $root 'Valtron Forge_0222.pdf') (Join-Path $root '_not-deployed\catalogue-page-3-native')
if ($LASTEXITCODE -ne 0) { throw 'PDF image extraction failed.' }
$regions = @(
    @('team', 1, 1, 704, 400),
    @('unit-one', 35, 403, 579, 385),
    @('unit-two', 628, 403, 577, 385),
    @('heating', 35, 802, 642, 347),
    @('press', 684, 802, 521, 347),
    @('forming', 35, 1160, 386, 285),
    @('inspection', 430, 1160, 381, 285),
    @('machining', 820, 1160, 385, 285),
    @('flanges', 37, 1456, 172, 227),
    @('workshop', 219, 1456, 305, 227),
    @('forging', 533, 1456, 331, 227),
    @('shop-floor', 876, 1456, 329, 227)
)
$source = [System.Drawing.Bitmap]::new($sourcePath)
try {
    if ($source.Width -ne 1240 -or $source.Height -ne 1752) { throw 'Unexpected source dimensions; review crop coordinates.' }
    foreach ($region in $regions) {
        $rectangle = [System.Drawing.Rectangle]::new($region[1], $region[2], $region[3], $region[4])
        $crop = $source.Clone($rectangle, $source.PixelFormat)
        try { $crop.Save((Join-Path $destination ($region[0] + '.png')), [System.Drawing.Imaging.ImageFormat]::Png) }
        finally { $crop.Dispose() }
    }
} finally { $source.Dispose() }
Write-Output "Extracted $($regions.Count) native-resolution gallery crops without JPEG recompression."
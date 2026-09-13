param([string]$ManifestPath = (Join-Path $PSScriptRoot 'supplier-references/sources.json'))

$ErrorActionPreference = 'Stop'
Add-Type -AssemblyName System.Drawing
$records = ConvertFrom-Json -InputObject ([IO.File]::ReadAllText($ManifestPath))
$records = @($records | Sort-Object product,file)
$directory = Split-Path $ManifestPath
$font = [Drawing.Font]::new('Consolas', 10)
try {
    for ($offset = 0; $offset -lt $records.Count; $offset += 16) {
        $sheet = [Drawing.Bitmap]::new(1200, 1040)
        $graphics = [Drawing.Graphics]::FromImage($sheet)
        try {
            $graphics.Clear([Drawing.Color]::White)
            for ($index = $offset; $index -lt [Math]::Min($offset + 16, $records.Count); $index++) {
                $record = $records[$index]
                $column = ($index - $offset) % 4
                $row = [Math]::Floor(($index - $offset) / 4)
                $imagePath = Join-Path $directory $record.file
                $previewPath = $null
                if ($imagePath -match '\.webp$') {
                    $previewPath = Join-Path ([IO.Path]::GetTempPath()) ([Guid]::NewGuid().ToString() + '.png')
                    & node (Join-Path $PSScriptRoot 'image-info.cjs') $imagePath $previewPath | Out-Null
                    if ($LASTEXITCODE -ne 0) { throw "WebP preview failed: $imagePath" }
                    $imagePath = $previewPath
                }
                $image = [Drawing.Image]::FromFile($imagePath)
                try {
                    $scale = [Math]::Min(280 / $image.Width, 200 / $image.Height)
                    $width = [int]($image.Width * $scale)
                    $height = [int]($image.Height * $scale)
                    $graphics.DrawImage($image, [int]($column * 300 + (300 - $width) / 2), [int]($row * 260), $width, $height)
                    $label = $record.file + "`n" + $record.width + 'x' + $record.height
                    $rectangle = [Drawing.RectangleF]::new($column * 300 + 5, $row * 260 + 203, 290, 55)
                    $graphics.DrawString($label, $font, [Drawing.Brushes]::Black, $rectangle)
                } finally {
                    $image.Dispose()
                    if ($previewPath) { Remove-Item -LiteralPath $previewPath }
                }
            }
            $path = Join-Path $directory ('contact-sheet-' + (1 + [int]($offset / 16)) + '.jpg')
            $sheet.Save($path, [Drawing.Imaging.ImageFormat]::Jpeg)
            Write-Output $path
        } finally {
            $graphics.Dispose()
            $sheet.Dispose()
        }
    }
} finally {
    $font.Dispose()
}
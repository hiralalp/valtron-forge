$ErrorActionPreference = 'Stop'
$root = Split-Path $PSScriptRoot -Parent
Push-Location $root
try {
    & npm run build
    if ($LASTEXITCODE -ne 0) { throw 'Build failed; archive was not created.' }
    & npm test
    if ($LASTEXITCODE -ne 0) { throw 'Site tests failed; archive was not created.' }

    Add-Type -AssemblyName System.IO.Compression
    Add-Type -AssemblyName System.IO.Compression.FileSystem
    $output = Join-Path $root '_not-deployed\deployment'
    New-Item -ItemType Directory -Force -Path $output | Out-Null
    $baseName = 'valtron-forge-hostinger-' + (Get-Date -Format 'yyyyMMdd-HHmmss')
    $archivePath = Join-Path $output ($baseName + '.zip')
    $manifestPath = Join-Path $output ($baseName + '.manifest.json')
    $files = @(
        Get-ChildItem -LiteralPath $root -File -Filter '*.html'
        Get-Item -LiteralPath 'sitemap.xml', 'Valtron Forge_0222.pdf', 'video\banner-forging.mp4', 'video\banner-forging.webm', 'video\banner-new.mp4', 'video\banner-new.webm', 'video\banner-video-3.mp4', 'video\banner-video-3.webm'
        Get-ChildItem -LiteralPath 'css' -Recurse -File | Where-Object { $_.Extension -eq '.css' }
        Get-ChildItem -LiteralPath 'js' -Recurse -File | Where-Object { $_.Extension -eq '.js' }
        Get-ChildItem -LiteralPath 'img' -Recurse -File | Where-Object { $_.Extension.ToLowerInvariant() -in '.jpg', '.jpeg', '.png', '.webp', '.jfif', '.gif', '.svg', '.ico' }
        Get-ChildItem -LiteralPath 'lib' -Recurse -File | Where-Object { $_.Extension.ToLowerInvariant() -in '.js', '.css', '.eot', '.svg', '.ttf', '.woff', '.woff2', '.png', '.gif', '.pdf' -or $_.Name -eq 'LICENSE' }
        Get-ChildItem -LiteralPath 'mail' -File | Where-Object { $_.Extension -in '.js', '.php' }
    ) | Sort-Object FullName -Unique
    $manifest = @($files | ForEach-Object {
        [pscustomobject]@{
            path = $_.FullName.Substring($root.Length + 1).Replace('\', '/')
            bytes = $_.Length
            sha256 = (Get-FileHash -LiteralPath $_.FullName -Algorithm SHA256).Hash.ToLowerInvariant()
        }
    })
    [IO.File]::WriteAllText($manifestPath, (ConvertTo-Json -InputObject $manifest -Depth 3), [Text.UTF8Encoding]::new($false))
    $validateLinks = @'
import { readFileSync } from 'node:fs';
import { load } from 'cheerio';
const manifest = JSON.parse(readFileSync(process.argv[1], 'utf8'));
const paths = new Set(manifest.map(file => file.path));
const failures = [];
const check = (source, value) => {
    if (!value || value.startsWith('#')) return;
    const resolved = new URL(value, `https://deployment.invalid/${source}`);
    if (resolved.origin !== 'https://deployment.invalid') return;
    const target = decodeURIComponent(resolved.pathname.slice(1));
    if (!paths.has(target)) failures.push(`${source}: missing or case-mismatched ${target}`);
};
for (const path of paths) {
    if (!path.endsWith('.html')) continue;
    const document = load(readFileSync(path, 'utf8'));
    document('a[href], link[href], img[src], script[src], source[src], video[src], video[poster], form[action]').each((index, node) => {
        const element = document(node);
        check(path, element.attr('href') ?? element.attr('src') ?? element.attr('poster') ?? element.attr('action'));
        if (element.attr('poster')) check(path, element.attr('poster'));
    });
}
if (failures.length) throw new Error(failures.join('\n'));
console.log('PASS: packaged HTML dependencies and filename casing');
'@
    & node --input-type=module -e $validateLinks $manifestPath
    if ($LASTEXITCODE -ne 0) { throw 'Deployment dependency check failed; archive was not created.' }

    $archive = [IO.Compression.ZipFile]::Open($archivePath, [IO.Compression.ZipArchiveMode]::Create)
    try {
        foreach ($item in $manifest) {
            [IO.Compression.ZipFileExtensions]::CreateEntryFromFile($archive, (Join-Path $root $item.path), $item.path, [IO.Compression.CompressionLevel]::Optimal) | Out-Null
        }
    } finally { $archive.Dispose() }

    $archive = [IO.Compression.ZipFile]::OpenRead($archivePath)
    try {
        if ($archive.Entries.Count -ne $manifest.Count) { throw 'Archive file count mismatch.' }
        foreach ($item in $manifest) {
            $entry = $archive.GetEntry($item.path)
            if (!$entry -or $entry.Length -ne $item.bytes) { throw "Archive entry mismatch: $($item.path)" }
            $stream = $entry.Open()
            $hasher = [Security.Cryptography.SHA256]::Create()
            try { $actual = [BitConverter]::ToString($hasher.ComputeHash($stream)).Replace('-', '').ToLowerInvariant() }
            finally { $hasher.Dispose(); $stream.Dispose() }
            if ($actual -ne $item.sha256) { throw "Archive checksum mismatch: $($item.path)" }
        }
        foreach ($required in 'index.html', 'gallery.html', 'sitemap.xml', 'Valtron Forge_0222.pdf', 'video/banner-forging.mp4', 'video/banner-forging.webm', 'video/banner-new.mp4', 'video/banner-new.webm', 'video/banner-video-3.mp4', 'video/banner-video-3.webm') {
            if (!$archive.GetEntry($required)) { throw "Required public file missing: $required" }
        }
    } finally { $archive.Dispose() }

    $zipHash = (Get-FileHash -LiteralPath $archivePath -Algorithm SHA256).Hash.ToLowerInvariant()
    [IO.File]::WriteAllText((Join-Path $output ($baseName + '.sha256')), "$zipHash  $baseName.zip`n", [Text.UTF8Encoding]::new($false))
    Write-Output "ZIP: $archivePath"
    Write-Output "Files: $($manifest.Count); HTML pages: $(@($manifest | Where-Object { $_.path -match '^[^/]+\.html$' }).Count)"
    Write-Output "Size: $([math]::Round((Get-Item -LiteralPath $archivePath).Length / 1MB, 2)) MiB"
    Write-Output "SHA256: $zipHash"
    Write-Output 'PASS: all ZIP entries match the source SHA256 hashes; index.html is at archive root.'
} finally { Pop-Location }
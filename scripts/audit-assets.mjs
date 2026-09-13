import { readdir, readFile, stat, mkdir, writeFile } from 'node:fs/promises';
import { extname, basename } from 'node:path';
import { createHash } from 'node:crypto';

const walk = async directory => {
    const entries = await readdir(directory, { withFileTypes: true });
    const groups = await Promise.all(entries.map(entry => {
        const path = `${directory}/${entry.name}`;
        return entry.isDirectory() ? walk(path) : [path];
    }));
    return groups.flat();
};
const rootFiles = (await readdir('.', { withFileTypes: true })).filter(entry => entry.isFile()).map(entry => entry.name);
const publicFiles = (await Promise.all(['img', 'video', 'css', 'js', 'lib', 'mail'].map(walk))).flat();
const sourceFiles = [...rootFiles, ...publicFiles, ...await walk('scripts')].filter(path =>
    /\.(?:html|css|js|mjs|json|php|md|txt|ps1|svg)$/i.test(path) && path !== 'scripts/audit-assets.mjs'
);
const sources = await Promise.all(sourceFiles.map(async path => {
    const text = (await readFile(path, 'utf8')).toLowerCase();
    return { path, text: text.replace(/(?:%[0-9a-f]{2})+/g, encoded => {
        try { return decodeURIComponent(encoded); } catch { return encoded; }
    }) };
}));
const candidates = publicFiles.filter(path => /^(?:img|video)\//.test(path) && /\.(?:jpe?g|png|webp|jfif|gif|svg|ico|mp4|webm)$/i.test(path));
const unused = [];
const retained = [];
for (const path of candidates) {
    const name = basename(path).toLowerCase();
    const stem = basename(path, extname(path)).toLowerCase();
    const references = sources.filter(source => source.path !== path && (source.text.includes(name) || source.text.includes(stem))).map(source => source.path);
    const asset = { path, bytes: (await stat(path)).size, sha256: createHash('sha256').update(await readFile(path)).digest('hex'), references };
    (references.length ? retained : unused).push(asset);
}
await mkdir('_not-deployed/asset-audit', { recursive: true });
const report = { unused, retained, unusedBytes: unused.reduce((total, asset) => total + asset.bytes, 0) };
await writeFile('_not-deployed/asset-audit/report.json', JSON.stringify(report, null, 2) + '\n');
console.log(JSON.stringify({ candidates: candidates.length, retained: retained.length, unused: unused.length, unusedMiB: +(report.unusedBytes / 1024 / 1024).toFixed(2), files: unused.map(({ path, bytes }) => ({ path, bytes })) }, null, 2));
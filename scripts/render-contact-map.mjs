import { readFile } from 'node:fs/promises';
import { chromium } from '@playwright/test';

const land = JSON.parse(await readFile('_not-deployed/contact-map-land.geojson', 'utf8'));
const project = ([longitude, latitude]) => `${((longitude + 180) * 4).toFixed(2)},${((90 - latitude) * 4).toFixed(2)}`;
const paths = land.features.flatMap(feature => {
    const polygons = feature.geometry.type === 'Polygon' ? [feature.geometry.coordinates] : feature.geometry.coordinates;
    return polygons.map(polygon => `<path d="${polygon.map(ring => `M${ring.map(project).join('L')}Z`).join('')}"/>`);
});
const browser = await chromium.launch({ headless: true });
try {
    const page = await browser.newPage({ viewport: { width: 1440, height: 720 }, deviceScaleFactor: 1 });
    await page.setContent(`<html><body style="margin:0"><svg xmlns="http://www.w3.org/2000/svg" width="1440" height="720" viewBox="0 0 1440 720"><rect width="1440" height="720" fill="#fff"/><g fill="#c99700" stroke="#b48600" stroke-width="0.7" fill-rule="evenodd">${paths.join('')}</g></svg></body></html>`);
    await page.screenshot({ path: 'img/contact-world-map.png' });
} finally {
    await browser.close();
}
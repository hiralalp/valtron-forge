import test from 'node:test';
import assert from 'node:assert/strict';
import { navigation, footer, quoteLink, escapeHtml, referenceDetailPage, homepage, cataloguePage, detailPage, productNavigation, productInformation } from './templates.mjs';
import { references, referenceGroups } from './references.mjs';
import { products, fittingGroups, materials, standards, facings } from './catalogue.mjs';
import { existsSync } from 'node:fs';
import { readFile, readdir } from 'node:fs/promises';
import { load } from 'cheerio';
import { inventory } from './inventory.mjs';
import { execFileSync } from 'node:child_process';
import { serviceIndustries } from './services.mjs';
const hiddenMaterialSlugs = new Set(['titanium-flanges', 'copper-flanges', 'copper-nickel-flanges', 'aluminium-flanges']);

test('services provides nine industry descriptions distinct from about', async () => {
    const document = load(await readFile('service.html', 'utf8'));
    const about = load(await readFile('about.html', 'utf8'));
    assert.equal(document('h1').text(), 'Industries We Serve');
    assert.equal(document('.vf-company').length, 0);
    assert.equal(about('.vf-company').length, 1);
    assert.equal(about('.vf-service-grid').length, 0);
    assert.equal(document('.vf-service-industry').length, 9);
    assert.deepEqual(serviceIndustries.map(industry => industry.id), ['oil-gas', 'petrochemical', 'chemical', 'sugar', 'marine', 'aerospace', 'lng', 'energy-power', 'nuclear']);
    for (const industry of serviceIndustries) {
        const article = document(`#industry-${industry.id}`);
        assert.equal(article.find('h2').text(), industry.name);
        assert.ok(article.children('p').text().length > 200, `${industry.id}: substantive description`);
        assert.equal(article.find('img').attr('src'), `img/${industry.image}`);
        assert.ok(article.find('img').attr('alt').length > 15);
        assert.equal(article.find('dl dt').length, 2);
        assert.ok(article.find('dd').toArray().every(node => document(node).text().length > 50));
        assert.equal(article.find('.vf-service-guide').attr('href'), industry.guide);
        assert.ok(existsSync(industry.guide));
        assert.equal(document(`.vf-service-directory a[href="#industry-${industry.id}"]`).length, 1);
    }
    assert.match(document('#industry-nuclear').text(), /project-specific qualification/);
    assert.match(document('#industry-aerospace').text(), /customer qualification/);
    assert.equal(document('.vf-service-support-grid > div').length, 3);
});

test('about contains a complete company profile with qualified facility and quality content', async () => {
    const document = load(await readFile('about.html', 'utf8'));
    assert.equal(document('h1').length, 1);
    assert.equal(document('h1').text(), 'Valtron Forge & Fittings');
    assert.equal(document('.vf-company').length, 1);
    assert.equal(document('main video').length, 0);
    assert.equal(document('.vf-company > img').attr('src'), 'img/flange%20banner01.jpg');
    assert.match(document('.vf-company').text(), /founded by Jitendra Kumar as a sister concern of Rishabh Forge Fittings & Mfg\. Co\./);
    assert.match(document('.vf-company').text(), /Rishabh Forge Fittings & Mfg\. Co\. brings a legacy spanning over 35 years/);
    for (const topic of ['Our vision', 'Our expertise', 'Innovation and excellence', 'Speed and efficiency', 'Dynamic growth', 'Customer-centric approach']) assert.ok(document('#about-approach').text().includes(topic), topic);
    for (const id of ['about-range', 'about-approach', 'about-facilities', 'about-quality', 'about-enquiry', 'about-contact']) {
        const section = document(`#${id}`);
        assert.equal(section.length, 1, id);
        assert.ok(section.find('h2').length, `${id}: heading`);
        assert.ok(section.text().length > 250, `${id}: substantive content`);
    }
    assert.equal(document('.vf-about-columns > div').length, 3);
    assert.equal(document('.vf-about-photos img').length, 2);
    assert.equal(document('.vf-about-steps li').length, 3);
    assert.equal(document('.vf-about-quality-list dt').length, 4);
    assert.match(document('#about-quality').text(), /not assumed to be included unless confirmed/);
    assert.match(document('#about-facilities').text(), /company catalogue/);
    for (const path of ['gallery.html', 'service.html', 'contact.html', 'flanges.html', 'flange-materials.html', 'flange-standards.html']) {
        assert.ok(document(`main a[href="${path}"]`).length, `${path}: useful next step`);
    }
    assert.equal(document('.vf-about-contact a[download]').length, 1);
    assert.ok(!/ISO\s*9001|years of experience|customers worldwide/i.test(document('main').text()));
});

test('contact page places a world map and Mumbai head office below the enquiry form', async () => {
    const document = load(await readFile('contact.html', 'utf8'));
    assert.equal(document('.vf-contact-layout + #head-office').length, 1);
    assert.equal(document('#vf-quote-form').length, 1);
    assert.equal(document('#head-office img').attr('src'), 'img/contact-world-map.png');
    assert.match(document('#head-office address').text(), /Badrika Ashram Building.*Mumbai.*400004/);
    assert.equal(document('.vf-office-pin').length, 1);
    assert.match(document('.vf-office-pin').attr('aria-label'), /head office, Mumbai, India/);
    for (const link of document('#head-office a').toArray()) {
        const destination = new URL(document(link).attr('href'));
        assert.equal(destination.hostname, 'www.google.com');
        assert.match(destination.searchParams.get('query'), /Badrika Ashram Building Khetwadi Mumbai/);
        assert.equal(document(link).attr('rel'), 'noopener noreferrer');
    }
});

test('shared discovery contains only the three retained product categories', () => {
    const markup = navigation('flanges.html') + footer();
    for (const path of ['flanges.html', 'buttweld-fittings.html', 'forged.html']) assert.ok(markup.includes(`href="${path}"`));
    for (const path of ['wire.html', 'fastners.html', 'threaded-fittings.html', 'pipes&tubes.html', 'sheets&plates.html']) assert.ok(!markup.includes(path));
    assert.match(markup, /href="flanges.html" aria-current="page"/);
});

test('quote links preserve the product and category without HTML injection', () => {
    const url = new URL(quoteLink('Caps & Plugs', 'Forged Fittings'), 'https://www.valtronforge.com');
    assert.equal(url.searchParams.get('product'), 'Caps & Plugs');
    assert.equal(url.searchParams.get('category'), 'Forged Fittings');
    assert.equal(escapeHtml('<script>"'), '&lt;script&gt;&quot;');
    const specification = new URL(quoteLink('Flanges', 'Flanges', { material: 'Copper & Nickel', standard: 'ASME B16.5', facing: 'RF', category: 'Wire' }), 'https://www.valtronforge.com');
    assert.equal(specification.searchParams.get('category'), 'Flanges');
    assert.equal(specification.searchParams.get('material'), 'Copper & Nickel');
    assert.equal(specification.searchParams.get('standard'), 'ASME B16.5');
    assert.equal(specification.searchParams.get('facing'), 'RF');
});

test('catalogue records resolve existing images and related product paths', () => {
    assert.equal(new Set(products.map(product => product.slug)).size, 23);
    for (const product of products) {
        assert.ok(existsSync(product.image), product.image);
        assert.ok(!product.image.includes('_not-deployed'));
        for (const slug of product.related) assert.ok(products.some(candidate => candidate.slug === slug));
    }
    assert.equal(fittingGroups.reduce((total, group) => total + group.pages.length + 1, 0), 19);
    assert.equal(materials.length, 16);
    assert.equal(standards.length, 18);
    assert.equal(facings.length, 6);
});

test('all 81 planned flange entries have explicit implementation status', () => {
    assert.equal(inventory.length, 81);
    assert.equal(new Set(inventory.map(record => record.path)).size, 81);
    assert.equal(inventory.filter(record => record.status === 'implemented').length, products.length + 4 + references.length);
    assert.equal(inventory.filter(record => record.status === 'deferred').length, 10);
    for (const record of inventory) assert.ok(record.reason && record.technicalApproval);
});

test('public HTML preserves local links and excludes all review-only images', async () => {
    const pages = (await readdir('.')).filter(path => path.endsWith('.html'));
    assert.equal(pages.length, 53 + products.length + references.length);
    for (const path of pages) {
        const document = load(await readFile(path, 'utf8'));
        assert.equal(document('.vf-header').length, 1, `${path}: one header`);
        assert.equal(document('.vf-header a[href="gallery.html"]').length, 1, `${path}: gallery navigation`);
        assert.equal(document('.vf-footer').length, 1, `${path}: one footer`);
        const whatsapp = document('.vf-whatsapp');
        assert.equal(whatsapp.length, 1, `${path}: one floating WhatsApp button`);
        assert.equal(whatsapp.attr('href'), 'https://wa.me/919619770076');
        assert.equal(whatsapp.attr('target'), '_blank');
        assert.match(whatsapp.attr('rel'), /noopener/);
        assert.match(whatsapp.attr('aria-label'), /WhatsApp/);
        assert.equal(whatsapp.find('.fab.fa-whatsapp[aria-hidden="true"]').length, 1);
        assert.equal(document('.whatsapp-chat').length, 0, `${path}: no duplicate legacy WhatsApp button`);
        for (const node of document('a[href], img[src], link[href], script[src], source[src], video[src]').toArray()) {
            const value = document(node).attr('href') ?? document(node).attr('src');
            if (!value || /^(https?:|mailto:|tel:|#|data:|javascript:)/i.test(value)) continue;
            const target = decodeURIComponent(value.split(/[?#]/)[0].replace(/^\.\//, ''));
            if (!target) continue;
            assert.ok(!target.includes('_not-deployed'), `${path}: review asset ${target}`);
            assert.ok(existsSync(target), `${path}: missing ${target}`);
        }
        for (const node of document('a[href]').toArray()) {
            const href = document(node).attr('href');
            assert.ok(!/^(?:\.\/)?(?:pipes&tubes|round-bars|sheets&plates|beam-channels|fastners|wire|welding-wire|tube-fittings|threaded-fittings|threaded-elbow)\.html/.test(href), `${path}: removed discovery ${href}`);
        }
    }
});

test('rebuilt product pages have unique metadata, headings and enquiry paths', async () => {
    const titles = new Set();
    const descriptions = new Set();
    for (const product of products) {
        const document = load(await readFile(`${product.slug}.html`, 'utf8'));
        assert.equal(document('main').length, 1);
        assert.equal(document('h1').length, 1);
        assert.equal(document('h1').text(), product.name);
        assert.equal(document('link[rel=canonical]').attr('href'), `https://www.valtronforge.com/${product.slug}.html`);
        titles.add(document('title').text());
        descriptions.add(document('meta[name=description]').attr('content'));
        assert.ok(document(`a[href="${quoteLink(product.name)}"]`).length);
    }
    assert.equal(titles.size, products.length);
    assert.equal(descriptions.size, products.length);
});

test('all retained fittings have reachable details and a quote action beside the product', async () => {
    for (const group of fittingGroups) {
        const category = load(await readFile(`${group.slug}.html`, 'utf8'));
        assert.ok(category(`a[href="${group.slug === 'forged' ? 'forged' : 'buttweld'}-composition.html"]`).length);
        for (const [slug, name] of group.pages) {
            assert.ok(category(`a[href="${slug}.html"]`).length, slug);
            const detail = load(await readFile(`${slug}.html`, 'utf8'));
            assert.equal(detail('.page-header').length, 1, `${slug}: one category banner`);
            assert.equal(detail('.page-header').attr('data-product-category'), group.slug, `${slug}: matching category photo`);
            assert.equal(detail('.vf-legacy-quote').length, 1, slug);
            assert.equal(detail('.detail-section .vf-legacy-quote').attr('href'), quoteLink(name, group.name), slug);
        }
    }
});

test('supplied fitting images match the nine product pages and linked thumbnails', async () => {
    const images = new Map([
        ...['buttweld-short-45', 'buttweld-long-45', 'buttweld-180', 'buttweld-equal-tee', 'buttweld-concentric-reducer', 'buttweld-eccentric-reducer', 'buttweld-stub-end', 'buttweld-cap'].map(slug => [`${slug}.html`, `img/buttweld/${slug}.jpg`]),
        ['forged-caps-plugs.html', 'img/buttweld/forge-caps-plugs.jpg']
    ]);
    for (const [path, image] of images) {
        const document = load(await readFile(path, 'utf8'));
        assert.equal(document('.flange-hero-img img').length, 1, path);
        assert.equal(document('.flange-hero-img img').attr('src'), image, path);
        assert.ok(document('.flange-hero-img img').attr('alt'), `${path}: image description`);
        assert.ok(existsSync(image), image);
    }
    for (const path of (await readdir('.')).filter(path => path.endsWith('.html'))) {
        const document = load(await readFile(path, 'utf8'));
        for (const [target, image] of images) {
            for (const thumbnail of document(`a[href="${target}"] img`).toArray()) assert.equal(document(thumbnail).attr('src'), image, `${path}: ${target} thumbnail`);
        }
    }
});

test('sitemap contains only rebuilt canonical pages with complete metadata', async () => {
    const sitemap = load(await readFile('sitemap.xml', 'utf8'), { xmlMode: true });
    const locations = sitemap('loc').toArray().map(node => sitemap(node).text());
    assert.equal(locations.length, 11 + products.length + references.length);
    assert.equal(new Set(locations).size, locations.length);
    const titles = new Set();
    for (const location of locations) {
        const path = new URL(location).pathname.slice(1);
        const document = load(await readFile(path, 'utf8'));
        assert.equal(document('link[rel=canonical]').attr('href'), location);
        assert.equal(document('h1').length, 1, path);
        assert.equal(document('main').length, 1, path);
        assert.ok(document('meta[name=description]').attr('content'), path);
        assert.equal(JSON.parse(document('script[type="application/ld+json"]').text())['@type'], 'WebPage');
        titles.add(document('title').text());
    }
    assert.equal(titles.size, locations.length);
    for (const record of inventory.filter(record => record.status !== 'implemented')) assert.ok(!locations.some(location => location.endsWith(`/${record.path}`)));
});

test('repeating the build preserves all page and inventory contents', async () => {
    const paths = [...(await readdir('.')).filter(path => path.endsWith('.html')), 'catalogue-inventory.json', 'sitemap.xml'];
    const before = await Promise.all(paths.map(path => readFile(path, 'utf8')));
    execFileSync(process.execPath, ['scripts/build.mjs'], { stdio: 'pipe' });
    for (const [index, path] of paths.entries()) assert.equal(await readFile(path, 'utf8'), before[index], `${path}: build must be idempotent`);
});

test('reference details use original sections, a qualified image and product-specific enquiry', () => {
    for (const reference of references) {
        const document = load(referenceDetailPage(reference));
        assert.equal(document('h1').text(), reference.title);
        assert.equal(document('.vf-reference-detail > div > section').length, reference.sections.length);
        assert.ok(reference.sections.length >= 3);
        assert.equal(document('figcaption').text(), reference.caption);
        assert.equal(document('.vf-soft-band .vf-spec-table tbody tr').length, reference.checks.length);
        assert.ok(document(`a[href="${quoteLink(reference.title, 'Flanges', reference.enquiry)}"]`).length);
        assert.ok(existsSync(reference.image), reference.image);
    }
});

test('all 43 reference URLs are retained and only active references appear in catalogue discovery', async () => {
    const expected = { material: 16, standard: 18, facing: 6, guide: 3 };
    assert.equal(references.length, 43);
    assert.equal(new Set(references.map(reference => reference.slug)).size, 43);
    for (const [kind, count] of Object.entries(expected)) {
        const group = references.filter(reference => reference.kind === kind);
        assert.equal(group.length, count, kind);
        const parent = load(await readFile(referenceGroups[kind].path, 'utf8'));
        for (const reference of group) {
            assert.equal(parent(`a[href="${reference.slug}.html"]`).length > 0, !hiddenMaterialSlugs.has(reference.slug), `${reference.slug}: parent discovery`);
            const detail = load(await readFile(`${reference.slug}.html`, 'utf8'));
            assert.ok(detail(`.vf-breadcrumb a[href="${referenceGroups[kind].path}"]`).length, `${reference.slug}: breadcrumb`);
            for (const related of reference.related) assert.equal(detail(`a[href="${related}.html"]`).length > 0, !hiddenMaterialSlugs.has(related), `${reference.slug}: related ${related}`);
        }
    }
    const pages = new Map(await Promise.all((await readdir('.')).filter(path => path.endsWith('.html')).map(async path => [path, load(await readFile(path, 'utf8'))])));
    const pending = ['index.html'];
    const visited = new Set();
    while (pending.length) {
        const path = pending.pop();
        if (visited.has(path)) continue;
        visited.add(path);
        const document = pages.get(path);
        for (const anchor of document('a[href]').toArray()) {
            const target = document(anchor).attr('href').split(/[?#]/)[0];
            if (pages.has(target) && !visited.has(target)) pending.push(target);
        }
    }
    for (const reference of references.filter(reference => !hiddenMaterialSlugs.has(reference.slug))) assert.ok(visited.has(`${reference.slug}.html`), `${reference.slug}: orphan page`);
    for (const product of products) assert.ok(visited.has(`${product.slug}.html`), `${product.slug}: orphan product`);
});

test('all 14 reference-derived products have dedicated catalogue content', () => {
    const slugs = ['plate-flanges', 'reducing-flanges', 'weldo-flanges', 'nipo-flanges', 'forged-flanges', 'loose-flanges', 'square-flanges', 'expander-flanges', 'high-hub-blind-flanges', 'spectacle-blind-flanges', 'spade-flanges', 'ring-spacers', 'lip-type-flanges', 'puddle-flanges'];
    const catalogue = load(cataloguePage());
    for (const slug of slugs) {
        const product = products.find(candidate => candidate.slug === slug);
        assert.ok(product, `${slug}: missing product record`);
        assert.equal(catalogue(`[data-product] a[href="${slug}.html"]`).length, 1);
        const document = load(detailPage(product));
        assert.equal(document('h1').text(), product.name);
        assert.ok(product.detail.length > 180);
        assert.ok(product.checks.length >= 4);
        assert.ok(product.sections.length >= 2);
        assert.equal(document('.vf-product-notes section').length, product.sections.length);
        assert.equal(document('figcaption').first().text(), product.caption);
        assert.ok(document(`a[href="${quoteLink(product.name)}"]`).length);
        assert.equal(inventory.filter(record => record.path === `${slug}.html`).length, 1);
        assert.equal(inventory.find(record => record.path === `${slug}.html`).status, 'implemented');
    }
    assert.match(products.find(product => product.slug === 'lip-type-flanges').caption, /not.*product|not.*geometry/i);
});

test('homepage restores substantial flange-focused company and project sections', () => {
    const document = load(`<main>${homepage()}</main>`);
    assert.equal(document('main > section').length, 19);
    assert.equal(document('#home-markets + #home-testimonials').length, 1);
    assert.deepEqual(document('.vf-market-grid span').toArray().map(node => document(node).text()), ['United States', 'United Arab Emirates', 'Saudi Arabia', 'Germany', 'United Kingdom', 'Italy', 'Netherlands', 'Singapore', 'Qatar', 'Oman', 'Australia', 'Canada']);
    assert.equal(document('.vf-market-grid img[alt=""]').length, 12);
    assert.match(document('#home-markets').text(), /confirmed for each enquiry/);
    assert.equal(document('#home-testimonials + #home-inspection + #home-faq').length, 1);
    assert.deepEqual(document('.vf-testimonial figcaption strong').toArray().map(node => document(node).text()), ['Rajesh Kulkarni', 'Ahmed Al-Sayed', 'Suresh Menon']);
    assert.equal(document('.vf-testimonial blockquote').length, 3);
    assert.deepEqual(document('.vf-inspection-logos img').toArray().map(node => document(node).attr('alt')), ['SGS', 'Velosi', 'NPCIL', 'Bureau Veritas', 'DNV', 'Tata Projects Limited']);
    assert.match(document('#home-inspection').text(), /confirmed for each order/);
    assert.equal(document('.vf-hero + #home-forging').length, 1);
    const reel = document('#home-forging .vf-forging-reel');
    assert.equal(reel.length, 1);
    assert.equal(reel.is('[controls][muted][playsinline]'), true);
    assert.deepEqual(reel.find('source').toArray().map(node => document(node).attr('src')), ['video/banner-video-3.mp4', 'video/banner-video-3.webm']);
    assert.equal(reel.attr('poster'), 'img/banner-video-3-poster.jpg');
    assert.equal(reel.attr('width'), '1920');
    assert.equal(reel.attr('height'), '1080');
    assert.equal(document('h1').length, 1);
    assert.equal(document('[data-product]').length, 9);
    assert.equal(document('.vf-hero video[muted][loop][playsinline]').length, 2);
    assert.equal(document('.vf-hero-slide').length, 4);
    assert.equal(document('.vf-hero-slide[hidden]').length, 3);
    assert.equal(document('.vf-hero').attr('data-slide-interval'), '8000');
    assert.equal(document('#hero-slide-3 img').attr('src'), 'img/flange%20banner01.jpg');
    assert.equal(document('#hero-slide-4 img').attr('src'), 'img/flange%20banner02.jpg');
    assert.equal(document('[data-hero-slide]').length, 4);
    assert.deepEqual(document('.vf-hero-title').toArray().map(node => document(node).text()), ['Valtron Forge & Fittings', 'Exporter & Supplier of Industrial Piping Solutions', 'Global Exporter of Flanges', 'Exporter & Supplier of Industrial Piping Solutions']);
    assert.equal(document('.vf-hero-message.is-active').length, 1);
    assert.equal(document('.vf-hero-message.is-active > p').last().text(), 'We are manufacturers and exporters of flanges & pipe.');
    assert.equal(document('.vf-hero-message[aria-hidden="true"][inert]').length, 3);
    assert.doesNotMatch(document('.vf-hero').text(), /fasteners/i);
    assert.equal(document('.vf-hero video').attr('poster'), 'img/banner-forging-poster.jpg');
    assert.deepEqual(document('#hero-video source').toArray().map(node => document(node).attr('src')), ['video/banner-forging.webm', 'video/banner-forging.mp4']);
    assert.deepEqual(document('#hero-video-new source').toArray().map(node => document(node).attr('src')), ['video/banner-new.webm', 'video/banner-new.mp4']);
    assert.equal(document('.vf-hero-playback').attr('aria-controls'), 'hero-video');
    for (const id of ['home-range', 'home-about', 'home-materials', 'home-industries', 'home-standards', 'home-facings', 'home-quality', 'home-drawings', 'home-process', 'home-faq']) {
        assert.equal(document(`#${id}`).length, 1, id);
        assert.ok(document(`#${id}`).text().trim().length > 180, `${id}: substantive content`);
    }
    assert.equal(document('.vf-home-material-grid a').length, 12);
    assert.equal(document('.vf-home-material-grid > div').length, 3);
    assert.doesNotMatch(document('#home-materials').text(), /Non-ferrous materials/);
    for (const slug of hiddenMaterialSlugs) assert.equal(document(`a[href="${slug}.html"]`).length, 0, slug);
    assert.equal(document('.vf-home-industry-grid article').length, 6);
    for (const name of ['Energy & power', 'Water & utilities', 'Plant maintenance']) {
        const card = document('.vf-home-industry-grid article').filter((index, node) => document(node).find('h3').text() === name);
        assert.equal(card.length, 1, name);
        assert.equal(card.find('img[alt]').length, 1, `${name}: image`);
        assert.ok(existsSync(card.find('img').attr('src')), `${name}: local image`);
    }
    assert.equal(document('.vf-home-application-row').length, 0);
    assert.equal(document('.vf-home-industry-grid article').last().find('img').attr('src'), 'img/plant-maintenance.jpg');
    assert.equal(document('.vf-home-facing-grid article').length, 3);
    assert.equal(document('.vf-home-faq details').length, 6);
    assert.equal(document('.vf-supporting').length, 1);
    for (const product of products) assert.ok(document(`a[href="${product.slug}.html"]`).length, product.slug);
    for (const node of document('.vf-home-jump a').toArray()) assert.equal(document(document(node).attr('href')).length, 1);
    for (const image of document('img').toArray()) assert.ok(existsSync(decodeURIComponent(document(image).attr('src'))));
    assert.doesNotMatch(document('main').text(), /ISO.certified|Happy Clients|Experts Workers|Exporting Countr|Projects Completed/i);
});

test('all active product details and hubs have technical tables and complete cross-product navigation', async () => {
    const fittingPages = fittingGroups.flatMap(group => group.pages.map(([slug, name]) => ({ slug, name })));
    const hubSlugs = ['flanges', 'flange-materials', 'flange-standards', 'flange-facing-finish', 'buttweld-fittings', 'forged'];
    const records = [...products, ...references, ...fittingPages];
    const slugs = [...records.map(record => record.slug), ...hubSlugs];
    assert.equal(slugs.length, 89);
    for (const slug of slugs) {
        const document = load(await readFile(`${slug}.html`, 'utf8'));
        const navigator = document('.vf-product-navigation');
        assert.equal(navigator.length, 1, `${slug}: one product navigator`);
        assert.equal(navigator.find('details').length, 6, slug);
        assert.equal(navigator.find('[aria-current="page"]').length, hiddenMaterialSlugs.has(slug) ? 0 : 1, slug);
        if (!hiddenMaterialSlugs.has(slug)) assert.equal(navigator.find('[aria-current="page"]').attr('href'), `${slug}.html`);
        for (const target of records) assert.equal(navigator.find(`a[href="${target.slug}.html"]`).length > 0, !hiddenMaterialSlugs.has(target.slug), `${slug}: navigation to ${target.slug}`);
        const information = document('.vf-product-information');
        assert.equal(information.length, 1, `${slug}: one technical supplement`);
        assert.equal(information.find('table').length, 3, slug);
        assert.ok(information.find('tbody tr').length >= 9, slug);
        assert.doesNotMatch(information.text(), /undefined|\[object Object\]/);
        for (const table of information.find('table').toArray()) {
            assert.ok(document(table).find('caption').text());
            assert.equal(document(table).find('thead th[scope="col"]').length, 3);
        }
    }
    const flatFace = references.find(reference => reference.slug === 'flat-face-flanges');
    assert.match(load(productInformation(flatFace)).text(), /Full-face gaskets|brittle/);
    const steel = references.find(reference => reference.slug === 'stainless-steel-flanges');
    assert.match(load(productInformation(steel)).text(), /304 \/ 304L/);
    assert.equal(load(productNavigation('flat-face-flanges'))('[aria-current]').attr('href'), 'flat-face-flanges.html');
});
import { readFile, writeFile, readdir } from 'node:fs/promises';
import { load } from 'cheerio';
import { products, fittingGroups } from './catalogue.mjs';
import { inventory } from './inventory.mjs';
import { references, referenceGroups } from './references.mjs';
import { galleryPage } from './gallery.mjs';
import { servicesPage } from './services.mjs';
import { navigation, footer, documentPage, homepage, cataloguePage, detailPage, referencePage, referenceDetailPage, fittingsPage, companyPage, contactPage, quoteLink, escapeHtml, productNavigation, productInformation } from './templates.mjs';

const outputs = new Map();
const fittingImages = new Map([
    ...['buttweld-short-45', 'buttweld-long-45', 'buttweld-180', 'buttweld-equal-tee', 'buttweld-concentric-reducer', 'buttweld-eccentric-reducer', 'buttweld-stub-end', 'buttweld-cap'].map(slug => [`${slug}.html`, `img/buttweld/${slug}.jpg`]),
    ['forged-caps-plugs.html', 'img/buttweld/forge-caps-plugs.jpg']
]);
const add = (path, title, description, body, parent) => {
    const hubKinds = { 'flanges.html': 'product', 'flange-materials.html': 'material', 'flange-standards.html': 'standard', 'flange-facing-finish.html': 'facing', 'buttweld-fittings.html': 'buttweld', 'forged.html': 'forged' };
    const kind = hubKinds[path];
    if (kind) {
        const related = kind === 'product' ? products.slice(0, 6).map(product => product.slug) : references.filter(reference => reference.kind === kind).slice(0, 6).map(reference => reference.slug);
        const record = { slug: path.replace('.html', ''), name: title, related };
        body = productNavigation(record.slug) + body + productInformation(record, ['buttweld', 'forged'].includes(kind) ? kind : 'guide');
    }
    outputs.set(path, documentPage(path, title, description, body, parent));
};
add('index.html', 'Industrial Flanges', 'Valtron Forge & Fittings: flange connections for industrial piping, with supporting buttweld and forged fittings. Send a project-specific enquiry.', homepage(), null);
add('gallery.html', 'Factory Gallery', 'Explore Valtron Forge & Fittings factory photographs: the team, facilities, production equipment and flange preparation, from the company catalogue.', galleryPage(), null);
add('flanges.html', 'Flanges', 'Explore 23 flange types and ranges, including plate, reducing, Weldo, Nipo, forged, square, expander, line blanks and drawing-led designs. Request a quote.', cataloguePage());
for (const product of products) add(`${product.slug}.html`, product.name, product.intro, detailPage(product));
add('flange-materials.html', 'Flange Materials', 'A material enquiry guide for flange grade selection, corrosion environment, design conditions and required documentation.', referencePage('materials'));
add('flange-standards.html', 'Flange Standards & Dimensions', 'Specify ASME, EN and other flange standards with the correct edition, type, dimensional series and rating.', referencePage('standards'));
add('flange-facing-finish.html', 'Flange Facings & Finishes', 'Compare raised face, flat face, RTJ, tongue-and-groove, male-and-female and lap-joint seating requirements.', referencePage('facings'));
for (const group of fittingGroups) add(`${group.slug}.html`, group.name, group.intro, fittingsPage(group), null);
add('about.html', 'About Valtron', 'Valtron Forge & Fittings is a flange-focused business in Mumbai, with buttweld and forged fittings for supporting piping connections.', companyPage(), null);
add('service.html', 'Industries We Serve', 'Flange enquiry and supply support for oil and gas, petrochemical, chemical, sugar, marine, aerospace, LNG, energy and nuclear-sector project requirements.', servicesPage(), null);
add('contact.html', 'Request a Quote', 'Send Valtron your flange, buttweld or forged fitting specification, quantity and contact details in a product-specific WhatsApp enquiry.', contactPage(), null);
for (const reference of references) {
    const parent = referenceGroups[reference.kind];
    add(`${reference.slug}.html`, reference.title, reference.intro, referenceDetailPage(reference), [parent.path, parent.title]);
}
const canonicalPaths = [...outputs.keys()];

const removed = new Set(['pipes&tubes', 'round-bars', 'sheets&plates', 'beam-channels', 'fastners', 'wire', 'welding-wire', 'tube-fittings', 'threaded-fittings', 'threaded-cross', 'threaded-elbow', 'threaded-end-cap', 'threaded-equal-tee', 'threaded-full-coupling', 'threaded-half-coupling', 'threaded-reducing-tee', 'threaded-union', 'hex-nipple', 'barrel-nipple'].map(slug => `${slug}.html`));
const rootPages = (await readdir('.')).filter(path => path.endsWith('.html'));
const markerReplace = (source, start, end, value, path) => {
    const first = source.indexOf(start);
    const last = source.indexOf(end, first);
    if (first < 0 || last < 0) throw new Error(`Missing shared region in ${path}: ${start}`);
    return source.slice(0, first) + start + '\n' + value + '\n' + source.slice(last);
};

for (const path of rootPages) {
    if (outputs.has(path)) continue;
    let source = await readFile(path, 'utf8');
    source = markerReplace(source, '<!-- Top Bar Start -->', '<!-- Top Bar End -->', '', path);
    source = markerReplace(source, '<!-- Nav Bar Start -->', '<!-- Nav Bar End -->', navigation(path), path);
    source = markerReplace(source, '<!-- Footer Start -->', '<!-- Footer End -->', footer(), path);
    const document = load(source, { sourceCodeLocationInfo: true });
    const group = fittingGroups.find(candidate => candidate.pages.some(([slug]) => `${slug}.html` === path));
    const familyLinks = group ? group.pages : products.map(product => [product.slug, product.name]);
    const links = familyLinks.map(([slug, name]) => `<a href="${slug}.html"${`${slug}.html` === path ? ' aria-current="page"' : ''}>${escapeHtml(name)}</a>`).join('');
    const edits = [];
    const replaceNode = (node, text) => {
        const location = node.sourceCodeLocation;
        if (!location) throw new Error(`Missing HTML source offsets in ${path}`);
        if (edits.some(edit => location.startOffset >= edit.start && location.endOffset <= edit.end)) return;
        edits.push({ start: location.startOffset, end: location.endOffset, text });
    };
    document('.sidebar').each((index, node) => replaceNode(node, `<aside class="col-lg-3 col-md-4 col-sm-12 sidebar vf-legacy-sidebar"><h2>${group ? group.name : 'Flanges'}</h2>${links}<a href="flanges.html">All Flanges</a><a href="buttweld-fittings.html">Buttweld Fittings</a><a href="forged.html">Forged Fittings</a></aside>`));
    document('.related-slider').each((index, node) => replaceNode(node, `<div class="vf-legacy-related" aria-label="Related products">${links}</div>`));
    if (group) {
        document('.page-header').each((index, node) => {
            document(node).attr('data-product-category', group.slug);
            replaceNode(node, document.html(node));
        });
        const name = group.pages.find(([slug]) => `${slug}.html` === path)[1];
        const slug = path.replace('.html', '');
        const information = productInformation({ slug, name }, group.slug === 'forged' ? 'forged' : 'buttweld');
        const navigator = productNavigation(slug);
        const content = document('.content-section').first()[0];
        if (!content?.sourceCodeLocation?.endTag) throw new Error(`Missing fitting content boundary in ${path}`);
        const oldNavigation = document('.content-section > .vf-product-navigation');
        const oldInformation = document('.content-section > .vf-product-information');
        if (oldNavigation.length) oldNavigation.each((index, node) => replaceNode(node, navigator));
        else edits.push({ start: content.sourceCodeLocation.startTag.endOffset, end: content.sourceCodeLocation.startTag.endOffset, text: navigator });
        if (oldInformation.length) oldInformation.each((index, node) => replaceNode(node, information));
        else edits.push({ start: content.sourceCodeLocation.endTag.startOffset, end: content.sourceCodeLocation.endTag.startOffset, text: information });
        const enquiry = `<div class="vf-legacy-enquiry"><a class="vf-button vf-legacy-quote" href="${escapeHtml(quoteLink(name, group.name))}">Request a Quote <i class="fas fa-arrow-right" aria-hidden="true"></i></a></div>`;
        const existing = document('.vf-legacy-enquiry');
        if (existing.length) existing.each((index, node) => replaceNode(node, enquiry));
        else {
            const figure = document('.detail-section .flange-hero-img');
            if (figure.length !== 1) throw new Error(`Expected one fitting image in ${path}`);
            const node = figure[0];
            replaceNode(node, source.slice(node.sourceCodeLocation.startOffset, node.sourceCodeLocation.endOffset) + enquiry);
        }
    }
    document('a[href]').each((index, node) => {
        if (document(node).hasClass('whatsapp-chat')) {
            replaceNode(node, '');
            return;
        }
        const href = document(node).attr('href').replace(/^\.\//, '').split(/[?#]/)[0];
        if (removed.has(href)) replaceNode(node, `<span>${escapeHtml(document(node).text().trim())}</span>`);
        if (group && /^(https:\/\/wa\.me\/919619770076|contact\.html)(?:[?#]|$)/.test(href) && !document(node).closest('.vf-header, .vf-footer, .vf-legacy-enquiry').length) {
            replaceNode(node, '');
        }
    });
    document('.flange-hero-img img, a[href] img').each((index, node) => {
        const image = document(node);
        const target = image.closest('.flange-hero-img').length ? path : image.closest('a').attr('href')?.replace(/^\.\//, '').split(/[?#]/)[0];
        const replacement = fittingImages.get(target);
        if (!replacement) return;
        image.attr('src', replacement);
        replaceNode(node, document.html(node));
    });
    for (const edit of edits.sort((left, right) => right.start - left.start)) source = source.slice(0, edit.start) + edit.text + source.slice(edit.end);
    if (group) source = source.replace(/(<!-- Back to top button -->\r?\n)[ \t]+(?=\r?\n)/, '$1');
    if (!source.includes('href="css/catalogue.css"')) source = source.replace('</head>', '<link rel="stylesheet" href="css/catalogue.css">\n</head>');
    if (!source.includes('src="js/catalogue.js"')) source = source.replace('</body>', '<script src="js/catalogue.js" defer></script>\n</body>');
    outputs.set(path, source);
}

for (const [path, source] of outputs) {
    const previous = await readFile(path, 'utf8').catch(() => '');
    if (previous !== source) await writeFile(path, source, 'utf8');
}
console.log(`Built ${outputs.size} static pages; ${rootPages.length} existing URLs preserved. No review-only images used.`);
await writeFile('catalogue-inventory.json', JSON.stringify(inventory, null, 2) + '\n');
await writeFile('sitemap.xml', `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${canonicalPaths.map(path => `  <url><loc>https://www.valtronforge.com/${path}</loc></url>`).join('\n')}\n</urlset>\n`);
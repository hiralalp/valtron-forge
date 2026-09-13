import { products } from './catalogue.mjs';
import { references } from './references.mjs';

const productPaths = ['plate-flanges', 'reducing-flanges', 'weldo-flanges', 'nipo-flanges', 'loose-flanges', 'square-flanges', 'expander-flanges', 'high-hub-blind-flanges', 'spectacle-blind-flanges', 'spade-flanges', 'ring-spacers', 'lip-type-flanges', 'puddle-flanges', 'forged-flanges', 'large-diameter-flanges', 'custom-flanges', 'integral-flanges', 'swivel-ring-flanges', 'anchor-flanges', 'split-flanges', 'sae-hydraulic-flanges', 'compact-flanges', 'vacuum-flanges', 'sanitary-flanges'];
const materialPaths = ['stainless-steel', 'carbon-steel', 'alloy-steel', 'duplex-steel', 'super-duplex-steel', 'nickel', 'monel', 'inconel', 'incoloy', 'hastelloy', 'alloy-20', 'smo-254', 'titanium', 'copper', 'copper-nickel', 'aluminium'].map(name => `${name}-flanges`);
const standardPaths = ['asme-b16-5-flanges', 'asme-b16-47-flanges', 'asme-b16-47-series-a-flanges', 'asme-b16-47-series-b-flanges', 'asme-b16-36-flanges', 'asme-b16-48-line-blanks', 'mss-sp-44-flanges', 'en-1092-1-flanges', 'din-flanges', 'bs-4504-flanges', 'bs-10-flanges', 'awwa-c207-flanges', 'api-6a-flanges', 'jis-flanges', 'sans-1123-flanges', 'gost-flanges', 'as-2129-flanges', 'uni-flanges'];
const facingPaths = ['raised-face-flanges', 'flat-face-flanges', 'rtj-flanges', 'tongue-and-groove-flanges', 'male-and-female-flanges', 'lap-joint-facing'];
const hubPaths = ['flanges', 'flange-materials', 'flange-standards', 'flange-types-guide', 'flange-facing-finish', 'flange-pressure-ratings', 'flange-material-selection', 'weight-calculator'];
const built = new Set([...products.map(product => product.slug), ...references.map(reference => reference.slug), 'flanges', 'flange-materials', 'flange-standards', 'flange-facing-finish']);
const origin = (slug, category) => {
    if ((products.some(product => product.slug === slug) && !productPaths.includes(slug)) || ['flanges', 'weight-calculator'].includes(slug)) return 'Retained Valtron URL';
    if (category === 'product') {
        const position = productPaths.indexOf(slug);
        return position < 13 ? 'Reference-derived addition' : position < 16 ? 'Proposed construction/range collection' : 'Additional specialty proposal';
    }
    return 'Planned technical reference expansion; see catalogue plan for source and scope';
};

export const inventory = [
    ...products.map(product => [product.slug, 'product']), ...productPaths.filter(slug => !products.some(product => product.slug === slug)).map(slug => [slug, 'product']),
    ...materialPaths.map(slug => [slug, 'material']), ...standardPaths.map(slug => [slug, 'standard']),
    ...facingPaths.map(slug => [slug, 'facing']), ...hubPaths.map(slug => [slug, 'hub'])
].map(([slug, category]) => ({
    path: `${slug}.html`, category, source: origin(slug, category), owner: 'Valtron client technical review',
    status: built.has(slug) ? 'implemented' : slug === 'weight-calculator' ? 'retained-unverified' : 'deferred',
    content: built.has(slug) ? 'Original enquiry/reference content implemented' : 'Dedicated content pending technical scope approval',
    imagery: references.find(reference => reference.slug === slug)?.caption ?? products.find(product => product.slug === slug)?.caption ?? (products.some(product => product.slug === slug) ? 'Existing site asset retained; provenance approval pending' : category === 'product' ? 'See image-review coverage register; not cleared for production' : 'Reference hub; no dedicated product image'),
    technicalApproval: 'Client approval pending; no universal dimensions or stock claims authorised',
    reason: built.has(slug) ? 'Local static implementation; client production review pending' : category === 'product' ? 'Accurate imagery, usage rights and offered design must be approved' : slug === 'weight-calculator' ? 'Existing calculator preserved but not promoted until flange formulas and units are validated' : 'Dedicated reference content pending'
}));
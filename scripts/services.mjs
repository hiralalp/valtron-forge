import { escapeHtml, heading, enquiryBand } from './templates.mjs';

export const serviceIndustries = [
    {
        id: 'oil-gas', name: 'Oil & Gas', image: 'oil&gas-industries.jpg', alt: 'Oil and gas processing facility',
        description: 'Production, processing and transfer systems rely on piping connections that can be inspected and maintained throughout their operating life. Flange selection must account for the fluid, pressure-temperature conditions and the complete bolted joint, especially where corrosive or sour service is specified.',
        applications: 'Process pipework, equipment nozzles, isolation points and maintenance connections.',
        requirements: 'Service conditions, piping class, material grade, facing and any specified sour-service requirements.',
        guide: 'asme-b16-5-flanges.html', label: 'Pipe flange standards'
    },
    {
        id: 'petrochemical', name: 'Petrochemical', image: 'petrochemical-industries.jpg', alt: 'Petrochemical processing facility',
        description: 'Refining and petrochemical plants combine different process streams, temperatures and maintenance schedules. Consistent flange specifications help coordinate equipment interfaces and replacement parts, while shutdown enquiries need clear quantities, drawing revisions and delivery priorities.',
        applications: 'Refinery process lines, heat-exchanger connections, vessel interfaces and shutdown replacements.',
        requirements: 'Line specification, design temperature, corrosion allowance, gasket interface and inspection plan.',
        guide: 'weld-neck-flanges.html', label: 'Weld-neck flanges'
    },
    {
        id: 'chemical', name: 'Chemical', image: 'chemical-industries.jpg', alt: 'Chemical processing plant',
        description: 'Chemical handling demands attention to fluid compatibility as well as mechanical design. Concentration, contaminants, temperature and cleaning cycles can change the suitability of a material. We discuss the specified flange grade and connection details against the project requirement rather than assuming one alloy suits every process.',
        applications: 'Chemical transfer lines, reactor connections, storage systems and treatment equipment.',
        requirements: 'Process chemistry, grade specification, gasket compatibility, surface finish and cleaning requirements.',
        guide: 'flange-material-selection.html', label: 'Material selection guide'
    },
    {
        id: 'sugar', name: 'Sugar', image: 'sugar-industries.jpg', alt: 'Industrial processing plant with vessels, pipework and access platforms',
        description: 'Sugar processing facilities use a mixture of product-handling lines and steam, water and condensate utilities. These duties call for different material and maintenance considerations. Flanged joints provide removable connections around equipment, with sealing and cleaning requirements defined for each application.',
        applications: 'Evaporator connections, process equipment, steam distribution and condensate return lines.',
        requirements: 'Process or utility duty, temperature, cleaning regime and any specified food-contact requirements.',
        guide: 'stainless-steel-flanges.html', label: 'Stainless-steel flange guide'
    },
    {
        id: 'marine', name: 'Marine', image: 'marine-industries.jpg', alt: 'Marine vessel and port operations',
        description: 'Vessels and coastal installations bring together seawater exposure, confined maintenance access and dissimilar materials. Flange and gasket choices need to suit the piping system, with particular attention to corrosion and joint compatibility. Class or owner requirements must be identified before a supply commitment.',
        applications: 'Seawater cooling, ballast systems, onboard utilities and coastal plant pipework.',
        requirements: 'Fluid exposure, mating materials, dimensional standard and applicable class or owner approval.',
        guide: 'copper-nickel-flanges.html', label: 'Copper-nickel flange guide'
    },
    {
        id: 'aerospace', name: 'Aerospace', image: 'aerospace-industries.jpg', alt: 'Aircraft being assembled inside a manufacturing facility',
        description: 'Aerospace manufacturing and ground-support facilities can require drawing-specific connections for test equipment and utility systems. Dimensional control, material identity and documented inspection are central to reviewing these enquiries. Any flight-critical application requires separate engineering review and customer qualification.',
        applications: 'Ground-support pipework, test facilities and manufacturing-plant utilities.',
        requirements: 'Approved drawing and revision, tolerances, traceability, inspection and customer qualification criteria.',
        guide: 'flange-types-guide.html', label: 'Connection selection guide'
    },
    {
        id: 'lng', name: 'Liquefied Natural Gas (LNG)', image: 'lng-industries.jpg', alt: 'Liquefied natural gas carrier with storage tanks on deck',
        description: 'LNG applications introduce low-temperature conditions and thermal cycling that affect material behaviour and sealing. A flange enquiry should identify the minimum design temperature alongside the pressure and mating connection. Material toughness, gasket selection and testing must follow the project specification.',
        applications: 'Cryogenic transfer systems, terminal process connections and associated utility piping.',
        requirements: 'Minimum design temperature, material toughness criteria, gasket specification and required testing.',
        guide: 'flange-pressure-ratings.html', label: 'Pressure-temperature considerations'
    },
    {
        id: 'energy-power', name: 'Energy & Power', image: 'energy-indiustries.jpg', alt: 'Energy and power generation facility',
        description: 'Power-generation sites include steam, cooling water, fuel and auxiliary systems with very different operating conditions. Flange selection depends on the individual line specification and temperature range. Replacement enquiries should also confirm the existing bolt pattern, facing and equipment interface.',
        applications: 'Steam and condensate networks, cooling circuits, auxiliary systems and plant maintenance.',
        requirements: 'Design pressure and temperature, material grade, dimensional series and inspection documentation.',
        guide: 'alloy-steel-flanges.html', label: 'Alloy-steel flange guide'
    },
    {
        id: 'nuclear', name: 'Nuclear', image: 'nuclear-industries.jpg', alt: 'Power-generation site with cooling towers and industrial buildings',
        description: 'Nuclear-sector enquiries require a clearly defined system classification, procurement specification and quality-assurance route. We review the stated scope before confirming whether a requirement can be supported. Safety-related supply is subject to project-specific qualification; general industrial flange standards alone are not sufficient.',
        applications: 'Project-defined utility, maintenance and equipment connections, subject to scope review.',
        requirements: 'Safety classification, applicable code, approved quality plan, traceability and procurement approvals.',
        guide: 'flange-standards.html', label: 'Flange standards overview'
    }
];

export function servicesPage() {
    const arrow = '<i class="fas fa-arrow-right" aria-hidden="true"></i>';
    const directory = serviceIndustries.map(industry => `<a href="#industry-${industry.id}">${escapeHtml(industry.name)}</a>`).join('');
    const industries = serviceIndustries.map((industry, index) => `<article class="vf-service-industry" id="industry-${industry.id}" aria-labelledby="industry-title-${industry.id}"><div class="vf-service-image"><img src="img/${escapeHtml(industry.image)}" alt="${escapeHtml(industry.alt)}" width="600" height="400" loading="${index < 3 ? 'eager' : 'lazy'}"></div><div class="vf-service-industry-title"><span>${String(index + 1).padStart(2, '0')}</span><h2 id="industry-title-${industry.id}">${escapeHtml(industry.name)}</h2></div><p>${escapeHtml(industry.description)}</p><dl><dt>Typical applications</dt><dd>${escapeHtml(industry.applications)}</dd><dt>Include in your enquiry</dt><dd>${escapeHtml(industry.requirements)}</dd></dl><a class="vf-service-guide" href="${industry.guide}">${escapeHtml(industry.label)} ${arrow}</a></article>`).join('');
    return `${heading('Our services / Industrial applications', 'Industries We Serve', 'Flange supply and specification-led enquiry support for process plants, industrial facilities and project-specific connections.')}<nav class="vf-service-directory" aria-label="Industries"><div class="vf-wrap">${directory}</div></nav><section class="vf-section vf-service-range" aria-label="Industry applications"><div class="vf-wrap"><div class="vf-service-range-intro"><p>From new installations to planned maintenance, each industry brings its own operating conditions. Our focus is on flanges, with buttweld and forged fittings available for supporting piping connections.</p><a class="vf-text-link" href="flanges.html">Explore flange range ${arrow}</a></div><div class="vf-service-grid">${industries}</div></div></section><section class="vf-service-support"><div class="vf-wrap"><div class="vf-service-support-heading"><p class="vf-eyebrow">From specification to enquiry</p><h2>Support built around your project.</h2><p>Supply scope, availability, documentation and delivery are confirmed for each order. Industry photographs illustrate application sectors, not completed Valtron projects or customer endorsements.</p></div><div class="vf-service-support-grid"><div><i class="fas fa-ruler-combined" aria-hidden="true"></i><h3>Connection review</h3><p>Share the flange type, nominal size, rating, standard and facing. For equipment interfaces, include the mating dimensions and drawing revision.</p></div><div><i class="fas fa-clipboard-check" aria-hidden="true"></i><h3>Documentation requirements</h3><p>Specify material certificates, dimensional inspection, testing and traceability requirements before placing an order. Sector-specific approvals need explicit agreement.</p></div><div><i class="fas fa-truck" aria-hidden="true"></i><h3>Delivery planning</h3><p>Provide quantities, the delivery location and any shutdown or installation dates so the supply scope and schedule can be discussed together.</p></div></div></div></section>${enquiryBand()}`;
}
export const referenceGroups = {
    material: { path: 'flange-materials.html', title: 'Flange Materials', label: 'Material selection' },
    standard: { path: 'flange-standards.html', title: 'Flange Standards & Dimensions', label: 'Standard reference' },
    facing: { path: 'flange-facing-finish.html', title: 'Flange Facings & Finishes', label: 'Facing reference' },
    guide: { path: 'flanges.html', title: 'Flanges', label: 'Flange selection guide' }
};

const material = (slug, name, intro, sections, checks, related) => ({
    slug, name, title: `${name} Flanges`, kind: 'material', intro, sections, checks, related, enquiry: { material: name }
});
const standard = (slug, name, intro, sections, checks, related) => ({
    slug, name, title: `${name} ${name === 'ASME B16.48' ? 'Line Blanks' : 'Flanges'}`, kind: 'standard', intro, sections, checks, related, enquiry: { standard: name }
});
const facing = (slug, name, diagram, intro, sections, checks, related) => ({
    slug, name, title: `${name} ${slug === 'lap-joint-facing' ? '' : 'Flanges'}`.trim(), kind: 'facing', intro, sections, checks, related,
    image: `img/flanges/reference/${diagram}.png`, alt: `${name} facing section schematic showing the mating surfaces and gasket`,
    caption: 'Original, non-dimensional facing schematic. Simplified geometry is not a manufacturing drawing, gasket specification or evidence of available stock.',
    enquiry: { facing: name }
});

export const references = [
    {
        slug: 'stainless-steel-flanges', name: 'Stainless Steel', title: 'Stainless Steel Flanges', kind: 'material',
        intro: 'Specify stainless steel flanges by grade, product specification and service conditions, not by a bright surface finish or the general name stainless steel.',
        sections: [
            ['Grade and product form', 'Austenitic grades such as 304L and 316L are common enquiry designations, but they are not interchangeable for every service. Low-carbon, stabilised and other grade variants have distinct requirements. State the complete flange material specification and grade, and identify whether the component is forged or made by another approved route.'],
            ['Corrosion and fabrication', 'Chloride concentration, temperature, crevices, cleaning chemicals and shutdown conditions can change material suitability. A generic stainless designation does not establish resistance to pitting or stress-corrosion cracking. Welding, heat treatment, surface cleaning and contamination controls should be reviewed with the piping specification.'],
            ['Joint and documentation', 'Material selection does not select the flange class or facing. Confirm the dimensional standard, pressure-temperature rating and gasket separately. Request traceability to the ordered material designation and specify any corrosion, intergranular or other supplementary testing in the enquiry rather than assuming it is included.']
        ],
        checks: [['Designation', 'Material specification, grade and any low-carbon or stabilised variant'], ['Service', 'Fluid composition, chloride exposure and design temperatures'], ['Fabrication', 'Weld procedure, heat treatment and surface-cleanliness requirements'], ['Documents', 'Material traceability and project-specific inspection or test requirements']],
        related: ['duplex-steel-flanges', 'smo-254-flanges', 'flange-material-selection'],
        image: 'img/flanges/weld-neck.png', alt: 'Weld-neck flange showing the tapered hub and bolted interface',
        caption: 'Flange geometry reference only. The image does not identify stainless steel, a grade or a certified material.',
        enquiry: { material: 'Stainless Steel' }
    },
    material('carbon-steel-flanges', 'Carbon Steel',
        'Define carbon steel flanges by product specification, temperature range and joint design. Carbon steel is a material family, not a pressure rating.',
        [
            ['Forging specification and temperature', 'An ASTM A105 designation and a low-temperature forging specification such as ASTM A350 describe different requirements. Do not substitute one based only on appearance or nominal strength. The design minimum temperature, thickness and applicable code determine whether impact testing and a particular grade or class are required.'],
            ['Corrosion and protection', 'Review fluid chemistry, corrosion allowance and the external environment before selecting a protection system. Paint, galvanizing or other coatings do not automatically protect process-wetted surfaces. Coating thickness and masking requirements must not interfere with gasket seating, threads or bolt fit.'],
            ['Welding and traceability', 'Identify the mating pipe material, weld preparation and heat-treatment requirements. Specify the material certificate and marking needed to preserve traceability through machining and any coating operation. Dimensional inspection alone cannot establish the ordered material grade.']
        ],
        [['Material', 'Forging or plate specification, grade and heat treatment'], ['Temperature', 'Design minimum and maximum; impact-test requirements'], ['Protection', 'Corrosion allowance, coating and masked surfaces'], ['Joint', 'Pipe material, facing, class and weld requirements']],
        ['alloy-steel-flanges', 'stainless-steel-flanges', 'flange-pressure-ratings']),
    material('alloy-steel-flanges', 'Alloy / Chrome Moly Steel',
        'Chrome-moly flange enquiries require the exact alloy grade and heat-treatment condition, especially where elevated temperature and welding govern the design.',
        [
            ['Grade-specific elevated-temperature design', 'Chrome-moly grades do not share one allowable temperature or pressure envelope. The required composition, product specification and heat treatment must align with the piping design. A broad description such as alloy steel is insufficient for procurement or substitution.'],
            ['Welding and heat treatment', 'Review the flange-to-pipe weld with the specified base materials, consumables and weld procedure. Preheat, post-weld heat treatment and hardness requirements depend on the grade, code and project. They should be defined before manufacture rather than inferred from a familiar grade name.'],
            ['Verification and service history', 'For replacement work, obtain the existing component designation and available material records. Positive material identification can support alloy verification but does not replace all mechanical, heat-treatment or traceability requirements. Agree the inspection scope and acceptance criteria explicitly.']
        ],
        [['Grade', 'Complete specification and chrome-moly grade'], ['Design', 'Operating and design temperatures, pressure and loading'], ['Fabrication', 'Weld procedure, heat treatment and hardness limits'], ['Inspection', 'Traceability, alloy verification and supplementary tests']],
        ['carbon-steel-flanges', 'incoloy-flanges', 'flange-material-selection']),
    material('duplex-steel-flanges', 'Duplex Steel',
        'Duplex flange selection combines corrosion resistance with a controlled two-phase microstructure. Identify the exact grade rather than requesting duplex alone.',
        [
            ['Designation and microstructure', 'Duplex stainless steels contain ferritic and austenitic phases. Common designations such as UNS S31803 and S32205 must be checked against the actual purchase specification; a dual designation should not be assumed. Product form and heat treatment are part of the ordered material condition.'],
            ['Corrosion and fabrication review', 'Service chemistry, chloride exposure and temperature must be evaluated for the selected grade. Welding and thermal processing can affect phase balance and corrosion performance. Specify the required weld procedure and any project limits on ferrite, intermetallic phases or corrosion-test results.'],
            ['Joint selection remains separate', 'The material name does not set the bolt pattern, flange class or gasket arrangement. Confirm the dimensional standard and the applicable material-specific design basis. Backing rings, stub ends and mating fasteners may have different materials and must be identified separately.']
        ],
        [['Identity', 'UNS designation and applicable product specification'], ['Condition', 'Heat treatment and project microstructure requirements'], ['Service', 'Chlorides, design temperature and corrosion assessment'], ['Testing', 'Required phase-balance, corrosion and mechanical tests']],
        ['super-duplex-steel-flanges', 'stainless-steel-flanges', 'smo-254-flanges']),
    material('super-duplex-steel-flanges', 'Super Duplex Steel',
        'Super duplex flange enquiries need a grade-specific corrosion and fabrication review. The family name is not a guarantee of suitability for seawater or chemical service.',
        [
            ['Select a defined alloy', 'State the UNS designation, such as S32750 or S32760 where specified by the project, and the applicable forging or other product specification. These alloy designations are not automatic substitutes. Chemical composition, heat treatment and acceptance testing must match the purchase order.'],
            ['Service and thermal processing', 'High chloride exposure, crevices, stagnation and elevated temperatures require assessment together. Fabrication thermal cycles can affect the phase structure and corrosion properties. The manufacturing and welding requirements should therefore be agreed with the material selection, not after a flange has been dimensioned.'],
            ['Inspection scope', 'Define the required material traceability and any corrosion, ferrite or intermetallic-phase examinations. A corrosion-test result applies to the stated specimen and method; it does not establish unrestricted service suitability. Specify joint materials and gasket compatibility as part of the assembly review.']
        ],
        [['Alloy', 'Exact UNS and material specification'], ['Exposure', 'Fluid chemistry, temperature, stagnation and cleaning conditions'], ['Processing', 'Heat treatment, welding and thermal-control requirements'], ['Acceptance', 'Named test methods and project acceptance criteria']],
        ['duplex-steel-flanges', 'smo-254-flanges', 'titanium-flanges']),
    material('nickel-flanges', 'Nickel',
        'Commercially pure nickel flanges are a different enquiry from nickel-alloy flanges. Specify the grade and service chemistry without relying on the word nickel alone.',
        [
            ['Pure nickel versus nickel alloys', 'Nickel 200 and Nickel 201 are examples of commercially pure nickel designations with different carbon limits. They must not be treated as interchangeable with nickel-copper, nickel-chromium or nickel-iron-chromium alloys. Request the complete designation and product specification.'],
            ['Temperature and process chemistry', 'The designer should assess concentration, contaminants, oxidation conditions and operating temperature together. A material that is considered for one concentration or temperature can behave differently under another. Published corrosion guidance must be applied to the actual process conditions rather than to a broad industry label.'],
            ['Fabrication and mating materials', 'Specify weld preparation, cleanliness and any annealed or other required condition. Review the adjacent pipe, gasket and fasteners as a joint. Material certification, dimensional inspection and pressure-design verification serve different purposes and should each be defined in the enquiry.']
        ],
        [['Designation', 'Nickel grade and product specification'], ['Chemistry', 'Process fluid, concentration and contaminants'], ['Temperature', 'Design range and required material condition'], ['Assembly', 'Pipe material, gasket, fasteners and weld procedure']],
        ['monel-flanges', 'inconel-flanges', 'flange-material-selection']),
    material('monel-flanges', 'Monel',
        'Monel nickel-copper flange enquiries should identify the alloy designation and condition. Alloy 400 and K-500 have different composition and strengthening requirements.',
        [
            ['Alloy and condition', 'The Monel family name does not identify a single material. Alloy 400 and the precipitation-hardenable K-500 should be specified by their appropriate alloy or UNS designation and product specification. Required mechanical properties depend on the ordered condition as well as composition.'],
            ['Service assessment', 'Review the actual fluid, dissolved gases, velocity, temperature and shutdown conditions. Seawater or chemical-service descriptions alone are not a corrosion assessment. The joint design should consider galvanic interaction with adjacent materials and any project restrictions on fasteners or seals.'],
            ['Procurement details', 'Confirm the flange construction, facing and dimensional standard separately from the alloy. Include heat-treatment condition, traceability and inspection requirements in the purchase description. A supplier trade name or surface appearance is not sufficient evidence that the material matches the design.']
        ],
        [['Alloy', 'Exact designation, specification and condition'], ['Service', 'Fluid chemistry, flow and design temperatures'], ['Joint', 'Mating material, gasket and galvanic compatibility'], ['Verification', 'Material certificate, marking and inspection requirements']],
        ['nickel-flanges', 'copper-nickel-flanges', 'inconel-flanges']),
    material('inconel-flanges', 'Inconel',
        'Specify Inconel flanges by alloy number and product specification. The nickel-chromium alloy family spans different corrosion, temperature and strength requirements.',
        [
            ['Alloy number matters', 'Designations such as 600, 625 and 718 describe different alloys and must not be treated as a common stock specification. State the exact alloy or UNS designation, required material condition and applicable flange product form. Confirm any project restrictions on substitution.'],
            ['Corrosion and temperature are separate checks', 'Oxidation resistance, aqueous corrosion resistance and high-temperature mechanical performance are different selection questions. Define the process environment and design loads so the engineer can assess the chosen grade. A general high-temperature label does not establish a pressure-temperature rating.'],
            ['Fabrication and acceptance', 'Welding, heat treatment and machining requirements depend on the selected alloy and condition. Identify the mating pipe and any dissimilar-material joint. Agree material documentation and supplementary testing before ordering; do not infer a complete inspection package from the alloy name.']
        ],
        [['Identity', 'Alloy number or UNS and product specification'], ['Condition', 'Required heat treatment and mechanical condition'], ['Design', 'Service chemistry, pressure, temperature and loading'], ['Fabrication', 'Mating material, weld procedure and inspection scope']],
        ['incoloy-flanges', 'hastelloy-flanges', 'nickel-flanges']),
    material('incoloy-flanges', 'Incoloy',
        'Incoloy flange enquiries cover defined nickel-iron-chromium alloys. Identify the grade and required condition rather than substituting a similarly named Inconel alloy.',
        [
            ['Distinguish the designation', 'Alloy 800, 800H, 800HT and 825 illustrate the different specifications found within this family. Composition controls and material condition can affect the intended service. The flange enquiry should reproduce the exact project designation and the applicable product specification.'],
            ['Match the service requirement', 'Some enquiries are driven by high-temperature mechanical performance, while others are driven by corrosion in a process fluid. Neither requirement follows from the family name alone. Include the complete design-temperature range, chemistry and relevant loading or life considerations.'],
            ['Fabrication compatibility', 'Confirm heat-treatment and welding requirements for the selected grade and the mating pipe. Dissimilar welds require their own review. Flange dimensions, facing and bolting still need to be specified under the applicable joint design, independently of the material choice.']
        ],
        [['Designation', 'Full alloy variant and product specification'], ['Service basis', 'Corrosion environment or elevated-temperature design requirements'], ['Condition', 'Heat treatment and any project-specific material controls'], ['Connection', 'Weld preparation, facing and dimensional standard']],
        ['inconel-flanges', 'alloy-steel-flanges', 'alloy-20-flanges']),
    material('hastelloy-flanges', 'Hastelloy',
        'Hastelloy flanges require an exact alloy designation and process-chemistry review. A family name is not a specification for all corrosive fluids.',
        [
            ['Different alloys, different requirements', 'Designations such as C-276, C-22 and B-3 refer to different nickel-alloy compositions. They are not interchangeable on the strength of the Hastelloy name. Identify the exact alloy or UNS designation and the product specification required for the flange.'],
            ['Define the corrosion environment', 'Provide chemical composition, concentration, contaminants, temperature and cleaning or upset conditions. Oxidising and reducing environments may drive different selection decisions. Localised corrosion and welded regions need to be included in the material review rather than assessed only from general corrosion rates.'],
            ['Manufacturing and traceability', 'State the required material condition, weld preparation and inspection scope. Surface cleanliness and contamination control may be important to fabrication. Maintain traceability between the flange, material certificate and any supplementary test records requested by the project.']
        ],
        [['Alloy', 'Exact alloy or UNS and flange material specification'], ['Chemistry', 'Concentration, contaminants and oxidation conditions'], ['Operation', 'Design temperatures, cleaning and upset conditions'], ['Documents', 'Traceability, heat treatment and supplementary testing']],
        ['inconel-flanges', 'alloy-20-flanges', 'flange-material-selection']),
    material('alloy-20-flanges', 'Alloy 20',
        'Alloy 20 flange enquiries should identify UNS N08020 and the applicable product specification, with corrosion suitability reviewed for the actual process.',
        [
            ['Identify the product specification', 'UNS N08020 identifies the alloy composition family, not a finished flange dimension or inspection package. State the applicable forging or other product specification, required condition and flange standard. Avoid treating a commercial alloy name as a complete purchase description.'],
            ['Acid-service conditions', 'Alloy 20 may be evaluated for acid-handling applications, but acid type, concentration, contaminants and temperature are essential to that evaluation. Do not infer universal acid resistance. Include normal operation, cleaning and credible upset conditions in the service information.'],
            ['Joint compatibility', 'Review the mating pipe, weld procedure, gasket and fasteners alongside the alloy selection. Pressure-temperature suitability must be established under the project design basis. Specify the material documentation and any supplementary corrosion testing with defined acceptance criteria.']
        ],
        [['Identity', 'UNS N08020, product specification and condition'], ['Process', 'Acid composition, concentration and contaminants'], ['Joint', 'Weld procedure, mating material and gasket'], ['Acceptance', 'Material records and required service-specific tests']],
        ['hastelloy-flanges', 'incoloy-flanges', 'stainless-steel-flanges']),
    material('smo-254-flanges', 'SMO 254',
        'SMO 254 is a high-alloy austenitic stainless material, not a duplex grade. Define the flange using the required alloy designation and product specification.',
        [
            ['Austenitic material identity', 'UNS S31254 is a designation commonly associated with this material. Confirm the exact contractual designation, product form and required condition. Do not substitute a duplex specification because both materials may be discussed for demanding chloride environments.'],
            ['Chloride and crevice exposure', 'Temperature, chloride concentration, crevices, stagnation and cleaning chemicals must be assessed together. A high alloy content does not remove the need for a service-specific corrosion assessment. The gasket arrangement and surface condition can affect the conditions at the joint.'],
            ['Fabrication requirements', 'Specify welding, heat treatment where required, surface cleaning and contamination controls under the project requirements. Verify the mating pipe and filler-material requirements. Material traceability and test records should identify the ordered alloy, not simply stainless steel.']
        ],
        [['Designation', 'Required alloy/UNS and product specification'], ['Exposure', 'Chlorides, crevices, temperatures and cleaning chemistry'], ['Fabrication', 'Welding, surface condition and cleanliness controls'], ['Records', 'Traceability and specified corrosion or mechanical tests']],
        ['stainless-steel-flanges', 'duplex-steel-flanges', 'super-duplex-steel-flanges']),
    material('titanium-flanges', 'Titanium',
        'Titanium flange selection requires a defined grade, compatible joint design and carefully controlled fabrication. Titanium is not one universally interchangeable material.',
        [
            ['Grade and condition', 'Commercially pure and alloyed titanium grades have different mechanical and corrosion requirements. Specify the grade, applicable product specification and condition. A generic titanium description cannot establish the allowable design stresses or the required flange construction.'],
            ['Environment and mating materials', 'Assess service chemistry, contaminants and temperature, including cleaning and upset conditions. Review galvanic interaction with the adjacent pipe, backing flange, bolts and other wetted components. The process-wetted material of a lined or stub-end assembly must be identified separately.'],
            ['Fabrication and cleanliness', 'Titanium fabrication can require specific shielding, tooling and contamination controls. Agree the welding and inspection requirements with the fabricator under the project specification. Confirm gasket seating, surface condition and traceability before procurement.']
        ],
        [['Grade', 'Titanium grade, product specification and condition'], ['Service', 'Chemistry, contaminants and design temperatures'], ['Assembly', 'Wetted surfaces and galvanic compatibility'], ['Fabrication', 'Weld shielding, cleanliness and inspection requirements']],
        ['super-duplex-steel-flanges', 'copper-nickel-flanges', 'lap-joint-facing']),
    material('copper-flanges', 'Copper',
        'Copper flange enquiries need an exact alloy designation, temper and construction. Pure copper and copper alloys do not share one mechanical or service specification.',
        [
            ['Material and manufacturing route', 'State the required copper designation and condition, and identify whether the component is a solid flange, a backing arrangement or another specified construction. Alloy chemistry, temper and product form affect the properties relevant to joint design.'],
            ['Joint loading and temperature', 'Review gasket seating load, bolting and operating temperature with the flange design. A bolt pattern that matches another flange does not establish equivalent stiffness or pressure capability. Installation and retightening requirements should come from the approved joint procedure.'],
            ['Corrosion and dissimilar materials', 'Include fluid chemistry, water treatment and neighbouring materials in the assessment. Galvanic effects and flow conditions can influence service performance. Specify surface condition, marking and material documentation rather than relying on colour to identify the alloy.']
        ],
        [['Material', 'Copper designation, temper and product form'], ['Construction', 'Solid flange or specified backing/stub-end assembly'], ['Joint', 'Gasket load, bolting and design temperatures'], ['Exposure', 'Fluid chemistry and dissimilar-material compatibility']],
        ['copper-nickel-flanges', 'aluminium-flanges', 'flat-face-flanges']),
    material('copper-nickel-flanges', 'Copper Nickel',
        'Copper-nickel flange enquiries must distinguish 90/10 and 70/30 alloy designations and identify which parts of the joint contact the process fluid.',
        [
            ['Specify the alloy, not only a ratio', '90/10 and 70/30 describe different copper-nickel alloy families. Provide the exact designation, applicable product specification and condition required by the project. A shorthand composition ratio alone is insufficient for material certification or substitution.'],
            ['Solid versus composite connection', 'Some connections use a copper-nickel stub end with a separate backing flange. The backing material is not the process-wetted alloy. Specify each component, the lap dimensions, gasket seating and the fit between the stub end and backing flange.'],
            ['Water service and commissioning', 'Water chemistry, flow, fouling and commissioning conditions need assessment for the selected alloy. Review mating materials and galvanic compatibility. A marine or seawater application label does not remove these checks or establish an unrestricted pressure-temperature rating.']
        ],
        [['Alloy', '90/10 or 70/30 with exact material designation'], ['Components', 'Wetted component and backing flange materials separately'], ['Service', 'Water chemistry, flow and commissioning requirements'], ['Interface', 'Lap dimensions, gasket seating and bolting']],
        ['copper-flanges', 'monel-flanges', 'lap-joint-facing']),
    material('aluminium-flanges', 'Aluminium',
        'Aluminium flange specifications need the alloy and temper together. Connection geometry, gasket loading and temperature must be checked for the selected material condition.',
        [
            ['Alloy, temper and product form', 'An aluminium alloy number without its temper may not identify the required mechanical condition. Specify the complete designation, product specification and manufacturing route. A machined appearance does not establish whether the component came from plate, a forging or another approved product form.'],
            ['Bolting and service temperature', 'Joint stiffness, gasket compression and thermal behaviour should be reviewed under the design basis. Do not transfer the pressure capability of a steel flange merely because the bolt pattern matches. Welding can also affect material condition and must be included in the design and fabrication requirements.'],
            ['Corrosion and surface protection', 'Check the process fluid and external environment, especially contact with dissimilar metals. Define coatings, isolation arrangements and surface finish where required. Protective treatments must be compatible with the gasket seating and any electrical or cleanliness requirements.']
        ],
        [['Designation', 'Alloy, temper and product specification'], ['Connection', 'Flange construction, facing and gasket seating requirements'], ['Design', 'Pressure, temperature and welding effects'], ['Protection', 'Galvanic compatibility, coating and isolation details']],
        ['copper-flanges', 'flange-pressure-ratings', 'flat-face-flanges']),
    standard('asme-b16-5-flanges', 'ASME B16.5',
        'An ASME B16.5 enquiry identifies the flange type, nominal size, class, material and facing under the specified edition. The standard name alone does not define a complete joint.',
        [
            ['Pipe-flange scope', 'ASME B16.5 addresses pipe flanges and flanged fittings within its stated scope. Confirm that the requested size, type, material and class are covered by the contract edition. Large-diameter flanges, orifice flanges and operational line blanks have distinct references and should not inherit a generic B16.5 description.'],
            ['Dimensions and pressure-temperature rating', 'Dimensional compatibility and pressure-temperature suitability are separate checks. Match the bolt pattern, bore and facing to the mating component, then verify the applicable rating using the material and design temperature. Class is a designation, not an allowable pressure in psi at every temperature.'],
            ['Enquiry and inspection', 'Specify the bore or pipe schedule where relevant, end preparation, surface finish and documentation. Identify any non-standard drilling, counterboring or other modification explicitly. Inspection requirements beyond the standard should be stated as project requirements with defined acceptance criteria.']
        ],
        [['Designation', 'ASME B16.5 edition, flange type, NPS and class'], ['Material', 'Complete material specification and grade'], ['Interface', 'Facing, bore, pipe schedule and end preparation'], ['Acceptance', 'Marking, dimensional inspection and documentation']],
        ['asme-b16-47-flanges', 'asme-b16-36-flanges', 'flange-pressure-ratings']),
    standard('asme-b16-47-flanges', 'ASME B16.47',
        'ASME B16.47 covers large-diameter steel flange requirements within its defined scope. Every enquiry must distinguish Series A from Series B.',
        [
            ['Choose the dimensional series', 'Series A and Series B are distinct dimensional systems within B16.47. The same nominal size and class do not establish interchangeability. Confirm the series from the mating flange specification or approved drawing rather than choosing it from a product photograph.'],
            ['Confirm the covered construction', 'Check the standard edition for the requested flange type, material, size and class. Do not assume that every B16.5 connection form has a corresponding B16.47 version. Any equipment-specific modification needs its own dimensional and design review.'],
            ['Handling and fit-up', 'Large flange assemblies need careful coordination of bore, weld preparation, gasket seating and bolt access. Provide the relevant pipe or nozzle drawing, installation constraints and inspection requirements. Shipping or lifting arrangements do not demonstrate the flange pressure rating.']
        ],
        [['Series', 'Explicit Series A or Series B designation'], ['Scope', 'Edition, type, nominal size, material and class'], ['Interface', 'Mating flange drawing, bore, facing and bolt pattern'], ['Project', 'Fit-up constraints and inspection requirements']],
        ['asme-b16-47-series-a-flanges', 'asme-b16-47-series-b-flanges', 'mss-sp-44-flanges']),
    standard('asme-b16-47-series-a-flanges', 'ASME B16.47 Series A',
        'Specify Series A explicitly when ordering a large-diameter flange to ASME B16.47. A matching nominal size does not make a Series B flange interchangeable.',
        [
            ['Identify the mating interface', 'Use the equipment or piping drawing to confirm that the joint is Series A. Record the nominal size, class, facing and material designation. For replacement work, measurements can support identification but should be reconciled with the original design records before procurement.'],
            ['Dimensions must remain within one series', 'Select the bolt circle, drilling, thickness and relevant hub or bore dimensions from the same applicable Series A requirements. Combining dimensions from Series A and Series B does not produce a standard flange. Non-standard deviations should be submitted as a controlled drawing.'],
            ['Related pipeline references', 'Series A has a historical relationship to pipeline flange practice, but an MSS SP-44 marking or reference is not a blanket statement of equivalence for every requirement. Compare the requested standards, editions and project supplements rather than silently substituting one designation.']
        ],
        [['Reference', 'ASME B16.47 edition with Series A stated'], ['Mating side', 'Verified Series A interface and facing'], ['Pipe side', 'Bore, schedule and weld preparation where applicable'], ['Deviations', 'Approved drawing for any non-standard dimension']],
        ['asme-b16-47-series-b-flanges', 'asme-b16-47-flanges', 'mss-sp-44-flanges']),
    standard('asme-b16-47-series-b-flanges', 'ASME B16.47 Series B',
        'Series B is a separate large-diameter flange series within ASME B16.47. Confirm its complete interface before ordering replacements or mating equipment.',
        [
            ['A distinct dimensional series', 'Series B should be identified on the purchase description and mating-component drawing. Do not select it solely because it may differ in mass or overall dimensions from another series. The flange, gasket and bolting must form a compatible specified joint.'],
            ['Replacement and legacy documentation', 'Older project documentation may reference historical API 605 practice. Verify the actual dimensions and the governing contract requirements before associating an old reference with a current B16.47 Series B enquiry. API 6A describes a different equipment domain and is not an alternative designation.'],
            ['Complete the design basis', 'State the flange type, size, class, material, bore and facing under the required edition. Confirm pressure-temperature suitability separately from dimensional matching. Include weld preparation and inspection details for a replacement or equipment connection.']
        ],
        [['Reference', 'ASME B16.47 edition and Series B'], ['Legacy records', 'Original drawing or historical designation when replacing a flange'], ['Joint', 'Facing, gasket, bolt pattern and bore'], ['Design', 'Material grade and pressure-temperature conditions']],
        ['asme-b16-47-series-a-flanges', 'asme-b16-47-flanges', 'api-6a-flanges']),
    standard('asme-b16-36-flanges', 'ASME B16.36',
        'ASME B16.36 is the flange reference for orifice-flange arrangements within its scope. It does not replace the design of the differential-pressure metering system.',
        [
            ['Flange pair and tappings', 'An orifice-flange enquiry should identify the matched pair, flange configuration, size, class and pressure-tapping requirements. Confirm the number, orientation and connections of the tappings and any associated assembly features. A general flange with unspecified drilled holes is not a complete orifice assembly.'],
            ['Metering requirements are separate', 'The orifice plate, pipe bore, straight lengths, instrumentation and flow-calculation basis require coordination with the metering design. The flange standard does not by itself establish measurement accuracy. Supply the instrument and assembly requirements with the flange enquiry.'],
            ['Assembly documentation', 'Specify plate and gasket details, tapping accessories, material traceability and inspection requirements. Identify which components are included in the requested scope. Confirm the contract edition and covered configuration rather than assuming all ordinary pipe-flange types and classes apply.']
        ],
        [['Flanges', 'B16.36 edition, configuration, size, class and material'], ['Tappings', 'Quantity, orientation and connection details'], ['Assembly', 'Plate, gaskets, accessories and included components'], ['Metering', 'Instrument requirements and approved assembly drawing']],
        ['asme-b16-5-flanges', 'raised-face-flanges', 'flange-pressure-ratings']),
    standard('asme-b16-48-line-blanks', 'ASME B16.48',
        'ASME B16.48 addresses operational line blanks within its scope. Distinguish a spectacle blind, a separate spade and a ring spacer from a bolted blind flange.',
        [
            ['Identify the line-blank arrangement', 'A spectacle blind combines an open ring and a solid blank. A separate spade provides the solid element, while a ring spacer provides an open flow path in the corresponding joint arrangement. Specify the actual form rather than using blind flange as a catch-all description.'],
            ['Fit within the flange joint', 'Confirm nominal size, class, material, facing and the surrounding flange and gasket arrangement against the specified edition. The blank or spacer must fit the intended joint. Dimensions taken from a bolted blind flange are not a substitute for the line-blank requirements.'],
            ['Operational and safety requirements', 'Changing a line blank is an isolation operation governed by the site procedure and an approved work system. An enquiry guide is not a procedure for working on a pressurised line. Provide identification, handling and inspection requirements with the engineering specification.']
        ],
        [['Form', 'Spectacle blind, spade or ring spacer'], ['Reference', 'B16.48 edition, size, class and material'], ['Joint', 'Facing, gaskets and mating flange arrangement'], ['Project', 'Identification, drawing and inspection requirements']],
        ['asme-b16-5-flanges', 'raised-face-flanges', 'flange-types-guide']),
    standard('mss-sp-44-flanges', 'MSS SP-44',
        'MSS SP-44 is a steel pipeline flange reference. Specify the edition and project design requirements rather than treating it as a universal synonym for another flange standard.',
        [
            ['Pipeline design context', 'Confirm the required type, size, class, material properties and service conditions under the specified edition. Pipeline loads, pipe strength and weld compatibility can affect the design and procurement requirements. A nominal flange designation alone does not resolve the pipe-to-flange interface.'],
            ['Relationship to other standards', 'A historical relationship with other pipeline or large-diameter flange practices does not establish full interchangeability. Compare dimensional scope, materials, testing and any project supplements when more than one standard is referenced. State which document governs a conflicting requirement.'],
            ['Pipe and inspection details', 'Provide pipe outside diameter, wall thickness, grade and weld-preparation requirements. Include required heat treatment, material traceability and inspection records. Confirm the gasket seating and bolting arrangement as part of the complete connection.']
        ],
        [['Reference', 'MSS SP-44 edition and project supplements'], ['Pipe', 'Outside diameter, wall, grade and weld preparation'], ['Flange', 'Type, size, class, material and facing'], ['Inspection', 'Heat treatment, testing and required records']],
        ['asme-b16-47-series-a-flanges', 'asme-b16-47-flanges', 'carbon-steel-flanges']),
    standard('en-1092-1-flanges', 'EN 1092-1',
        'EN 1092-1 flange enquiries use a steel flange type, DN and PN designation together with the exact material and facing requirements.',
        [
            ['State the flange type', 'The type designation distinguishes constructions such as plate, weld-neck and other covered arrangements. DN and PN alone do not identify the component. Confirm the type, material and scope under the contract edition and use the corresponding dimensions consistently.'],
            ['Facing and temperature', 'Specify the required facing designation and surface finish, and confirm the gasket and mating side. PN is a nominal designation; allowable operating pressure depends on the applicable material and design-temperature requirements. It should not be converted to another standard by a simple label substitution.'],
            ['Legacy DIN references', 'Older drawings may use a DIN flange number. Establish the intended type and dimensions before specifying a current EN requirement. Do not assume that every historical DIN callout maps directly to one EN type without reviewing the edition and project details.']
        ],
        [['Designation', 'EN 1092-1 edition, type, DN and PN'], ['Material', 'Complete steel designation and condition'], ['Facing', 'Facing code, finish and mating gasket'], ['Legacy data', 'Original DIN drawing or requirement where applicable']],
        ['din-flanges', 'bs-4504-flanges', 'flange-pressure-ratings']),
    standard('din-flanges', 'DIN',
        'DIN describes a standards system, not one flange specification. A DIN flange enquiry needs the full standard number, edition and dimensional designation.',
        [
            ['Recover the complete callout', 'Obtain the complete DIN reference from the drawing, component marking or project specification. Identify nominal size, pressure designation, flange form and material. A photograph of a circular bolt pattern cannot establish the applicable DIN standard.'],
            ['Current and historical requirements', 'Some legacy DIN flange requirements have relationships to later European standards. Determine whether the contract calls for the original requirement or a specified replacement. A replacement standard should not be assumed solely because it is newer or more readily available.'],
            ['Compare the interface', 'Check drilling, outside diameter, thickness, hub or collar arrangement, facing and bore against the mating component. Document deviations in an approved drawing. Keep the material, temperature and pressure-design review separate from the exercise of matching physical dimensions.']
        ],
        [['Reference', 'Full DIN number, edition and status required by the contract'], ['Designation', 'Nominal size, pressure designation and flange form'], ['Interface', 'Facing, bore and complete bolt pattern'], ['Replacement', 'Original drawing and any approved EN substitution']],
        ['en-1092-1-flanges', 'bs-4504-flanges', 'flange-types-guide']),
    standard('bs-4504-flanges', 'BS 4504',
        'BS 4504 is a legacy flange reference that needs its full designation and contractual context. Confirm whether the project requires the original dimensions or a specified successor standard.',
        [
            ['Identify the legacy requirement', 'Recover the applicable part, edition, material and flange designation from the project records. The phrase BS 4504 alone may not resolve the exact construction or mating surface. Replacement enquiries should include a drawing or a complete verified interface description.'],
            ['Do not silently substitute', 'European flange standards may be relevant to replacement work, but the relationship must be reviewed for the requested type and material. Compare dimensions, facing, rating basis and material requirements before proposing substitution. Record any departure from the original requirement.'],
            ['Enquiry information', 'State nominal size, pressure designation, pipe connection and gasket arrangement. Include design temperatures, material condition and required inspection records. Where records are incomplete, request an engineering review instead of identifying the flange from a few approximate measurements.']
        ],
        [['Legacy reference', 'BS 4504 part, edition and full designation'], ['Interface', 'Nominal size, facing, drilling and pipe connection'], ['Material', 'Material specification and design temperatures'], ['Change control', 'Approved replacement standard or drawing, if applicable']],
        ['en-1092-1-flanges', 'bs-10-flanges', 'din-flanges']),
    standard('bs-10-flanges', 'BS 10',
        'BS 10 flange enquiries must state the applicable table as well as the nominal size. A table designation is not interchangeable with an ASME class or a PN label.',
        [
            ['Table-based identification', 'The table is an essential part of the flange designation. Obtain it from the project specification or original drawing along with the flange material and construction. Matching only the nominal size leaves drilling, thickness and other interface requirements unresolved.'],
            ['Physical fit is not a rating assessment', 'Verify the flange and mating component dimensions under the required edition. A flange that can be bolted to another component is not thereby suitable for its operating conditions. Review pressure, temperature, material and gasket loading under the applicable design basis.'],
            ['Replacement work', 'Record the existing flange dimensions, facing, pipe connection and any site modifications. Resolve missing or conflicting information through the engineering specification. Do not relabel a table flange as PN or ASME Class solely to simplify ordering.']
        ],
        [['Designation', 'BS 10 edition, table and nominal size'], ['Construction', 'Material, pipe connection and flange form'], ['Interface', 'Facing, drilling and mating component drawing'], ['Service', 'Design pressure, temperature and gasket requirements']],
        ['as-2129-flanges', 'bs-4504-flanges', 'flange-pressure-ratings']),
    standard('awwa-c207-flanges', 'AWWA C207',
        'AWWA C207 flange enquiries concern steel pipe flanges for waterworks service within the standard scope. Its class designations should not be treated as ASME classes.',
        [
            ['Waterworks connection requirements', 'Identify the flange form, nominal size, class and material under the required edition. Provide the pipe outside diameter and the actual connection arrangement. Waterworks flange selection must consider the piping and equipment interface, not just a familiar drilling pattern.'],
            ['Pressure and design conditions', 'Confirm the applicable pressure limits and project conditions using the required standard and engineering specification. Temperature, surge and other design considerations should be addressed by the responsible designer. AWWA and ASME class designations are not equivalent labels.'],
            ['Fabrication and coating', 'State weld details, facing and gasket requirements together with dimensional inspection. Water-contact coatings or linings may have project-specific requirements. Define the treatment of seating surfaces, bolt holes and other areas where coating could affect the joint.']
        ],
        [['Reference', 'AWWA C207 edition, flange form, size and class'], ['Pipe', 'Outside diameter and connection or weld details'], ['Service', 'Waterworks design conditions and project supplements'], ['Finish', 'Gasket seating, coating/lining and inspection requirements']],
        ['carbon-steel-flanges', 'flat-face-flanges', 'flange-pressure-ratings']),
    standard('api-6a-flanges', 'API 6A',
        'API 6A flange connections belong to wellhead and tree equipment requirements. They are not general pipe flanges or a modern name for historical API 605 flanges.',
        [
            ['Equipment connection identity', 'Use the equipment specification to identify the exact connection type, size and pressure designation. Confirm the applicable API 6A edition and all required equipment or product levels and classes. The connection cannot be selected from a generic flange-size list.'],
            ['Seal and mating geometry', 'The mating connection and specified sealing system must be coordinated as an assembly. Ring or groove designations from another flange system must not be substituted by appearance. Obtain the equipment drawing, gasket requirements and relevant acceptance criteria.'],
            ['Scope and certification', 'A reference to API 6A on an enquiry is not evidence of a supplier licence, certification or product compliance. Define the exact manufacturing, testing, documentation and marking requirements for the order. Confirm the offered scope before making any approval or monogram claim.']
        ],
        [['Connection', 'Equipment drawing, exact type, size and pressure designation'], ['Requirements', 'Edition and all specified API 6A levels/classes'], ['Sealing', 'Mating geometry and required gasket/ring designation'], ['Records', 'Testing, traceability, marking and certification requirements']],
        ['rtj-flanges', 'asme-b16-47-series-b-flanges', 'flange-standards']),
    standard('jis-flanges', 'JIS',
        'A JIS flange enquiry needs the complete standard number and edition, not only a nominal size and a K designation.',
        [
            ['Identify the specific standard', 'State the full JIS reference, flange type, nominal size, material and rating designation. Different references may have different scope and material requirements. A general Japanese-standard description does not define the exact connection to manufacture or inspect.'],
            ['Match the interface consistently', 'Check drilling, bore, facing and thickness against the required standard and mating drawing. Do not convert a K designation into an ASME class or PN number and assume dimensional compatibility. Each system needs its own verification.'],
            ['Material and documentation', 'Provide the required material designation, condition and design temperatures. Identify the project inspection and documentation requirements, including any approved material equivalence. Equivalent-material proposals need review beyond a similar commercial grade name.']
        ],
        [['Reference', 'Full JIS number and edition'], ['Designation', 'Type, nominal size and rating designation'], ['Interface', 'Facing, bore, drilling and mating drawing'], ['Material', 'Exact designation, condition and approved equivalences']],
        ['en-1092-1-flanges', 'asme-b16-5-flanges', 'flange-pressure-ratings']),
    standard('sans-1123-flanges', 'SANS 1123 / SABS 1123',
        'State the required SANS 1123 designation and edition, or the exact historical SABS reference where specified. Current and legacy names should be reconciled in the enquiry.',
        [
            ['Resolve the document reference', 'Existing equipment records may use SABS naming while a current procurement specification uses SANS. Identify the exact edition and designation governing the replacement. Do not assume that a naming change alone establishes every dimensional or material requirement.'],
            ['Flange and facing details', 'Specify the flange form, nominal size, pressure designation, material and facing. Check drilling and the pipe or equipment interface against the mating drawing. Include any departure from standard dimensions as an explicit project requirement.'],
            ['Rating and inspection', 'Review the service pressure and temperature under the applicable material and standard requirements. Request traceability, dimensional checks and any supplementary inspection needed by the project. Similar bolt patterns in another flange system do not justify automatic substitution.']
        ],
        [['Document', 'Exact SANS/SABS reference and edition'], ['Flange', 'Type, nominal size, pressure designation and material'], ['Interface', 'Facing, bore and mating dimensions'], ['Acceptance', 'Design conditions, traceability and inspection requirements']],
        ['bs-4504-flanges', 'en-1092-1-flanges', 'flange-pressure-ratings']),
    standard('gost-flanges', 'GOST',
        'GOST is a standards family. A flange enquiry requires the exact GOST number, edition and designation to identify the intended connection.',
        [
            ['Complete the standard designation', 'Obtain the full reference from the project specification or original equipment records. Identify the flange type, nominal size, pressure designation and material. A country or regional origin is not a substitute for the governing dimensional and material requirements.'],
            ['Mating surface and dimensions', 'Facing designs and designation systems need to be checked against the specified document. Record the mating face, bolt pattern, bore and required pipe connection. Do not infer equivalence to EN, DIN or ASME flanges from nominal size alone.'],
            ['Procurement translation and records', 'Keep the original technical designations with any translated enquiry so numbers and grade suffixes are not lost. Confirm material substitutions, inspection records and marking language where relevant. Resolve any conflict between a drawing and the named standard before manufacture.']
        ],
        [['Reference', 'Full GOST number, edition and flange designation'], ['Geometry', 'Facing, bore, drilling and connection type'], ['Material', 'Original material designation and approved substitutions'], ['Records', 'Drawing revision, inspection and marking requirements']],
        ['en-1092-1-flanges', 'din-flanges', 'flange-types-guide']),
    standard('as-2129-flanges', 'AS 2129',
        'AS 2129 flange enquiries must specify the applicable table, material and connection form. Table designations cannot be replaced with an assumed PN or ASME class.',
        [
            ['Table and construction', 'State the table, nominal size, material and flange type under the contract edition. These details determine the intended scope and dimensional reference. A matching nominal pipe size does not establish the required drilling, thickness or pipe connection.'],
            ['Service and compatibility', 'Check the applicable pressure-temperature requirements for the specified material and design conditions. Review the mating flange and gasket as a complete joint. Connections from another table-based system should be compared explicitly rather than treated as automatically equivalent.'],
            ['Replacement information', 'Provide original drawings or a verified interface record for existing plant connections. Include facing, bore and any known modifications. Define inspection, material documentation and change approval before using a proposed substitute standard or material.']
        ],
        [['Designation', 'AS 2129 edition, table and nominal size'], ['Construction', 'Material and flange/pipe connection type'], ['Interface', 'Facing, gasket, drilling and bore'], ['Project', 'Design conditions and approved replacement details']],
        ['bs-10-flanges', 'flange-pressure-ratings', 'flat-face-flanges']),
    standard('uni-flanges', 'UNI',
        'UNI identifies a standards system, not one universal flange design. State the full UNI number, edition and flange designation for a useful enquiry.',
        [
            ['Recover the exact reference', 'Identify the flange type, nominal size, pressure designation and material alongside the complete UNI standard number. A short legacy callout may leave the facing or manufacturing route unresolved. Original equipment drawings are particularly useful for replacement enquiries.'],
            ['Current and legacy standards', 'Determine whether the requirement is an original UNI specification or a specified European replacement. Compare scope, dimensions, materials and facing requirements before substitution. Keep the contractual standard and any approved deviation visible on the enquiry.'],
            ['Coordinate the joint', 'Verify the flange-to-pipe connection, mating face, gasket and bolt pattern. Material suitability and pressure-temperature capability require a separate design review. State traceability and inspection requirements so dimensional matching is not mistaken for complete technical compliance.']
        ],
        [['Document', 'Full UNI number, edition and legacy/current requirement'], ['Designation', 'Type, nominal size, pressure designation and material'], ['Joint', 'Facing, bore, bolt pattern and mating drawing'], ['Approval', 'Any replacement standard or non-standard deviation']],
        ['en-1092-1-flanges', 'din-flanges', 'flange-standards']),
    facing('raised-face-flanges', 'Raised Face (RF)', 'raised-face',
        'A raised face provides a gasket seating surface inside the bolt circle. Specify the face dimensions, finish and gasket as a coordinated joint requirement.',
        [
            ['Raised gasket seating', 'The raised portion concentrates the gasket seating within the designated sealing area. Its height and dimensions depend on the applicable flange standard and designation. Do not infer these dimensions from a photograph or assume one raised-face geometry applies across every class and standard.'],
            ['Gasket and surface finish', 'Specify the gasket type, dimensions and required facing finish. Surface texture must be compatible with the selected gasket and the assembly requirements. A visibly machined surface is not evidence that its roughness, serration or condition meets the project specification.'],
            ['Mating compatibility', 'Confirm both flange faces and the approved joint assembly. Mixing raised and flat faces can create an unsuitable loading arrangement, particularly where flange materials have different stiffness or brittleness. The designer must approve the complete gasket, flange and bolting combination.']
        ],
        [['Facing', 'RF dimensions under the exact flange standard and designation'], ['Gasket', 'Type, material, inside/outside dimensions and thickness'], ['Finish', 'Required surface texture and acceptance criteria'], ['Assembly', 'Mating face, flange material and bolting procedure']],
        ['flat-face-flanges', 'rtj-flanges', 'asme-b16-5-flanges']),
    facing('flat-face-flanges', 'Flat Face (FF)', 'flat-face',
        'A flat face has no raised gasket seating step. Confirm the gasket coverage, mating flange material and joint loading rather than identifying it only by appearance.',
        [
            ['A face form, not a manufacturing route', 'Flat face describes the mating surface. It does not mean the flange is necessarily made from plate or identify its material. Specify the flange type and construction separately from the FF designation and verify the governing dimensions.'],
            ['Gasket coverage and material', 'Full-face gaskets are associated with many flat-face arrangements, but the required gasket must come from the approved joint specification. Gasket material, thickness, bolt holes and seating load need to suit the actual flange pair. The diagram is not a universal gasket selection rule.'],
            ['Avoid unreviewed mixed-face joints', 'Do not mate a flat-face component to a raised-face flange without approval of the resulting load path. Flange material, thickness and stiffness influence the response to bolt tightening. Confirm compatibility with the equipment manufacturer or responsible designer for the complete assembly.']
        ],
        [['Flange', 'Type, construction, material and applicable standard'], ['Face', 'Flat-face dimensions and required finish'], ['Gasket', 'Approved coverage, material, thickness and bolt-hole pattern'], ['Joint', 'Mating face and permitted assembly loading']],
        ['raised-face-flanges', 'awwa-c207-flanges', 'flange-pressure-ratings']),
    facing('rtj-flanges', 'Ring Type Joint (RTJ)', 'rtj',
        'An RTJ face uses a machined groove and a matching metal ring gasket. Ring and groove designations must be specified as a system, not chosen by nominal pipe size alone.',
        [
            ['Groove and ring identity', 'Identify the required groove dimensions and gasket designation from the governing flange and gasket specifications. Different ring-joint systems are not automatically interchangeable. A ring that appears to fit is not evidence of correct sealing contact or permitted deformation.'],
            ['Material and surface condition', 'Specify gasket material and any hardness relationship or other requirements under the approved joint design. Groove finish, damage and cleanliness matter to sealing performance. Inspection criteria should be stated explicitly rather than relying on a general polished-metal description.'],
            ['Standard-specific assembly', 'RTJ arrangements occur in more than one equipment and flange system. ASME and API references need their own applicable connection and gasket requirements. Follow the approved installation and replacement procedure; the schematic is not an assembly instruction or a reusable-gasket recommendation.']
        ],
        [['System', 'Flange standard, connection designation and groove details'], ['Ring', 'Exact gasket designation and dimensions'], ['Materials', 'Gasket and flange materials with specified hardness requirements'], ['Inspection', 'Groove finish, condition and acceptance criteria']],
        ['raised-face-flanges', 'api-6a-flanges', 'asme-b16-5-flanges']),
    facing('tongue-and-groove-flanges', 'Tongue and Groove', 'tongue-and-groove',
        'A tongue-and-groove joint pairs a projecting tongue with a matching groove. The two faces and the confined gasket dimensions must be specified together.',
        [
            ['A matched facing pair', 'The tongue enters the mating groove around the bore. Request the complete pair or identify which half is needed for replacement. The tongue and groove widths, depths and diameters are governed by the selected standard or approved drawing.'],
            ['Gasket confinement', 'The gasket occupies the specified sealing region within the joint. Its dimensions and compressed behaviour must suit the available space. Do not substitute a generic full-face or raised-face gasket without engineering approval of the seating arrangement.'],
            ['Different from male and female', 'Tongue-and-groove and male-and-female facings describe distinct mating geometries. The terms should not be used interchangeably on an order. Confirm the exact facing designation and dimensions, especially where only one existing flange is available for inspection.']
        ],
        [['Pair', 'Tongue side, groove side or complete mating set'], ['Geometry', 'Facing diameters, tongue/groove widths and depths'], ['Gasket', 'Dimensions, material and compression requirements'], ['Reference', 'Standard/edition or approved mating drawing']],
        ['male-and-female-flanges', 'raised-face-flanges', 'flange-types-guide']),
    facing('male-and-female-flanges', 'Male and Female', 'male-and-female',
        'A projecting male face mates with a recessed female face. Specify the full seating geometry and gasket requirements rather than substituting tongue-and-groove terminology.',
        [
            ['Projecting and recessed faces', 'The male projection and female recess form a matched pair with defined seating diameters and depths. The facing name alone does not resolve the dimensions or identify the governing standard. Record the exact designation or approved equipment drawing.'],
            ['Joint clearance and gasket', 'The gasket and mating clearances must be compatible with the intended compression and bolt loading. Confirm which dimensions apply to the gasket seat and which establish location or clearance. A visual match of two recesses is not a dimensional acceptance check.'],
            ['Replacement control', 'Identify whether the enquiry is for the male half, female half or both components. Include the mating-flange details and any known modifications. Do not pair parts from different standards on the basis of the same nominal size without a complete interface review.']
        ],
        [['Mating side', 'Male, female or matched pair'], ['Facing', 'Projection/recess diameters, depth and clearance'], ['Gasket', 'Seating dimensions, material and required compression'], ['Records', 'Governing standard and mating-flange drawing']],
        ['tongue-and-groove-flanges', 'rtj-flanges', 'flange-types-guide']),
    facing('lap-joint-facing', 'Lap Joint Assembly', 'lap-joint',
        'In a lap-joint assembly, the stub end provides the gasket seating surface. The separate backing flange transfers bolt load and can rotate for alignment before tightening.',
        [
            ['Separate the component roles', 'The backing flange and stub end are distinct components. The backing flange does not normally form the process-wetted gasket seat. Specify the material and dimensions of each part rather than assigning the stub-end material to the complete assembly by default.'],
            ['Fit between the lap and backing flange', 'The stub-end lap thickness, outside diameter and corner geometry must suit the backing flange. Bore clearance and the seating contact need to be checked as an assembly. A generic loose-ring photograph cannot establish compatibility with a particular stub end.'],
            ['Gasket and mating joint', 'The gasket specification follows the stub-end seating surface and mating connection. Include pipe wall thickness, weld preparation and the required finish on the lap face. Rotation assists alignment during assembly; it is not a swivel-joint function for an operating pipeline.']
        ],
        [['Components', 'Backing flange and stub-end designations separately'], ['Materials', 'Process-wetted stub end and backing flange materials'], ['Fit', 'Lap diameter, thickness, corner radius and bore clearance'], ['Joint', 'Gasket seat, finish, pipe wall and mating flange']],
        ['copper-nickel-flanges', 'titanium-flanges', 'flange-types-guide']),
    {
        slug: 'flange-types-guide', name: 'Flange Type Selection', title: 'Flange Types Guide', kind: 'guide',
        intro: 'Start with the pipe or equipment connection, then choose a flange form that fits the design and maintenance requirements. A flange name does not select its material or rating.',
        sections: [
            ['Welded connection forms', 'A weld neck transfers the pipe connection through a tapered hub to a butt weld. A slip-on form fits over the pipe and uses the specified fillet-weld arrangement. A socket-weld form receives the pipe in a recessed socket. These constructions require different bore, pipe-wall and weld details; they are not interchangeable simply because the bolted faces match.'],
            ['Mechanical and backing arrangements', 'Threaded flanges connect to a compatible pipe thread, which must be identified by its standard and size. A lap-joint backing flange works with a separate stub end and can rotate for bolt alignment before tightening. Companion describes a flange selected to mate with another connection; it does not identify one universal pipe-side construction.'],
            ['Closures, measurement and equipment nozzles', 'A blind flange closes a bolted opening. Operational line blanks instead fit within an appropriate joint arrangement. Orifice flanges include the specified pressure-tapping connections for a coordinated metering assembly. Long weld-neck and equipment-specific connections need the actual nozzle projection, bore and fabrication drawing.'],
            ['Complete the joint specification', 'After choosing the connection form, confirm the material, dimensional standard, facing, gasket, pressure-temperature design basis and inspection requirements. Compatibility must be checked at both the pipe connection and the mating flange. Use an approved drawing for any feature outside the selected standard.']
        ],
        checks: [['Pipe interface', 'Butt weld, slip-on, socket weld, thread or stub-end arrangement'], ['Mating face', 'Facing type, gasket seat and bolt pattern'], ['Design', 'Material, pressure-temperature conditions and external loads'], ['Project', 'Access, inspection, maintenance and drawing requirements']],
        related: ['weld-neck-flanges', 'slip-on-flanges', 'socket-weld-flanges', 'threaded-flanges', 'lap-joint-flanges', 'blind-flanges', 'orifice-flanges', 'long-weld-neck-flanges', 'companion-flanges', 'flange-pressure-ratings', 'flange-material-selection'],
        image: 'img/flanges/weld-neck.png', alt: 'Weld-neck flange with a tapered hub and bolt holes',
        caption: 'Weld-neck connection example. Other flange forms have different pipe-side geometry; compare the individual product pages.'
    },
    {
        slug: 'flange-pressure-ratings', name: 'Pressure and Temperature', title: 'Flange Pressure Ratings', kind: 'guide',
        intro: 'A flange class, PN designation or table is not a universal allowable pressure. The design must use the specified standard, material and temperature together.',
        sections: [
            ['Rating designations are not direct conversions', 'ASME Class, PN, JIS rating designations and table-based systems use different definitions and dimensional requirements. Matching or converting a number does not establish physical interchangeability. A Class designation must not be read as an allowable pressure in psi at all temperatures, and PN must not be used as an unrestricted operating-pressure limit.'],
            ['Use the correct material and temperature basis', 'Identify the governing standard and edition, then the applicable material and rating requirements for the design temperature. Consider the full design-temperature range and required material condition. No numerical rating table is supplied here: the engineer must use the governing technical documents and project design basis.'],
            ['Check the complete assembly', 'The pressure boundary includes the flange pair, pipe or nozzle, gasket, bolting and any interposed component. A higher-rated individual flange does not automatically increase the allowable conditions of the assembly. External loads, thermal cycling, corrosion allowance and other project requirements may require additional design checks.'],
            ['Keep operating, design and test conditions distinct', 'Normal operating pressure, design pressure and an inspection or test pressure serve different purposes. A hydrostatic test value is not permission to operate continuously at that pressure. Identify the required test procedure and acceptance criteria separately from the operating and design conditions.']
        ],
        checks: [['Standard', 'Exact edition and flange/rating designation'], ['Material', 'Specification, grade, condition and applicable rating group'], ['Conditions', 'Design pressure, temperature range and relevant external loads'], ['Assembly', 'Gasket, bolting, mating components and testing requirements']],
        related: ['asme-b16-5-flanges', 'asme-b16-47-flanges', 'en-1092-1-flanges', 'bs-10-flanges', 'flange-material-selection']
    },
    {
        slug: 'flange-material-selection', name: 'Material Selection', title: 'Flange Material Selection', kind: 'guide',
        intro: 'Choose a flange material from the service and fabrication requirements, then define the exact grade and product specification. A photograph or broad alloy family cannot establish suitability.',
        sections: [
            ['Describe the service before choosing a grade', 'Provide fluid composition, concentration, contaminants, temperature range and pressure. Include external exposure, cleaning chemicals, startup and shutdown conditions. Corrosion mechanisms, low-temperature toughness and high-temperature performance require different checks; there is no single best material for every flange connection.'],
            ['Identify every component in the joint', 'Distinguish the flange, pipe, stub end, gasket and bolting materials. In a lap-joint arrangement the backing flange may not be process-wetted, while the stub end is. Review dissimilar-material contacts and welding compatibility. A corrosion-resistant flange alone does not establish the durability of the complete joint.'],
            ['Define product form and material condition', 'State the applicable forging, plate or other product specification with the exact grade and required heat treatment or temper. Alloy composition, product form and condition are separate procurement details. A similar commercial name or chemical composition does not justify an unapproved substitution.'],
            ['Agree evidence and acceptance requirements', 'Specify traceability, material documentation and any additional testing with named acceptance criteria. Positive material identification, mechanical tests and corrosion tests answer different questions and do not replace one another. Confirm offered scope and technical suitability before releasing an order.']
        ],
        checks: [['Environment', 'Fluid chemistry, temperatures, pressure and external exposure'], ['Material', 'Exact grade, product specification and required condition'], ['Fabrication', 'Weld compatibility, heat treatment and surface controls'], ['Evidence', 'Traceability, test methods and project acceptance criteria']],
        related: ['carbon-steel-flanges', 'stainless-steel-flanges', 'duplex-steel-flanges', 'nickel-flanges', 'copper-nickel-flanges', 'flange-pressure-ratings'],
        image: 'img/flanges/3_lap-joint-flanges.jpg', alt: 'Lap-joint flange and stub-end assembly reference',
        caption: 'Assembly reference only. Specify the wetted stub end and backing flange materials separately; their grades cannot be identified from this image.'
    }
].map(reference => ({
    image: 'img/flanges/slip-on-flanges.jpg',
    alt: 'Flange geometry with an open bore, bolt circle and gasket seating surface',
    caption: 'Flange geometry reference only; appearance does not establish material grade, standard compliance or available stock.',
    ...reference
})).map(reference => reference.slug === 'asme-b16-48-line-blanks' ? {
    ...reference, image: 'img/flanges/reference/line-blanks.png', alt: 'Original schematic comparing a spectacle blind, spade and ring spacer',
    caption: 'Original, non-dimensional line-blank schematic. It does not reproduce ASME dimensions or establish a rating.'
} : reference.slug === 'asme-b16-36-flanges' ? {
    ...reference, image: 'img/flanges/orifice_eng.jpg', alt: 'Orifice-flange sectional reference showing pressure tapping',
    caption: 'Existing orifice-flange drawing used as a connection reference. Confirm all dimensions against the project standard and drawing.'
} : reference);
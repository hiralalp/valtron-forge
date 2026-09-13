export const additionalProducts = [
    {
        slug: 'plate-flanges', name: 'Plate Flanges', group: 'Construction & special designs', aliases: 'plate ring flat plate flange',
        intro: 'A plate flange is a ring-shaped component made from plate, with an open bore and a bolt pattern specified for the mating connection. Plate construction is distinct from a flat gasket facing.',
        detail: 'Plate thickness, material specification and the pipe attachment determine how this construction can be used. A ring cut from plate must not inherit the ratings of a forged flange simply because its bolt holes match. State the governing design basis and intended service with the enquiry.',
        caption: 'Original plate-ring schematic, not to scale. The front view does not establish material, thickness, rating or manufacturing route.',
        sections: [['Construction and attachment', 'Define whether the ring is welded to the pipe or used in another approved assembly. The bore clearance, weld arrangement and required inspection follow that construction, rather than a generic flange name.'], ['Flat face is a separate choice', 'A plate flange may have a specified flat seating surface, but flat-face terminology alone does not identify plate material or manufacture. Confirm both the construction and the gasket-contact requirements.']],
        applications: ['Drawing-specified fabricated connections', 'Waterworks joints under an applicable design standard', 'Equipment interfaces requiring a plate-ring construction'],
        checks: [['Material', 'State the plate specification, grade and thickness'], ['Attachment', 'Identify the pipe connection and weld details'], ['Interface', 'Provide outside diameter, bore, bolt circle and hole pattern'], ['Design basis', 'Specify the applicable standard or approved calculation and drawing']],
        related: ['slip-on-flanges', 'loose-flanges', 'forged-flanges']
    },
    {
        slug: 'reducing-flanges', name: 'Reducing Flanges', group: 'Welded connections', aliases: 'reducing reduced bore transition asme b16.5',
        intro: 'A reducing flange combines a larger mating-flange interface with a smaller pipe connection or bore. Both the mating size and the reduced connection must be identified.',
        detail: 'The reduction can be incorporated into different flange constructions. A smaller opening in a familiar bolt pattern does not by itself establish pressure suitability or a standard design. Specify the actual hub, bore and pipe-side arrangement, including the transition where one is required.',
        caption: 'Original reduced-bore front-view concept, not to scale. The hub, pipe attachment and reduction dimensions require a specified design.',
        sections: [['Two sizes, one interface', 'Identify the larger flange designation separately from the smaller connected pipe size and wall. This avoids confusing a reducing flange with a separate reducer installed next to an ordinary flange.'], ['Confirm the permitted construction', 'Where ASME B16.5 is specified, confirm the reducing configuration and applicable requirements under the stated edition. Non-standard transitions require their own approved design basis.']],
        applications: ['Connections between differently sized equipment and pipework', 'Compact reductions at a flanged interface', 'Replacement joints with a specified reduced bore'],
        checks: [['Mating size', 'State flange nominal size, rating and facing'], ['Reduced connection', 'Specify smaller pipe size, schedule and bore'], ['Construction', 'Identify weld neck, slip-on or another required arrangement'], ['Transition', 'Provide hub geometry, end preparation and design basis']],
        related: ['expander-flanges', 'weld-neck-flanges', 'slip-on-flanges']
    },
    {
        slug: 'weldo-flanges', name: 'Weldo Flanges', group: 'Branch connections', aliases: 'weldo weldoflange weldolet branch outlet',
        intro: 'A Weldo flange combines a flanged branch connection with a weld-on outlet form at the run pipe. The branch-to-run interface is a defining part of the requirement.',
        detail: 'Specify the run pipe and branch independently, together with the outlet contour, reinforcement and branch projection. The flanged end and the attachment to the run pipe have different design checks. A flange-standard designation alone does not qualify the complete branch connection.',
        caption: 'Original conceptual flanged-branch section with a contoured run-pipe attachment. Not a proprietary Weldo design or a manufacturing drawing.',
        sections: [['Run-pipe fit and reinforcement', 'Provide run outside diameter, wall thickness and branch orientation. The outlet contour, reinforcement and attachment weld must be reviewed under the applicable piping design requirements.'], ['Distinguish Weldo from Nipo', 'Commercial naming can vary between suppliers. This enquiry uses Weldo for the compact outlet-style form; specify a controlled profile drawing rather than relying on the name to establish the offered geometry.']],
        applications: ['Flanged instrument or process branches', 'Compact weld-on run-pipe outlets', 'Branch assemblies defined by piping drawings'],
        checks: [['Run pipe', 'Outside diameter, schedule, material and orientation'], ['Branch', 'Nominal size, bore, projection and flange interface'], ['Attachment', 'Outlet contour, weld preparation and reinforcement basis'], ['Inspection', 'Required weld examination, material records and acceptance criteria']],
        related: ['nipo-flanges', 'long-weld-neck-flanges', 'weld-neck-flanges']
    },
    {
        slug: 'nipo-flanges', name: 'Nipo Flanges', group: 'Branch connections', aliases: 'nipo nipoflange nipolet extended branch outlet',
        intro: 'A Nipo flange is a flanged branch-outlet form with a nipple-like extended neck. Projection and the run-pipe attachment must be defined as part of the complete branch.',
        detail: 'The extended branch can provide separation between the run pipe and the bolted interface, but its length is a design input rather than a universal catalogue dimension. Include loads, clearance and the attachment configuration. Confirm the supplier terminology against a profile drawing.',
        caption: 'Original extended flanged-branch concept, not to scale. Projection and attachment are illustrative, not a standardised Nipo geometry.',
        sections: [['Projection and clearance', 'Define projection from a stated datum, such as the run-pipe surface or centreline. Account for insulation, bolt access and the connected equipment without assuming that any extended neck is acceptable.'], ['Branch design remains essential', 'An extended neck does not replace the run-pipe reinforcement and attachment assessment. Specify the piping code, run wall, weld detail and inspection scope together with the flanged-end standard.']],
        applications: ['Flanged branches requiring additional projection', 'Instrument interfaces with clearance constraints', 'Drawing-led extended outlet assemblies'],
        checks: [['Run interface', 'Pipe outside diameter, wall and attachment contour'], ['Projection', 'Required length and measurement datum'], ['Flanged end', 'Size, class, facing, bore and bolt pattern'], ['Design conditions', 'Pressure, temperature, loads and branch design basis']],
        related: ['weldo-flanges', 'long-weld-neck-flanges', 'weld-neck-flanges']
    },
    {
        slug: 'forged-flanges', name: 'Forged Flanges', group: 'Construction & special designs', aliases: 'forged forging asme b16.5 forged flange',
        intro: 'Forged flanges describe a manufacturing route spanning several connection forms, including weld neck, slip-on and blind. The flange type must still be specified.',
        detail: 'A forging requirement belongs with a material product specification, heat-treatment condition and finished flange drawing or standard. Appearance cannot establish that a component was forged, nor prove its grade or mechanical properties. Required records must be agreed for the specific order.',
        caption: 'Original examples of finished flange forms. This illustration does not demonstrate a forging process, material grade or certification.',
        sections: [['Manufacturing route and material', 'State the relevant forging specification and grade, together with heat treatment and supplementary requirements. A material-family name such as stainless steel is not a complete forging specification.'], ['Finished connection and traceability', 'Define the final connection form, facing, dimensions and marking. Material identification and required inspection records should trace the supplied components to the agreed order requirements.']],
        applications: ['Projects specifying forged flange construction', 'Pipe flanges with defined material traceability', 'Equipment connections with forging-specific requirements'],
        checks: [['Product form', 'Weld neck, slip-on, blind or other specified form'], ['Material route', 'Forging specification, grade and heat treatment'], ['Finished geometry', 'Standard, edition, nominal size, rating and facing'], ['Records', 'Traceability, marking, testing and inspection documents']],
        related: ['weld-neck-flanges', 'slip-on-flanges', 'plate-flanges']
    },
    {
        slug: 'loose-flanges', name: 'Loose Flanges', group: 'Mechanical connections', aliases: 'loose backing ring rotating collar loose flange',
        intro: 'A loose flange is a separate backing component working with a collar, lapped end or stub end. It transfers bolt load while the companion component forms the pipe-side seating interface.',
        detail: 'The term covers more than one backing-ring construction and may overlap with lap-joint terminology. Confirm the collar standard, contact geometry and assembly clearance. A loose ring alone does not define the wetted material, gasket surface or pressure capacity of the joint.',
        caption: 'Original loose backing-ring and collar section. Components are separated for identification; not to scale and not an assembly clearance drawing.',
        sections: [['Relationship to lap joint', 'A lap-joint assembly is one familiar use of a separate backing flange. This page addresses the backing component itself, including drawing-specified collars; it does not imply that every loose ring fits every stub end.'], ['Specify both components', 'Check collar diameter and thickness, contact radius, ring bore and the mating bolt pattern. Identify the process-wetted material separately from the backing component material.']],
        applications: ['Collar-backed piping joints', 'Assemblies requiring bolt-hole alignment', 'Replacement backing rings for identified stub ends'],
        checks: [['Companion component', 'Collar or stub-end designation and drawing'], ['Contact geometry', 'Lap thickness, corner radius, bore and bearing diameter'], ['Material split', 'Backing ring and process-wetted component grades'], ['Joint basis', 'Applicable assembly standard, rating and gasket arrangement']],
        related: ['lap-joint-flanges', 'plate-flanges', 'companion-flanges']
    },
    {
        slug: 'square-flanges', name: 'Square Flanges', group: 'Construction & special designs', aliases: 'square four bolt hydraulic flange',
        intro: 'A square flange has a square external form and a connection-specific bolt arrangement. The outer shape alone does not identify its bore, seal or pressure rating.',
        detail: 'Square connection systems can use different pipe attachments and gasket or seal arrangements. Provide the equipment designation or a controlled drawing of both mating components. Do not treat a square four-bolt form as an ASME B16.5 circular flange or an interchangeable hydraulic connection.',
        caption: 'Original square four-bolt front-view concept. The seal system, pipe connection and dimensions are intentionally unspecified.',
        sections: [['Identify the connection system', 'State the governing equipment or flange standard and any manufacturer interface designation. An O-ring recess, flat gasket or other seal requires its own dimensions and compatible mating surface.'], ['Match the complete pattern', 'Provide centre distances in both directions, bolt-hole diameters, flange thickness and bore. Verify clearance to surrounding equipment as well as the nominal connection size.']],
        applications: ['Drawing-defined square equipment connections', 'Specified hydraulic or utility interfaces', 'Replacement square flange pairs'],
        checks: [['Interface', 'Equipment designation or approved mating drawing'], ['Bolt pattern', 'Horizontal and vertical centres, hole count and diameter'], ['Seal', 'Gasket or seal geometry, material and surface requirements'], ['Design basis', 'Applicable connection standard, loads and pressure-temperature conditions']],
        related: ['companion-flanges', 'plate-flanges', 'reducing-flanges']
    },
    {
        slug: 'expander-flanges', name: 'Expander Flanges', group: 'Welded connections', aliases: 'expander expanding transition increasing bore flange',
        intro: 'An expander flange incorporates a transition between a smaller pipe-side connection and a larger flanged bore. The transition geometry is part of the component design.',
        detail: 'Identify both connection sizes, the transition length and the wall profile. Expander terminology is not sufficient to establish whether the requirement is an integral component or a fabricated assembly. The mating flange standard does not automatically validate the transition or its load capacity.',
        caption: 'Original expanding-bore section concept, not to scale. It does not establish an integral versus fabricated construction or a standard pressure rating.',
        sections: [['Define the transition', 'Specify pipe-side bore and wall, the larger flanged opening and the required overall length. Include weld-end preparation and any internal profile or flow-path requirements.'], ['Confirm the design and manufacture', 'Agree whether the proposed construction is integral or fabricated, with the applicable design calculation, fabrication requirements and inspection scope. A bolt-pattern match is only one part of that review.']],
        applications: ['Size transitions at equipment connections', 'Space-constrained flange-to-pipe changes', 'Engineered transition components'],
        checks: [['Connection sizes', 'Pipe-side size and larger flange-side bore'], ['Profile', 'Transition length, wall thickness and internal contour'], ['Construction', 'Integral or fabricated form and approved drawing'], ['Design review', 'Material, loads, pressure-temperature basis and inspection']],
        related: ['reducing-flanges', 'weld-neck-flanges', 'long-weld-neck-flanges']
    },
    {
        slug: 'high-hub-blind-flanges', name: 'High Hub Blind Flanges', group: 'Closure & measurement', aliases: 'high hub blind raised hub solid closure',
        intro: 'A high hub blind flange combines a closed centre with a projecting hub on its rear side. The hub profile distinguishes it from an ordinary flat-backed blind flange.',
        detail: 'Specify the hub diameter and projection as well as the pressure-retaining section and mating face. A raised hub does not itself establish a higher allowable pressure. Any drilled, tapped or machined modification must be assessed as part of the agreed design rather than assumed acceptable.',
        caption: 'Original side-profile concept of a solid blind with a rear hub. No bore is shown; hub dimensions and structural suitability require design confirmation.',
        sections: [['Hub versus gasket facing', 'The high hub is a body feature and must not be confused with a raised gasket face. Identify which side carries the hub and specify the mating face independently.'], ['Modifications need a drawing', 'Include any required ports, recesses or attachment features on a controlled drawing. Specify inspection and acceptance requirements for the actual modified component.']],
        applications: ['Equipment closures requiring a defined rear hub', 'Drawing-specified blind-flange variants', 'Replacement closures with a verified profile'],
        checks: [['Hub profile', 'Diameter, height, transition and orientation'], ['Closure', 'Minimum section and any separately specified modifications'], ['Mating face', 'Bolt pattern, facing and gasket requirements'], ['Design basis', 'Approved standard or drawing and pressure-temperature assessment']],
        related: ['blind-flanges', 'forged-flanges', 'companion-flanges']
    },
    {
        slug: 'spectacle-blind-flanges', name: 'Spectacle Blinds', group: 'Closure & measurement', aliases: 'spectacle blind flange figure eight line blank b16.48',
        intro: 'A spectacle blind joins a solid blank and an open ring with a connecting bridge. One side or the other is positioned in the flange joint to define the line condition.',
        detail: 'This is a line-blank component installed between mating flanges, not a conventional bolted blind flange. ASME B16.48 is the reference for operational line blanks within its scope. Thickness, facing, material and the mating-joint arrangement must be coordinated under the project requirements.',
        caption: 'Original front view of a spectacle blind: solid blank, connecting bridge and open ring. Not to scale; gasket faces and dimensions are omitted.',
        sections: [['Joint arrangement', 'Specify the nominal size, rating, material and gasket seating required for both positions. Check bridge clearance and handling space against the actual flange assembly.'], ['Isolation procedure', 'Changing the line-blank position requires the site isolation, depressurisation and permit procedures. This catalogue description is not an instruction for operating or opening a pressurised joint.']],
        applications: ['Planned process-line isolation', 'Maintenance joints with space for a spectacle arrangement', 'Operational line-blank assemblies'],
        checks: [['Standard', 'ASME B16.48 where applicable, with edition and scope confirmed'], ['Mating joint', 'Nominal size, class, facing and gasket arrangement'], ['Clearance', 'Bridge dimensions, handling space and installation access'], ['Material', 'Grade, thickness, marking and traceability requirements']],
        related: ['spade-flanges', 'ring-spacers', 'blind-flanges']
    },
    {
        slug: 'spade-flanges', name: 'Spades / Paddle Blinds', group: 'Closure & measurement', aliases: 'spade paddle blind line blank b16.48 isolation',
        intro: 'A spade is a solid line blank with a handle, installed between flanges for a specified isolation condition. It is used with a separately identified matching spacer arrangement.',
        detail: 'The solid paddle is distinct from a blind flange bolted to an open nozzle. Its thickness, gasket surfaces and handle identification belong to the complete line-blank specification. Confirm ASME B16.48 applicability or the required project design rather than applying generic flange dimensions.',
        caption: 'Original solid paddle-blank front view. The handle and blank are conceptual; thickness, facing and identification follow the project specification.',
        sections: [['Blank and spacer pairing', 'Identify the companion ring spacer and the joint requirements for each line condition. Coordinate thickness, gasket arrangement and bolting rather than treating the components as unrelated plates.'], ['Handling and identification', 'Specify handle form, marking and access for the installation. Position changes are subject to the site isolation and depressurisation procedure, not to this product description.']],
        applications: ['Maintenance isolation joints', 'Separate blank-and-spacer assemblies', 'Project-specified operational line blanks'],
        checks: [['Blank', 'Nominal size, rating, thickness and applicable standard'], ['Gasket seating', 'Required face form and finish on both sides'], ['Companion spacer', 'Matching spacer designation and joint arrangement'], ['Identification', 'Handle, marking, material records and inspection requirements']],
        related: ['ring-spacers', 'spectacle-blind-flanges', 'blind-flanges']
    },
    {
        slug: 'ring-spacers', name: 'Ring Spacers', group: 'Closure & measurement', aliases: 'ring spacer paddle spacer spade open line blank b16.48',
        intro: 'A ring spacer is the open component of a separate spade-and-spacer arrangement. Its bore permits the intended flow path while maintaining the specified flange-joint spacing.',
        detail: 'A line-blank spacer is not a general-purpose washer or a lap-joint backing flange. Match its bore, thickness and gasket-contact surfaces to the associated spade and flange assembly. The standard, material and marking requirements must be stated for the actual service.',
        caption: 'Original open paddle-spacer front view. Bore, thickness, handle and gasket surfaces require the applicable line-blank specification.',
        sections: [['Maintain the specified joint', 'Confirm the spacer and spade arrangement with the intended gasket and bolt selection. Do not insert an arbitrary ring merely to occupy the space left by a removed blank.'], ['Bore and identification', 'Specify the flow opening and any handle identification under the project standard. Material traceability and surface finish remain relevant even though the component has an open centre.']],
        applications: ['Open condition of paired spade/spacer joints', 'Operational line-blank assemblies', 'Maintenance interfaces requiring defined joint spacing'],
        checks: [['Standard', 'ASME B16.48 where applicable or the approved project drawing'], ['Opening', 'Nominal size, bore and pipe-interface requirements'], ['Pairing', 'Spade designation, thickness and gasket arrangement'], ['Identification', 'Handle, marking, material and inspection documentation']],
        related: ['spade-flanges', 'spectacle-blind-flanges', 'loose-flanges']
    },
    {
        slug: 'lip-type-flanges', name: 'Lip-Type Flanges', group: 'Construction & special designs', aliases: 'lip type lip flange drawing sealing lip',
        intro: 'Lip-type flange enquiries require a drawing of the intended lip and mating arrangement. The name alone does not establish a unique connection, seal system or standard.',
        detail: 'Identify whether the lip is a gasket-location feature, a welded sealing element or another design-specific interface. These arrangements are not interchangeable. This page accepts a drawing-led requirement without representing an unverified lip profile as a standard Valtron product.',
        caption: 'Original lip-type enquiry reference showing the required design inputs, not product geometry. A verified drawing or photograph is needed to identify the intended lip design.',
        sections: [['Establish the intended lip design', 'Provide a section through the assembled joint, the mating component and the seal detail. A photograph can help identify the arrangement, but does not replace the dimensions and material specification.'], ['Review before quotation', 'Include the design conditions, connection loads, installation method and governing standard or equipment reference. The offered scope and relevant product imagery can be confirmed once the actual design has been identified.']],
        applications: ['Drawing-defined lip interfaces', 'Replacement enquiries with an existing joint section', 'Equipment-specific sealing arrangements'],
        checks: [['Design identity', 'Controlled drawing, revision and equipment reference'], ['Lip and mate', 'Section geometry, mating component and tolerances'], ['Seal or weld', 'Sealing principle, material and assembly requirements'], ['Service', 'Pressure, temperature, fluid compatibility and inspection scope']],
        related: ['companion-flanges', 'square-flanges', 'loose-flanges']
    },
    {
        slug: 'puddle-flanges', name: 'Puddle Flanges', group: 'Construction & special designs', aliases: 'puddle waterstop wall penetration collar flange',
        intro: 'A puddle flange is a collar arrangement at a pipe penetration through a wall or slab. It addresses the path around the outside of the pipe rather than a conventional bolted pipe joint.',
        detail: 'Identify whether the requirement is a welded metal collar, a mechanical collar or another specified waterstop system. The pipe, collar attachment and surrounding construction form one installation detail. A puddle collar does not establish the pressure rating of the pipe or guarantee a watertight installation by itself.',
        caption: 'Original section concept of a pipe and collar within a wall. It illustrates penetration context only, not a certified waterstop system or installation detail.',
        sections: [['Coordinate with the civil detail', 'Provide wall or slab thickness, collar position, pipe material and the specified embedment or sealing arrangement. Installation and waterproofing requirements must be agreed with the relevant project designer.'], ['Construction and attachment', 'For a welded metal collar, specify the weld and inspection requirements. Mechanical or elastomeric systems need their own approved assembly detail and must not be substituted on appearance alone.']],
        applications: ['Water-retaining structure penetrations', 'Pipe entries through walls and slabs', 'Project-defined penetration sealing assemblies'],
        checks: [['Penetration', 'Pipe outside diameter, material and wall/slab thickness'], ['Collar', 'Construction, outside diameter, thickness and position'], ['Attachment', 'Welded or mechanical arrangement and inspection requirements'], ['Environment', 'Waterproofing detail, exposure, coating and installation specification']],
        related: ['plate-flanges', 'loose-flanges', 'companion-flanges']
    }
].map(product => ({ ...product, image: `img/flanges/reference/product-${product.slug}.png`, alt: product.caption, illustration: true }));

export const products = [
    {
        slug: 'weld-neck-flanges', name: 'Weld Neck Flanges', group: 'Welded connections', image: 'img/weld-neck-flange-manufacturers.jpg', alt: 'Weld-neck flange with tapered hub and bolt circle', aliases: 'wn wnrf wnff welding neck raised face rf',
        intro: 'A tapered hub carries the connection from the flange body to a butt-welded pipe end. The pipe bore and wall thickness are important parts of the flange specification.',
        detail: 'Weld-neck construction is used where the joint must accommodate demanding mechanical loading or thermal cycling. Selection depends on the piping design, weld preparation, material and pressure-temperature requirements, not the flange shape alone.',
        applications: ['Process piping and plant connections', 'Lines subject to thermal cycling', 'Butt-welded piping assemblies'],
        checks: [['Pipe connection', 'Butt-weld end; specify pipe schedule and bore'], ['Facing', 'Specify RF, FF or RTJ as required by the mating joint'], ['Design basis', 'ASME B16.5 or another project-specified flange standard'], ['Inspection', 'State weld preparation, dimensional inspection and document requirements']],
        related: ['slip-on-flanges', 'long-weld-neck-flanges', 'orifice-flanges']
    },
    {
        slug: 'slip-on-flanges', name: 'Slip-On Flanges', group: 'Welded connections', image: 'img/flanges/slip-on-flanges.jpg', alt: 'Slip-on flange with an open, unthreaded bore', aliases: 'so sorf soff slip on raised face rf',
        intro: 'The flange bore slips over the pipe before the connection is secured with fillet welds. Pipe outside diameter and installation clearance govern the fit.',
        detail: 'Slip-on flanges provide a different joint arrangement from butt-welded weld-neck flanges. The designer should review weld access, fatigue loading and service conditions when deciding whether this construction is appropriate.',
        applications: ['Plant utility piping', 'Accessible fillet-welded joints', 'Fabricated pipe assemblies'],
        checks: [['Pipe connection', 'Slip-over bore with project-specified fillet welds'], ['Bore', 'Match the pipe outside diameter and required clearance'], ['Facing', 'Match the gasket and mating flange'], ['Design basis', 'Specify standard, nominal size and pressure class together']],
        related: ['weld-neck-flanges', 'socket-weld-flanges', 'lap-joint-flanges']
    },
    {
        slug: 'blind-flanges', name: 'Blind Flanges', group: 'Closure & measurement', image: 'img/flanges/blind-flanges.jpg', alt: 'Blind flange with a closed centre', aliases: 'bl blrf blff blank blanking closure dummy raised face rf',
        intro: 'A solid flange closes a flanged opening without a through bore. Its bolted connection allows the closure to be removed for access when the system is safely isolated.',
        detail: 'Blind flanges are used at pipe ends, equipment nozzles and other openings requiring a bolted closure. A drilled or tapped blind is a modified design and must be specified separately rather than assumed equivalent to a standard blind.',
        applications: ['Flanged pipe-end closures', 'Equipment opening isolation', 'Maintenance and inspection access'],
        checks: [['Construction', 'Solid centre; identify any required drilling separately'], ['Joint', 'Match mating flange dimensions and facing'], ['Design basis', 'Specify class, material and design temperature'], ['Modifications', 'Provide an approved drawing for non-standard openings']],
        related: ['weld-neck-flanges', 'slip-on-flanges', 'orifice-flanges']
    },
    {
        slug: 'threaded-flanges', name: 'Threaded Flanges', group: 'Mechanical connections', image: 'img/flanges/threaded-flanges.jpg', alt: 'Threaded flange product view', aliases: 'screwed thread thrf npt bsp',
        intro: 'Internal threads connect the flange to a matching threaded pipe end. The thread form, nominal size and mating pipe specification must be stated together.',
        detail: 'Threaded and screwed are two names for this connection family. Suitability for vibration, thermal cycling and the process fluid must be evaluated under the applicable piping design requirements. NPT and BSP connections must not be treated as interchangeable.',
        applications: ['Threaded utility connections', 'Locations with restricted weld access', 'Demountable threaded pipe assemblies'],
        checks: [['Connection', 'Specify thread standard, size and engagement'], ['Sealing', 'Identify a process-compatible thread sealing method'], ['Facing', 'Match the bolted connection independently of the pipe thread'], ['Service', 'Review temperature cycling, vibration and fluid compatibility']],
        related: ['socket-weld-flanges', 'companion-flanges', 'blind-flanges']
    },
    {
        slug: 'socket-weld-flanges', name: 'Socket Weld Flanges', group: 'Welded connections', image: 'img/flanges/socket-weld-flange.webp', alt: 'Hubbed socket-weld flange product view', aliases: 'sw swrf socket weld',
        intro: 'A recessed socket receives the pipe end, with a fillet weld at the outside of the hub. Socket depth, bore and assembly requirements distinguish it from a slip-on connection.',
        detail: 'Socket-weld flanges are associated with compact piping connections. The designer should consider the internal crevice, installation requirements and service conditions. A front product view alone does not establish the internal socket dimensions.',
        applications: ['Small-bore process assemblies', 'Compact equipment connections', 'Socket-welded utility systems'],
        checks: [['Pipe connection', 'Specify socket dimensions and pipe schedule'], ['Assembly', 'Follow the applicable piping code and weld procedure'], ['Facing', 'Confirm the required gasket seating geometry'], ['Service', 'Review crevice-sensitive or cleanliness-critical applications']],
        related: ['weld-neck-flanges', 'slip-on-flanges', 'threaded-flanges']
    },
    {
        slug: 'lap-joint-flanges', name: 'Lap Joint Flanges', group: 'Mechanical connections', image: 'img/flanges/3_lap-joint-flanges.jpg', alt: 'Lap-joint flange and stub-end assembly reference', aliases: 'lj loose backing rotating stub end lapped solj',
        intro: 'A backing flange works with a separate stub end or lapped pipe end. The stub end provides the gasket seating surface while the backing flange transmits the bolt load.',
        detail: 'The backing flange can rotate before the bolts are tightened, helping bolt-hole alignment. The stub end, flange and mating joint must be selected as an assembly. Material selection for the backing ring does not determine the process-wetted material.',
        applications: ['Piping requiring bolt-hole alignment', 'Connections using a separate stub end', 'Assemblies requiring periodic dismantling'],
        checks: [['Assembly', 'Specify flange and stub end as separate components'], ['Wetted material', 'Identify the stub-end material and pipe specification'], ['Geometry', 'Confirm lap thickness, corner radius and backing flange fit'], ['Mating joint', 'Verify gasket seating and bolting compatibility']],
        related: ['slip-on-flanges', 'weld-neck-flanges', 'companion-flanges']
    },
    {
        slug: 'long-weld-neck-flanges', name: 'Long Weld Neck Flanges', group: 'Welded connections', image: 'img/flanges/long-weld-neck-flanges.webp', alt: 'Long weld-neck flange with extended straight neck', aliases: 'lwn lwnrf long welding neck nozzle',
        intro: 'An extended neck combines a flanged connection with a longer nozzle section. Neck length, bore and end preparation must be specified for the intended equipment connection.',
        detail: 'Long weld-neck designs are often considered for vessel and equipment nozzles. The extended neck is not simply a standard weld neck with an assumed extra length: the equipment design, reinforcement and fabrication requirements need their own review.',
        applications: ['Vessel nozzle connections', 'Equipment-specific extended necks', 'Drawing-based process connections'],
        checks: [['Neck', 'Provide required projection, wall and bore'], ['Equipment interface', 'Supply nozzle or fabrication drawing'], ['Design basis', 'State the equipment code and flange interface standard'], ['Weld preparation', 'Identify end preparation and inspection requirements']],
        related: ['weld-neck-flanges', 'blind-flanges', 'orifice-flanges']
    },
    {
        slug: 'orifice-flanges', name: 'Orifice Flanges', group: 'Closure & measurement', image: 'img/flanges/orifice_eng.jpg', alt: 'Orifice flange sectional drawing showing pressure-tapping connections', aliases: 'orifice measurement flow meter pressure tap b16.36', illustration: true,
        intro: 'Pressure-tapping connections distinguish an orifice flange from a general pipe flange. A matched assembly supports the differential-pressure measurement arrangement around an orifice plate.',
        detail: 'The flange pair, plate, gaskets, tapping arrangement and instrument connections must be coordinated with the flow-measurement design. ASME B16.36 is the flange-standard reference to identify; it does not replace the metering-system design requirements.',
        applications: ['Differential-pressure flow measurement', 'Metering sections in process lines', 'Instrumented flange assemblies'],
        checks: [['Assembly', 'Specify the matched flange pair and plate arrangement'], ['Tappings', 'State quantity, orientation and connection details'], ['Standard', 'Identify ASME B16.36 edition and applicable configuration'], ['Measurement', 'Provide instrument and metering design requirements']],
        related: ['weld-neck-flanges', 'blind-flanges', 'slip-on-flanges']
    },
    {
        slug: 'companion-flanges', name: 'Companion Flanges', group: 'Mechanical connections', image: 'img/flanges/companion-supplier.jpg', alt: 'Companion flange connection reference', aliases: 'mating companion matching flange',
        intro: 'A companion flange is selected to mate with a particular flanged connection. The term describes its role in an assembly, so the actual connection form and dimensions must be identified.',
        detail: 'Bolt circle, hole count, bore and gasket seating must match the equipment or existing flange. A nominal pipe size alone is not enough to identify a suitable companion. Include a drawing or the original equipment connection specification in the enquiry.',
        applications: ['Matching equipment flange interfaces', 'Replacement mating connections', 'Drawing-led assembly enquiries'],
        checks: [['Mating component', 'Provide equipment drawing or flange designation'], ['Bolt pattern', 'State bolt circle, hole quantity and hole diameter'], ['Pipe side', 'Identify threaded, welded or other connection form'], ['Facing', 'Confirm seating profile and gasket arrangement']],
        related: ['threaded-flanges', 'lap-joint-flanges', 'slip-on-flanges']
    },
    ...additionalProducts
];

export const fittingGroups = [
    { slug: 'buttweld-fittings', name: 'Buttweld Fittings', image: 'img/ss-buttweld.jpg', intro: 'Elbows, tees, reducers, returns, stub ends and caps for butt-welded piping. Specify material, nominal size and wall thickness or schedule with each enquiry.', pages: [
        ['buttweld-short-45', 'Short Radius 45-degree Elbow'], ['buttweld-long-45', 'Long Radius 45-degree Elbow'], ['buttweld-short-90', 'Short Radius 90-degree Elbow'], ['buttweld-long-90', 'Long Radius 90-degree Elbow'], ['buttweld-180', '180-degree Return Bend'], ['buttweld-equal-tee', 'Equal Tee'], ['buttweld-reducing-tee', 'Reducing Tee'], ['buttweld-concentric-reducer', 'Concentric Reducer'], ['buttweld-eccentric-reducer', 'Eccentric Reducer'], ['buttweld-stub-end', 'Stub End'], ['buttweld-cap', 'Buttweld Cap']
    ] },
    { slug: 'forged', name: 'Forged Fittings', image: 'img/ss-forged.jpg', intro: 'Socket-weld and threaded connection enquiries for compact piping assemblies. Specify the connection type, material, size and required fitting class.', pages: [
        ['forged-elbow', 'Elbows'], ['forged-tee', 'Tees'], ['forged-coupling', 'Couplings'], ['forged-union', 'Unions'], ['forged-caps-plugs', 'Caps & Plugs'], ['forged-reducing-insert', 'Reducing Inserts']
    ] }
];

export const materials = [
    ['Stainless Steel', 'Specify the exact grade, corrosion environment, design temperature and any low-carbon or stabilised requirement.'],
    ['Carbon Steel', 'Identify the forging or plate specification, design temperature, impact-testing requirements and corrosion allowance.'],
    ['Alloy / Chrome Moly Steel', 'Elevated-temperature selection requires the exact grade, heat-treatment condition and weld procedure.'],
    ['Duplex Steel', 'Specify the UNS designation, heat treatment and any project requirements for phase balance or corrosion testing.'],
    ['Super Duplex Steel', 'Chloride service and demanding process conditions require grade-specific corrosion and fabrication review.'],
    ['Nickel', 'Identify the nickel grade and service chemistry; commercially pure nickel is not interchangeable with nickel alloys.'],
    ['Monel', 'State the alloy designation and heat-treatment condition; 400 and K-500 have different mechanical requirements.'],
    ['Inconel', 'Specify the exact nickel-chromium alloy and temperature or corrosion requirements.'],
    ['Incoloy', 'Identify the nickel-iron-chromium alloy; do not substitute an Inconel designation.'],
    ['Hastelloy', 'Specify the alloy designation and process chemistry, including concentration and temperature.'],
    ['Alloy 20', 'Identify UNS N08020 and the applicable product specification, with a service-specific corrosion assessment.'],
    ['SMO 254', 'Identify the applicable designation and product specification. This is a high-alloy austenitic material, not a duplex grade.'],
    ['Titanium', 'Specify grade and service chemistry together; fabrication and cleanliness requirements need particular attention.'],
    ['Copper', 'State the exact alloy designation, temper and flange construction required.'],
    ['Copper Nickel', 'Distinguish 90/10 and 70/30 designations and identify the service conditions and mating materials.'],
    ['Aluminium', 'Specify alloy and temper; review galvanic compatibility, operating temperature and joint design.']
];

export const standards = [
    ['ASME B16.5', 'Pipe flange dimensions and pressure-temperature ratings within its specified size, material and type scope.'],
    ['ASME B16.47', 'Large-diameter steel flanges; identify Series A or Series B rather than using the parent standard alone.'],
    ['ASME B16.47 Series A', 'Series A dimensions must be matched to the specified mating flange. Do not assume Series B interchangeability.'],
    ['ASME B16.47 Series B', 'Series B is a distinct dimensional series; check bolt pattern and mating requirements.'],
    ['ASME B16.36', 'Orifice flanges, including applicable pressure-tapping arrangements and flange configurations.'],
    ['ASME B16.48', 'Operational line blanks within the standard scope, including relevant spade and spacer arrangements.'],
    ['MSS SP-44', 'Steel pipeline flanges; identify the required edition, material and project requirements.'],
    ['EN 1092-1', 'Steel flanges designated by PN, with the exact flange type and material specified.'],
    ['DIN', 'A family of specifications, not one universal flange standard. Provide the full number and edition.'],
    ['BS 4504', 'A legacy reference requiring confirmation of the exact specification and any replacement standard.'],
    ['BS 10', 'Table-designated flanges; state the table and verify the actual connection dimensions.'],
    ['AWWA C207', 'Steel pipe flanges for waterworks service within the specified class and dimensional scope.'],
    ['API 6A', 'Wellhead and tree equipment connections; this is not an alternative name for historical API 605 flanges.'],
    ['JIS', 'Provide the full JIS flange designation, material, nominal size and rating.'],
    ['SANS 1123 / SABS 1123', 'State the applicable edition and designation; verify current versus historical naming.'],
    ['GOST', 'Identify the specific GOST standard, flange type, edition and rating required by the project.'],
    ['AS 2129', 'Table-based flange requirements; confirm dimensions, material and applicable service conditions.'],
    ['UNI', 'Provide the specific UNI number and edition, including any current or legacy standard relationship.']
];

export const facings = [
    ['Raised Face (RF)', 'A raised gasket seating surface inside the bolt circle. Specify the gasket type and required surface finish.'],
    ['Flat Face (FF)', 'A flat mating surface. Review the full joint, gasket and flange material compatibility rather than mixing facings by appearance.'],
    ['Ring Type Joint (RTJ)', 'A machined groove for a matching metal ring gasket. Groove and ring designations must correspond.'],
    ['Tongue and Groove', 'A matching tongue locates within a groove. Both sides and the gasket dimensions must be identified.'],
    ['Male and Female', 'A projecting face mates with a recessed face. Specify the complete mating pair and seating dimensions.'],
    ['Lap Joint Assembly', 'The stub end provides the gasket seating surface while a separate backing flange carries the bolt load.']
];
import { chromium } from '@playwright/test';
import { mkdir, writeFile } from 'node:fs/promises';
import { additionalProducts } from './catalogue.mjs';

const diagrams = [
    ['raised-face', 'Raised Face (RF)'], ['flat-face', 'Flat Face (FF)'],
    ['rtj', 'Ring Type Joint (RTJ)'], ['tongue-and-groove', 'Tongue and Groove'],
    ['male-and-female', 'Male and Female'], ['lap-joint', 'Lap Joint Assembly'],
    ['line-blanks', 'Operational Line Blanks'],
    ...additionalProducts.map(product => [`product-${product.slug}`, product.name])
];
const output = 'img/flanges/reference';
await mkdir(output, { recursive: true });
const browser = await chromium.launch({ headless: true });
try {
    const page = await browser.newPage();
    for (const [kind, title] of diagrams) {
        const data = await page.evaluate(({ kind, title }) => {
            const canvas = document.createElement('canvas');
            canvas.width = 980;
            canvas.height = 600;
            const context = canvas.getContext('2d');
            const steel = '#d8dfe1';
            const edge = '#3d5359';
            const gasket = '#c99700';
            const rectangle = (left, top, width, height, color = steel) => {
                context.fillStyle = color;
                context.strokeStyle = edge;
                context.lineWidth = 2;
                context.fillRect(left, top, width, height);
                context.strokeRect(left, top, width, height);
            };
            const polygon = (points, color = steel) => {
                context.beginPath();
                for (const [index, [left, top]] of points.entries()) {
                    if (index === 0) context.moveTo(left, top);
                    else context.lineTo(left, top);
                }
                context.closePath();
                context.fillStyle = color;
                context.strokeStyle = edge;
                context.lineWidth = 2;
                context.fill();
                context.stroke();
            };
            const label = (text, left, top, size = 21) => {
                context.fillStyle = '#23262b';
                context.font = `${size}px sans-serif`;
                context.fillText(text, left, top);
            };
            const circle = (left, top, radius, color) => {
                context.beginPath();
                context.arc(left, top, radius, 0, Math.PI * 2);
                context.fillStyle = color;
                context.strokeStyle = edge;
                context.lineWidth = 3;
                context.fill();
                context.stroke();
            };
            context.fillStyle = '#ffffff';
            context.fillRect(0, 0, 980, 600);
            label(title, 46, 58, 32);
            label('Original schematic / Not to scale', 46, 93, 18);

            if (kind.startsWith('product-')) {
                const productKind = kind.slice(8);
                const ring = (left, top, radius, bore, bolts = true) => {
                    circle(left, top, radius, steel);
                    if (bore) circle(left, top, bore, '#ffffff');
                    if (bolts) {
                        for (let index = 0; index < 8; index++) {
                            const angle = index * Math.PI / 4 + Math.PI / 8;
                            circle(left + Math.cos(angle) * radius * .8, top + Math.sin(angle) * radius * .8, radius * .065, '#ffffff');
                        }
                    }
                };
                const sectionPair = points => {
                    polygon(points);
                    polygon(points.map(([left, top]) => [left, 630 - top]));
                };
                let note = 'Conceptual geometry only. Dimensions, ratings and final design are not established.';
                if (productKind === 'plate-flanges' || productKind === 'reducing-flanges') {
                    ring(400, 315, 185, productKind === 'plate-flanges' ? 110 : 48);
                    label('FRONT VIEW', 657, 232, 18);
                    label(productKind === 'plate-flanges' ? 'Open plate ring' : 'Reduced opening', 657, 277, 23);
                    label('Bolt pattern and bore', 657, 320, 18);
                    label('require specification', 657, 348, 18);
                } else if (productKind === 'square-flanges') {
                    rectangle(280, 137, 360, 360);
                    circle(460, 317, 95, '#ffffff');
                    for (const left of [325, 595]) for (const top of [182, 452]) circle(left, top, 20, '#ffffff');
                    label('FRONT VIEW', 710, 230, 18);
                    label('Seal and pipe-side', 710, 276, 18);
                    label('connection unspecified', 710, 304, 18);
                } else if (productKind === 'forged-flanges') {
                    ring(210, 305, 120, 52);
                    ring(490, 305, 120, 76);
                    ring(770, 305, 120, 0);
                    label('Hubbed form', 148, 468, 22);
                    label('Open form', 438, 468, 22);
                    label('Blind form', 721, 468, 22);
                    note = 'Finished-form examples only. Appearance does not prove a forging route or grade.';
                } else if (productKind === 'high-hub-blind-flanges') {
                    polygon([[290, 345], [395, 345], [410, 305], [410, 175], [570, 175], [570, 305], [585, 345], [690, 345], [690, 430], [290, 430]]);
                    rectangle(328, 345, 20, 85, '#ffffff');
                    rectangle(632, 345, 20, 85, '#ffffff');
                    label('Rear hub', 680, 243, 24);
                    label('Solid closure / no bore', 373, 484, 23);
                    note = 'Side-section concept. A high rear hub is not the same feature as a raised gasket face.';
                } else if (productKind === 'spectacle-blind-flanges') {
                    rectangle(330, 293, 285, 36);
                    ring(285, 311, 155, 0, false);
                    ring(675, 311, 155, 101, false);
                    label('Solid blank', 222, 495, 23);
                    label('Open ring', 622, 495, 23);
                    note = 'Operational line-blank front view. Gasket faces, bridge dimensions and thickness omitted.';
                } else if (productKind === 'spade-flanges' || productKind === 'ring-spacers') {
                    rectangle(465, 142, 50, 95);
                    ring(490, 342, 162, productKind === 'ring-spacers' ? 104 : 0, false);
                    label('HANDLE', 630, 185, 18);
                    label(productKind === 'ring-spacers' ? 'Open spacer' : 'Solid blank', 715, 346, 23);
                    note = 'Front view of a line-blank component, not a conventional bolted pipe flange.';
                } else if (productKind === 'loose-flanges') {
                    rectangle(340, 155, 92, 128);
                    rectangle(340, 347, 92, 128);
                    polygon([[160, 288], [458, 288], [458, 205], [495, 205], [495, 425], [458, 425], [458, 342], [160, 342]], '#85b2b2');
                    context.fillStyle = '#ffffff';
                    context.fillRect(155, 303, 347, 24);
                    label('Backing ring', 573, 209, 23);
                    label('Collar / lapped end', 573, 259, 23);
                    label('Pipe bore', 573, 319, 23);
                    rectangle(537, 192, 18, 18);
                    rectangle(537, 242, 18, 18, '#85b2b2');
                    note = 'Section concept, separated for identification. Not an assembly clearance drawing.';
                } else if (productKind === 'expander-flanges') {
                    sectionPair([[175, 259], [390, 259], [605, 179], [625, 179], [625, 135], [720, 135], [720, 229], [632, 229], [404, 292], [175, 292]]);
                    label('Smaller pipe end', 148, 434, 22);
                    label('Larger flanged bore', 602, 523, 22);
                    note = 'Transition section concept. Integral or fabricated construction requires confirmation.';
                } else if (productKind === 'weldo-flanges' || productKind === 'nipo-flanges') {
                    const flangeTop = productKind === 'nipo-flanges' ? 150 : 260;
                    rectangle(145, 420, 680, 26, '#85b2b2');
                    rectangle(145, 480, 680, 26, '#85b2b2');
                    polygon([[292, flangeTop], [450, flangeTop], [450, 375], [408, 416], [365, 433], [365, 413], [407, 383], [407, flangeTop + 65], [292, flangeTop + 65]]);
                    polygon([[688, flangeTop], [530, flangeTop], [530, 375], [572, 416], [615, 433], [615, 413], [573, 383], [573, flangeTop + 65], [688, flangeTop + 65]]);
                    rectangle(335, flangeTop, 18, 65, '#ffffff');
                    rectangle(627, flangeTop, 18, 65, '#ffffff');
                    context.fillStyle = '#ffffff';
                    context.fillRect(451, 415, 78, 32);
                    label('Run pipe', 735, 467, 20);
                    label(productKind === 'nipo-flanges' ? 'Extended branch concept' : 'Compact branch concept', 320, 125, 22);
                    note = 'Branch section concept only. Run attachment and reinforcement need design review.';
                } else if (productKind === 'puddle-flanges') {
                    rectangle(380, 140, 230, 358, '#e5e9e8');
                    for (let top = 155; top < 485; top += 28) {
                        context.beginPath(); context.moveTo(388, top); context.lineTo(421, top - 10); context.stroke();
                        context.beginPath(); context.moveTo(570, top); context.lineTo(602, top - 10); context.stroke();
                    }
                    rectangle(150, 270, 680, 26, '#85b2b2');
                    rectangle(150, 348, 680, 26, '#85b2b2');
                    context.fillStyle = '#ffffff'; context.fillRect(148, 297, 686, 50);
                    rectangle(480, 175, 30, 95);
                    rectangle(480, 374, 30, 95);
                    label('Wall / slab', 432, 531, 22);
                    label('Pipe', 175, 246, 22);
                    label('Collar', 646, 205, 22);
                    note = 'Penetration section concept. Waterproofing and collar attachment must be specified.';
                } else if (productKind === 'lip-type-flanges') {
                    const requirements = [
                        ['JOINT SECTION', 'Lip profile', 'Dimensions', 'Drawing revision'],
                        ['MATING COMPONENT', 'Interface detail', 'Assembly method', 'Equipment reference'],
                        ['SEAL OR WELD', 'Sealing principle', 'Material', 'Design conditions']
                    ];
                    for (const [index, lines] of requirements.entries()) {
                        const left = 65 + index * 293;
                        rectangle(left, 174, 263, 298, '#edf3f2');
                        label(lines[0], left + 17, 226, 19);
                        for (let line = 1; line < lines.length; line++) label(lines[line], left + 17, 267 + line * 45, 19);
                    }
                    note = 'Design-input reference, not a product drawing. The intended lip geometry is unverified.';
                } else {
                    throw new Error(`Missing product artwork: ${productKind}`);
                }
                label(note, 46, 571, 18);
            } else if (kind === 'line-blanks') {
                rectangle(120, 252, 248, 26);
                circle(155, 265, 87, steel);
                circle(355, 265, 87, steel);
                circle(355, 265, 55, '#ffffff');
                rectangle(590, 160, 25, 85);
                circle(603, 293, 78, steel);
                rectangle(804, 160, 25, 85);
                circle(817, 293, 78, steel);
                circle(817, 293, 49, '#ffffff');
                label('Spectacle blind', 152, 410);
                label('Spade', 572, 410);
                label('Ring spacer', 762, 410);
                label('Front views of separate reference forms; joint dimensions are omitted.', 46, 520, 20);
                label('Not a bolted blind flange. Confirm material, rating and mating arrangement.', 46, 554, 20);
            } else {
                if (kind === 'raised-face') {
                    polygon([[240, 150], [425, 150], [425, 200], [448, 200], [448, 395], [425, 395], [425, 455], [240, 455]]);
                    polygon([[498, 150], [680, 150], [680, 455], [498, 455], [498, 395], [474, 395], [474, 200], [498, 200]]);
                    rectangle(449, 200, 24, 195, gasket);
                } else if (kind === 'flat-face') {
                    rectangle(240, 150, 208, 305);
                    rectangle(474, 150, 206, 305);
                    rectangle(449, 150, 24, 305, gasket);
                } else if (kind === 'rtj') {
                    polygon([[240, 150], [448, 150], [448, 189], [433, 210], [448, 231], [448, 373], [433, 394], [448, 415], [448, 455], [240, 455]]);
                    polygon([[474, 150], [680, 150], [680, 455], [474, 455], [474, 415], [489, 394], [474, 373], [474, 231], [489, 210], [474, 189]]);
                    polygon([[437, 210], [461, 188], [485, 210], [461, 232]], gasket);
                    polygon([[437, 394], [461, 372], [485, 394], [461, 416]], gasket);
                } else if (kind === 'tongue-and-groove' || kind === 'male-and-female') {
                    const upper = kind === 'tongue-and-groove' ? [203, 232] : [176, 258];
                    const lower = kind === 'tongue-and-groove' ? [373, 402] : [342, 429];
                    polygon([[240, 150], [425, 150], [425, upper[0]], [476, upper[0]], [476, upper[1]], [425, upper[1]], [425, lower[0]], [476, lower[0]], [476, lower[1]], [425, lower[1]], [425, 455], [240, 455]]);
                    polygon([[451, 150], [680, 150], [680, 455], [451, 455], [451, lower[1] + 4], [495, lower[1] + 4], [495, lower[0] - 4], [451, lower[0] - 4], [451, upper[1] + 4], [495, upper[1] + 4], [495, upper[0] - 4], [451, upper[0] - 4]]);
                    rectangle(477, upper[0], 17, upper[1] - upper[0], gasket);
                    rectangle(477, lower[0], 17, lower[1] - lower[0], gasket);
                } else if (kind === 'lap-joint') {
                    rectangle(240, 150, 165, 305);
                    rectangle(515, 150, 165, 305);
                    context.fillStyle = '#ffffff';
                    context.fillRect(238, 225, 450, 155);
                    polygon([[130, 230], [412, 230], [412, 185], [448, 185], [448, 420], [412, 420], [412, 374], [130, 374]], '#85b2b2');
                    polygon([[474, 185], [510, 185], [510, 230], [792, 230], [792, 374], [510, 374], [510, 420], [474, 420]], '#85b2b2');
                    rectangle(449, 185, 24, 235, gasket);
                }
                context.fillStyle = '#ffffff';
                context.fillRect(110, 265, 705, 74);
                context.strokeStyle = edge;
                context.lineWidth = 2;
                context.beginPath();
                context.moveTo(130, 265); context.lineTo(792, 265);
                context.moveTo(130, 339); context.lineTo(792, 339);
                context.stroke();
                label('BORE', 429, 309, 19);
                rectangle(48, 496, 20, 20);
                label(kind === 'lap-joint' ? 'Backing flanges' : 'Flange sections', 80, 514, 19);
                rectangle(355, 496, 20, 20, gasket);
                label(kind === 'rtj' ? 'Metal ring section' : 'Gasket section', 387, 514, 19);
                if (kind === 'lap-joint') {
                    rectangle(675, 496, 20, 20, '#85b2b2');
                    label('Stub ends', 707, 514, 19);
                }
                label('Facing geometry only. Bolts, hub details and dimensions are omitted.', 46, 563, 20);
            }
            return canvas.toDataURL('image/png');
        }, { kind, title });
        await writeFile(`${output}/${kind}.png`, Buffer.from(data.split(',')[1], 'base64'));
        console.log(`Rendered ${output}/${kind}.png`);
    }
} finally {
    await browser.close();
}
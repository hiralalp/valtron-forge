const path = require('node:path');
const os = require('node:os');
const sharp = require(path.join(os.tmpdir(), 'valtron-image-tools', 'node_modules', 'sharp'));

async function inspectImage() {
    const image = sharp(process.argv[2]);
    const metadata = await image.metadata();
    await image.stats();
    if (process.argv[3]) {
        await image.png().toFile(process.argv[3]);
    }
    console.log(JSON.stringify({ Width: metadata.width, Height: metadata.height }));
}

inspectImage().catch(error => {
    console.error(error.message);
    process.exitCode = 1;
});
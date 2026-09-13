import { execFileSync } from 'node:child_process';
import { mkdir } from 'node:fs/promises';
import ffmpeg from 'ffmpeg-static';

await mkdir('video', { recursive: true });
execFileSync(ffmpeg, ['-hide_banner', '-y', '-i', '_not-deployed/MicrosoftTeams-video.mp4', '-map', '0:v:0', '-map', '0:a:0?', '-c', 'copy', '-movflags', '+faststart', 'video/forging-reel.mp4'], { stdio: 'inherit' });
execFileSync(ffmpeg, ['-hide_banner', '-y', '-ss', '15', '-i', 'video/forging-reel.mp4', '-frames:v', '1', '-update', '1', 'img/forging-reel-poster.png'], { stdio: 'inherit' });
execFileSync(ffmpeg, ['-hide_banner', '-y', '-i', 'video/forging-reel.mp4', '-c:v', 'libvpx-vp9', '-crf', '18', '-b:v', '0', '-row-mt', '1', '-cpu-used', '2', '-c:a', 'libopus', '-b:a', '128k', 'video/forging-reel.webm'], { stdio: 'inherit' });
console.log('Prepared native-quality reel and poster at 00:15 without re-encoding video or audio.');
console.log('Also prepared a high-quality VP9/Opus WebM fallback at the original dimensions.');
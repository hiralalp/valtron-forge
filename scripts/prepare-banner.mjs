import { execFileSync } from 'node:child_process';
import ffmpeg from 'ffmpeg-static';

const firstSlide = process.argv.includes('--first');
const name = firstSlide ? 'banner-forging' : 'banner-new';
const input = firstSlide ? ['-ss', '5', '-i', 'video/forgingvideo.mp4'] : ['-i', '_not-deployed/bannernew.mp4'];
const encoding = firstSlide ? ['-t', '25', '-c:v', 'libx264', '-crf', '18', '-preset', 'medium', '-pix_fmt', 'yuv420p'] : ['-c:v', 'copy'];
execFileSync(ffmpeg, ['-hide_banner', '-y', ...input, '-map', '0:v:0', ...encoding, '-an', '-movflags', '+faststart', `video/${name}.mp4`], { stdio: 'inherit' });
execFileSync(ffmpeg, ['-hide_banner', '-y', '-i', `video/${name}.mp4`, '-frames:v', '1', '-update', '1', `img/${name}-poster.jpg`], { stdio: 'inherit' });
execFileSync(ffmpeg, ['-hide_banner', '-y', '-i', `video/${name}.mp4`, '-c:v', 'libvpx-vp9', '-crf', '24', '-b:v', '0', '-row-mt', '1', '-cpu-used', '4', '-an', `video/${name}.webm`], { stdio: 'inherit' });
console.log('Prepared original-resolution silent banner sources and poster; private source unchanged.');
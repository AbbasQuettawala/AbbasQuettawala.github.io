// Run from Website/Source. Original media stays outside the public repository.
import { execFileSync } from 'node:child_process';
import { mkdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';
const source = new URL('../../Media/Waddle/', import.meta.url);
const output = new URL('../public/media/waddle/', import.meta.url);
await mkdir(output, { recursive: true });
const clips = [
  { file:'Final SharonAI Video.mov', name:'sharon-ai-full', audio:true, poster:115 },
  { file:'Open Day Solidworks Video.mov', name:'solidworks-tour', seconds:60, poster:4 },
  { file:'urdf_showcase.mp4', name:'urdf-preview', poster:10 },
  { file:'2026-07-25 14-27-15.mp4', name:'simulation-development', poster:15 },
  { file:'2026-08-08 22-54-24.mp4', name:'simulation-playback', poster:12 },
  { file:'2026-10-04 21-12-54.mp4', name:'parallel-simulation', poster:8 },
];
for (const clip of clips) {
  const input = fileURLToPath(new URL(clip.file, source));
  const args = ['-hide_banner','-loglevel','error','-nostdin','-n','-i',input];
  if (clip.seconds) args.push('-t',String(clip.seconds));
  args.push('-map','0:v:0','-vf',`scale=1920:1080:force_original_aspect_ratio=decrease:force_divisible_by=2,fps=${clip.audio?25:30}`,
    '-c:v','libx264','-preset','fast','-crf','24','-threads','6','-pix_fmt','yuv420p','-maxrate',clip.audio?'1800k':'2200k','-bufsize','4400k');
  if (clip.audio) args.push('-map','0:a:0','-c:a','aac','-b:a','128k');
  else args.push('-an');
  args.push('-map_metadata','-1','-map_chapters','-1','-movflags','+faststart',fileURLToPath(new URL(`${clip.name}.mp4`,output)));
  console.log(`Encoding ${clip.name}...`);
  execFileSync('ffmpeg',args,{stdio:'inherit'});
  execFileSync('ffmpeg',['-v','error','-nostdin','-n','-ss',String(clip.poster),'-i',input,'-frames:v','1',
    '-vf','scale=1280:-2','-c:v','libwebp','-quality','82',fileURLToPath(new URL(`${clip.name}-poster.webp`,output))],{stdio:'inherit'});
}
for (const [file,name,width] of [['D3S_3855 (1).JPG','showcase',1600],['D3S_3855 (1).JPG','showcase-card',800],['image.png','team',1600]]) {
  await sharp(fileURLToPath(new URL(file,source))).rotate().resize({width,withoutEnlargement:true}).webp({quality:82}).toFile(fileURLToPath(new URL(`${name}.webp`,output)));
}
console.log('Waddle web copies complete. Originals unchanged.');

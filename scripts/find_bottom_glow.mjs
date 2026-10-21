import fs from 'fs';

const mainHtml = fs.readFileSync('work/analysis/signed_in/live_main_outer.html', 'utf8');

// Find glow or background gradient or canvas
const glowMatches = [...mainHtml.matchAll(/(?:style|class)="([^"]*(?:gradient|glow|radial|red|color-mix|blur|overflow)[^"]*)"/gi)].map(m => m[0]);
console.log('Glow/Gradient matches in main:');
console.log(glowMatches.slice(0, 15));

// Check any SVGs in main
const svgMatches = [...mainHtml.matchAll(/<svg[^>]*>([\s\S]*?)<\/svg>/g)].map(m => m[0]);
console.log('Total SVGs in main:', svgMatches.length);

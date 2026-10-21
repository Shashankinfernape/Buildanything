import fs from 'fs';

const html = fs.readFileSync('work/analysis/section9-footer-live-dom.html', 'utf8');

const socialLinks = [...html.matchAll(/<a[^>]*href="(https:\/\/(?:x\.com|www\.youtube\.com|www\.linkedin\.com|www\.instagram\.com|www\.facebook\.com|www\.tiktok\.com)[^"]*)"[^>]*>([\s\S]*?)<\/a>/g)];

console.log('Social links count:', socialLinks.length);
for (const s of socialLinks) {
  console.log(`Href: ${s[1]}`);
  const svgMatch = s[2].match(/<svg[\s\S]*?<\/svg>/);
  if (svgMatch) {
    console.log(`SVG: ${svgMatch[0]}`);
  }
}

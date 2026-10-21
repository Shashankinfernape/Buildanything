import fs from 'fs';

const html = fs.readFileSync('work/analysis/signed_in/workspace_settings_nav_outer.html', 'utf8');

const regex = /<a[^>]+href=([^\s>]+)[^>]*>([\s\S]*?)<\/a>/g;
let match;
while ((match = regex.exec(html)) !== null) {
  const href = match[1];
  const text = match[2].replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
  console.log(`${href} -> ${text}`);
}

const sectionHeaders = [];
const headerRegex = /<(?:div|span|h[1-6])[^>]*class="[^"]*(?:uppercase|tracking-wider|text-xs|font-semibold)[^"]*"[^>]*>([\s\S]*?)<\/(?:div|span|h[1-6])>/g;
while ((match = headerRegex.exec(html)) !== null) {
  const text = match[1].replace(/<[^>]+>/g, '').trim();
  if (text) sectionHeaders.push(text);
}
console.log('Section headers:', [...new Set(sectionHeaders)]);

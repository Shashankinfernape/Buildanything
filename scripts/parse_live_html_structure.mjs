import fs from 'fs';

const navHtml = fs.readFileSync('work/analysis/signed_in/live_nav_outer.html', 'utf8');
const mainHtml = fs.readFileSync('work/analysis/signed_in/live_main_outer.html', 'utf8');

console.log('--- Analyzing Live Nav Elements ---');
// Extract buttons and links in nav
const navButtons = [...navHtml.matchAll(/<(?:button|a)[^>]*>([\s\S]*?)<\/(?:button|a)>/g)].map(m => {
  const full = m[0];
  const text = m[1].replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
  const aria = full.match(/aria-label="([^"]+)"/)?.[1];
  return { tag: full.startsWith('<a') ? 'a' : 'button', text, aria };
}).filter(b => b.text || b.aria);

console.log('Nav buttons/links count:', navButtons.length);
console.log('Sample nav items:');
console.log(JSON.stringify(navButtons.slice(0, 25), null, 2));

console.log('\n--- Analyzing Live Main Elements ---');
// Extract buttons, headings, text in main
const mainHeadings = [...mainHtml.matchAll(/<h[1-6][^>]*>([\s\S]*?)<\/h[1-6]>/g)].map(m => m[1].replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim());
console.log('Main Headings:', mainHeadings);

const mainButtons = [...mainHtml.matchAll(/<(?:button|a)[^>]*>([\s\S]*?)<\/(?:button|a)>/g)].map(m => {
  const full = m[0];
  const text = m[1].replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
  const aria = full.match(/aria-label="([^"]+)"/)?.[1];
  return { tag: full.startsWith('<a') ? 'a' : 'button', text, aria };
}).filter(b => b.text || b.aria);

console.log('Main buttons count:', mainButtons.length);
console.log('Main buttons/links:');
console.log(JSON.stringify(mainButtons, null, 2));

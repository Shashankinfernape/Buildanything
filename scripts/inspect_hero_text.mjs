import fs from 'fs';

const html = fs.readFileSync('work/target_artifacts/replit/live-rendered-snapshot.html', 'utf8');
const headerEnd = html.indexOf('</header>');
const heroHtml = html.slice(headerEnd + 9, headerEnd + 25000);

// Let's find where the hero container ends
// Look for headings, textareas, inputs, and buttons in hero
const h1Match = heroHtml.match(/<h1[^>]*>([\s\S]*?)<\/h1>/);
console.log('H1:', h1Match ? h1Match[1].replace(/<[^>]+>/g, '').trim() : 'Not found');

const textareaMatch = heroHtml.match(/<textarea[^>]*>([\s\S]*?)<\/textarea>/);
console.log('Textarea:', textareaMatch ? textareaMatch[0] : 'None');

const promptMatches = heroHtml.match(/placeholder="([^"]+)"/g);
console.log('Placeholders:', promptMatches);

const buttonMatches = Array.from(heroHtml.matchAll(/<button[^>]*>([\s\S]*?)<\/button>/g)).map(m => m[1].replace(/<[^>]+>/g, '').trim()).filter(Boolean);
console.log('Buttons:', buttonMatches);

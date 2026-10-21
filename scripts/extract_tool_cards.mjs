import fs from 'fs';

const html = fs.readFileSync('work/analysis/signed_in/workspace_main_outer.html', 'utf8');

// Find all tool cards
const cards = [];
const cardRegex = /<button[^>]*aria-label="([^"]+)"[^>]*>([\s\S]*?)<\/button>/g;
let m;
while ((m = cardRegex.exec(html)) !== null) {
  cards.push({
    label: m[1],
    text: m[2].replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim()
  });
}

console.log('Tool cards:', cards);

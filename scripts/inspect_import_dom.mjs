import fs from 'fs';

const html = fs.readFileSync('work/analysis/signed_in/import_main_outer.html', 'utf8');
const cardRegex = /<a [^>]*data-cy=\"([^\"]+)\"[^>]*>([\s\S]*?)<\/a>/g;
let m;
const cards = [];
while ((m = cardRegex.exec(html)) !== null) {
  const cy = m[1];
  const body = m[2];
  const titleMatch = body.match(/<span[^>]*style=\"font-weight:500\"[^>]*>([^<]+)<\/span>/i) || body.match(/<span[^>]*font-medium[^>]*>([^<]+)<\/span>/i);
  const descMatch = body.match(/<span[^>]*text-color-secondary[^>]*>([^<]+)<\/span>/i);
  cards.push({
    cy,
    title: titleMatch ? titleMatch[1].trim() : '',
    desc: descMatch ? descMatch[1].trim() : ''
  });
}
console.log(JSON.stringify(cards, null, 2));

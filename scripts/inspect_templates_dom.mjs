import fs from 'fs';

const html = fs.readFileSync('work/analysis/section4-templates-live-dom.html', 'utf8');

// Find all chips
const chips = Array.from(html.matchAll(/data-analytics-id="template_filter_chip"[^>]*>([^<]+)<\/button>/g)).map(m => m[1]);
console.log('Chips:', chips);

// Find all template cards
const cardMatches = Array.from(html.matchAll(/data-analytics-id="template_card"[^>]*aria-label="([^"]+)"/g)).map(m => m[1]);
console.log('Template cards count:', cardMatches.length, cardMatches);

// Find all image srcs inside
const imgMatches = Array.from(html.matchAll(/<img[^>]+src="([^"]+)"/g)).map(m => m[1]);
console.log('Images inside templates:', imgMatches.length, imgMatches);

// Find browse all link
const browseLink = html.match(/data-analytics-id="template_browse_all_link"[^>]*>([^<]+)<\/a>/);
console.log('Browse all link text:', browseLink?.[1]);

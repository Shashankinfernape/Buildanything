import fs from 'fs';

const html = fs.readFileSync('work/analysis/signed_in/workspace_main_outer.html', 'utf8');

// Find all panels or tablists
const tabs = [...html.matchAll(/<div[^>]*data-tab-bar="true"[^>]*>([\s\S]*?)<\/div>/g)].map(m => m[1].replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim());
console.log('Tab bars found:', tabs);

// Find headers or titles
const titles = [...html.matchAll(/<div[^>]*title="([^"]+)"/g)].map(m => m[1]);
console.log('Titles found:', titles);

// Find text in all buttons
const btnTexts = [...html.matchAll(/<button[^>]*>([\s\S]*?)<\/button>/g)].map(m => m[1].replace(/<[^>]+>/g, '').trim()).filter(Boolean);
console.log('Button texts:', [...new Set(btnTexts)]);

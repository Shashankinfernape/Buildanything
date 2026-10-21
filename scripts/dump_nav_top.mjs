import fs from 'fs';

const navHtml = fs.readFileSync('work/analysis/signed_in/live_nav_outer.html', 'utf8');

// Parse the main top sections of nav
console.log('--- Nav Tag and Root classes ---');
console.log(navHtml.slice(0, 500));

// Find Search and Workspace Menu
const searchIdx = navHtml.indexOf('aria-label="Search"');
console.log('Search button snippet:\n', navHtml.slice(searchIdx - 100, searchIdx + 400));

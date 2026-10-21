import fs from 'fs';

const nav = fs.readFileSync('work/analysis/signed_in/live_nav_outer.html', 'utf8');
const searchIdx = nav.indexOf('aria-label="Search"');
console.log('--- AROUND SEARCH ---');
console.log(nav.slice(Math.max(0, searchIdx - 500), searchIdx + 400));

const wsIdx = nav.indexOf('Personal workspace');
console.log('--- AROUND PERSONAL WORKSPACE ---');
console.log(nav.slice(Math.max(0, wsIdx - 500), wsIdx + 400));

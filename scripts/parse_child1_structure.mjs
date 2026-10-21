import fs from 'fs';

const html = fs.readFileSync('work/analysis/live_child1_outer.html', 'utf8');
// Let's parse with jsdom or just inspect the tags
const lines = html.replace(/></g, '>\n<').split('\n');
console.log('Total elements/lines:', lines.length);

// Let's print the first 40 lines
console.log('--- START OF CHILD 1 ---');
console.log(lines.slice(0, 30).join('\n'));
console.log('--- END OF PREVIEW ---');

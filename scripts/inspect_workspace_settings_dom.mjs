import fs from 'fs';

const html = fs.readFileSync('work/analysis/signed_in/workspace_settings_main_outer.html', 'utf8');
const idx = html.indexOf('tablet-min:max-w-[1184px]');
console.log('--- Workspace Settings Body ---');
console.log(html.slice(idx, idx + 4000));

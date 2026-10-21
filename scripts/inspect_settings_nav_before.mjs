import fs from 'fs';

const navHtml = fs.readFileSync('work/analysis/signed_in/workspace_settings_nav_outer.html', 'utf8');

const idx = navHtml.indexOf('data-settings-sidebar-navigation="true"');
console.log('Before settings sidebar nav (length:', idx, '):');
console.log(navHtml.slice(0, idx));

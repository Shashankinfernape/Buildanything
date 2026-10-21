import fs from 'fs';

const navHtml = fs.readFileSync('work/analysis/signed_in/workspace_settings_nav_outer.html', 'utf8');
console.log('Nav length:', navHtml.length);

// Check if nav has back button or top header
const topPart = navHtml.slice(0, 3000);
console.log('Top part of settings nav:');
console.log(topPart.replace(/>/g, '>\n').slice(0, 1500));

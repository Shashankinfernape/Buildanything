import fs from 'fs';

const navHtml = fs.readFileSync('work/analysis/signed_in/live_nav_outer.html', 'utf8');

const taskIdx = navHtml.indexOf('>New task<');
if (taskIdx !== -1) {
  const btnStart = navHtml.lastIndexOf('<button', taskIdx);
  const btnEnd = navHtml.indexOf('</button>', taskIdx) + 9;
  console.log('=== New task Button Exact HTML ===');
  console.log(navHtml.slice(btnStart, btnEnd));
}

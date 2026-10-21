import fs from 'fs';

const mainHtml = fs.readFileSync('work/analysis/signed_in/live_main_outer.html', 'utf8');

const recentIdx = mainHtml.indexOf('Recent projects');
if (recentIdx !== -1) {
  const cardsStart = mainHtml.indexOf('<ol', recentIdx);
  const cardsEnd = mainHtml.indexOf('</ol>', cardsStart) + 5;
  console.log('=== Recent Cards OL HTML ===');
  console.log(mainHtml.slice(cardsStart, cardsStart + 2500));
}

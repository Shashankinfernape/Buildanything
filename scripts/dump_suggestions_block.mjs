import fs from 'fs';

const mainHtml = fs.readFileSync('work/analysis/signed_in/live_main_outer.html', 'utf8');

const sIdx = mainHtml.indexOf('Suggested for you');
if (sIdx !== -1) {
  const formIdx = mainHtml.indexOf('aria-placeholder="Start chatting');
  console.log('=== Suggested for you Section HTML ===');
  console.log(mainHtml.slice(sIdx - 100, formIdx - 50));
}

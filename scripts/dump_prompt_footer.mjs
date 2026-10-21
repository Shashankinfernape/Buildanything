import fs from 'fs';

const mainHtml = fs.readFileSync('work/analysis/signed_in/live_main_outer.html', 'utf8');

const footerIdx = mainHtml.indexOf('aria-label="Start voice input"');
if (footerIdx !== -1) {
  console.log('=== Mic and Send Button ===');
  console.log(mainHtml.slice(footerIdx, footerIdx + 3000));
}

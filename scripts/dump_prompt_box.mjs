import fs from 'fs';

const mainHtml = fs.readFileSync('work/analysis/signed_in/live_main_outer.html', 'utf8');

const taIdx = mainHtml.indexOf('aria-placeholder="Start chatting or describe a task..."');
if (taIdx !== -1) {
  console.log('=== Prompt Box 400 chars before and 1800 chars after ===');
  console.log(mainHtml.slice(taIdx - 400, taIdx + 1800));
}

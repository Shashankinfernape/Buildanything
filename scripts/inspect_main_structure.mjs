import fs from 'fs';

const mainHtml = fs.readFileSync('work/analysis/signed_in/live_main_outer.html', 'utf8');

// Match the main inner container with width ~750px
const divMatches = [...mainHtml.matchAll(/<div[^>]*class="([^"]*max-w-[^"]*|[^"]*w-\[[^"]*|[^"]*mx-auto[^"]*|[^"]*flex-col[^"]*)"[^>]*>/g)].map(m => m[0]);
console.log('Main container matches:');
for (const d of divMatches.slice(0, 10)) {
  console.log(d.slice(0, 150));
}

// Find the prompt box container
const promptIdx = mainHtml.indexOf('Start chatting or describe a task');
if (promptIdx !== -1) {
  console.log('\n--- Prompt Box HTML snippet (first 1000 chars) ---');
  console.log(mainHtml.slice(promptIdx - 300, promptIdx + 700));
}

import fs from 'fs';

const html = fs.readFileSync('work/analysis/signed_in/workspace_main_outer.html', 'utf8');

['Tools', 'Main.java', 'Console', 'Shell'].forEach(word => {
  const idx = html.indexOf(word);
  console.log(`\n=== Word: "${word}" (idx: ${idx}) ===`);
  if (idx !== -1) {
    console.log(html.slice(Math.max(0, idx - 200), idx + 200));
  }
});

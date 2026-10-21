import fs from 'fs';

const html = fs.readFileSync('work/analysis/live_child1_outer.html', 'utf8');
const regex = /<span class="[^"]*">([^<]+)<\/span>/g;
let m;
while ((m = regex.exec(html)) !== null) {
  console.log(m[1]);
}

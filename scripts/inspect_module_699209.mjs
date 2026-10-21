import fs from 'fs';

const dir = 'work/recovered-modules-combined';
const m = fs.readdirSync(dir).filter(f => f.includes('699209'));
console.log(m);
if (m.length > 0) {
  const content = fs.readFileSync(`${dir}/${m[0]}`, 'utf8');
  console.log(content.slice(0, 3000));
}

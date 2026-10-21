import fs from 'fs';

const files = [
  'work/reconstruction/public/css/0bi9igdhgedn-.css',
  'work/reconstruction/public/css/20vunzhr_pfbh.css',
  'work/reconstruction/public/css/2crx7tcomwfu9.css',
  'work/reconstruction/public/css/3gc71r1qd881c.css',
  'work/reconstruction/public/css/3yw_f5s0f08l2.css'
];

for (const f of files) {
  const content = fs.readFileSync(f, 'utf8');
  for (const needle of ['pt-[84px]', 'rounded-[60px]', 'bg-[#fff]', '312e2e', 'BubbleFancyS', 'BubbleFancy']) {
    const idx = content.indexOf(needle);
    if (idx !== -1) {
      console.log('Found ' + needle + ' in ' + f + ' at index ' + idx);
    }
  }
}

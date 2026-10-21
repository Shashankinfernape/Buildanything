import fs from 'fs';

const content = fs.readFileSync('work/recovered-modules-combined/0s3yr0uspu_ki__module-635549.js', 'utf8');
console.log('Length:', content.length);
console.log(content.slice(0, 3000));

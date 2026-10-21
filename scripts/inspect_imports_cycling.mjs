import fs from 'fs';

const content = fs.readFileSync('work/recovered-modules-combined/0p8wmwf9uh84o__module-127388.js', 'utf8');
const lines = content.split('\n');
for (let i = 0; i < 200; i++) {
  if (lines[i].includes('useCyclingPlaceholder') || lines[i].includes('SuggestedPrompts') || lines[i].includes('CompactStackingBox')) {
    console.log(`Line ${i + 1}: ${lines[i]}`);
  }
}

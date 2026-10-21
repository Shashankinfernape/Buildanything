import fs from 'fs';

const content = fs.readFileSync('work/recovered-modules-combined/0p8wmwf9uh84o__module-127388.js', 'utf8');

// Search for placeholder or typewriter or examples
const lines = content.split('\n');
for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes('typewriter') || lines[i].includes('placeholder') || lines[i].includes('example') || lines[i].includes('suggestedPrompts')) {
    console.log(`Line ${i + 1}: ${lines[i].slice(0, 150)}`);
  }
}

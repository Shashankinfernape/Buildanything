import fs from 'fs';
import { execSync } from 'child_process';

const appCapture = JSON.parse(fs.readFileSync('work/target_artifacts/replit/page-capture.json', 'utf8'));

const input = {
  application: appCapture,
  seed: {
    kind: 'string',
    value: 'What will you build?'
  }
};

fs.writeFileSync('work/analysis/hero-trace-input.json', JSON.stringify(input), 'utf8');
console.log('Running rea trace-application-feature with seed "What will you build?"...');

try {
  const out = execSync('rea trace-application-feature work/analysis/hero-trace-input.json --format json', {
    encoding: 'utf8',
    maxBuffer: 50 * 1024 * 1024
  });
  fs.writeFileSync('work/analysis/hero-trace-output.json', out, 'utf8');
  console.log('Trace successful! Saved to work/analysis/hero-trace-output.json');
  console.log(out.slice(0, 500));
} catch (err) {
  console.error('Trace error:', err.stdout || err.stderr || err.message);
}

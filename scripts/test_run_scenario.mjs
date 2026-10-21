import { execSync } from 'child_process';
import fs from 'fs';

console.log('Running rea capture-browser-scenario...');
const out = execSync('rea capture-browser-scenario "work/scenarios/test_recon_scenario.json" --format json', { maxBuffer: 100 * 1024 * 1024, encoding: 'utf8' });
const json = JSON.parse(out);

fs.writeFileSync('work/captures/recon_scenario_capture.json', out);

console.log('Result keys:', Object.keys(json.normalized_result));
console.log('Duration ms:', json.normalized_result.duration_ms);
console.log('Steps count:', json.normalized_result.steps.length);
json.normalized_result.steps.forEach(s => {
  console.log(`  -> Step ${s.step_index}: id=${s.step_id}, action=${s.action}, status=${s.status}, elapsed=${s.elapsed_ms}ms`);
});

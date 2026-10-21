import { execSync } from 'child_process';
import fs from 'fs';

console.log('Capturing routines scenario with REA...');
try {
  const out = execSync('rea capture-browser-scenario "work/scenarios/routines_interaction.json" --format json', {
    maxBuffer: 100 * 1024 * 1024,
    encoding: 'utf8'
  });
  fs.writeFileSync('work/captures/routines_scenario_capture.json', out);
  const json = JSON.parse(out);
  console.log('Status: success!');
  console.log('Duration ms:', json.normalized_result.duration_ms);
  console.log('Steps count:', json.normalized_result.steps.length);
  json.normalized_result.steps.forEach(s => {
    console.log(`  -> Step ${s.step_index}: id=${s.step_id}, action=${s.action}, status=${s.status}, elapsed=${s.elapsed_ms}ms`);
  });
} catch (err) {
  console.error('Error stdout:', err.stdout?.toString());
  console.error('Error stderr:', err.stderr?.toString());
}

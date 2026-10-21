import fs from 'fs';

const cap = JSON.parse(fs.readFileSync('work/captures/security_scenario_capture.json', 'utf8'));
cap.normalized_result.steps.forEach(s => {
  if (s.artifacts?.screenshot?.value?.data_base64) {
    fs.writeFileSync(`analysis/screens/step_${s.step_index}_${s.step_id}.png`, Buffer.from(s.artifacts.screenshot.value.data_base64, 'base64'));
    console.log(`Saved analysis/screens/step_${s.step_index}_${s.step_id}.png`);
  }
});

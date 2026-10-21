import fs from 'fs';

const cap = JSON.parse(fs.readFileSync('work/captures/security_scenario_capture.json', 'utf8'));
const step5 = cap.normalized_result.steps.find(s => s.step_id === 'wait_menu_open');
console.log('Step 5 status:', step5.status);
console.log('Step 5 artifacts:', Object.keys(step5.artifacts || {}));

if (step5.artifacts?.accessibility) {
  const nodes = step5.artifacts.accessibility.nodes || [];
  console.log('Total a11y nodes:', nodes.length);
  const matched = nodes.filter(n => n.role === 'option' || (n.name && n.name.includes('High')));
  console.log('Matched a11y nodes:', matched);
}

if (step5.artifacts?.dom) {
  const html = step5.artifacts.dom.html || '';
  console.log('DOM html length:', html.length);
  const idx = html.indexOf('role="listbox"');
  if (idx !== -1) {
    console.log('Found listbox in DOM:');
    console.log(html.substring(idx - 50, idx + 400));
  } else {
    console.log('role="listbox" not found in DOM!');
  }
}

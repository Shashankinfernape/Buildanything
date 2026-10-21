import { execSync } from 'child_process';
import path from 'path';

const regions = [
  ['Full Dashboard', 'work/captures/live_dashboard_artifact.json', 'work/captures/recon_dashboard_artifact.json'],
  ['Sidebar', 'work/captures/live_sidebar.json', 'work/captures/recon_sidebar.json'],
  ['Recent Cards', 'work/captures/live_recent_cards.json', 'work/captures/recon_recent_cards.json'],
  ['Greeting Block', 'work/captures/live_greeting_block.json', 'work/captures/recon_greeting_block.json'],
  ['Suggested Chips', 'work/captures/live_suggested_chips.json', 'work/captures/recon_suggested_chips.json'],
  ['Prompt Box', 'work/captures/live_prompt_box.json', 'work/captures/recon_prompt_box.json'],
  ['Bottom Glow', 'work/captures/live_bottom_glow.json', 'work/captures/recon_bottom_glow.json'],
];

console.log('=== AUDITING HOME DASHBOARD REGIONS VIA REA ===\n');

for (const [name, liveRel, reconRel] of regions) {
  try {
    const live = path.resolve(liveRel);
    const recon = path.resolve(reconRel);
    const out = execSync(`rea compare-web-screenshots "${live}" "${recon}" --channel-threshold 5 --format json --filter-output normalized_result`, { encoding: 'utf8' });
    const r = JSON.parse(out).normalized_result;
    const ratio = (r.changed_ratio * 100).toFixed(2);
    const pass = r.changed_ratio < 0.15 ? 'PASS' : 'FAIL';
    console.log(`${name.padEnd(18)}: ${ratio.padStart(6)}% changed (changed: ${r.changed_pixels}, compared: ${r.compared_pixels}, delta: ${r.mean_absolute_channel_delta.toFixed(3)}) -> ${pass}`);
  } catch (e) {
    console.error(`${name.padEnd(18)}: Error: ${e.message}`);
  }
}

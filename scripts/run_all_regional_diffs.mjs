import WebSocket from 'ws';
import crypto from 'crypto';
import fs from 'fs';
import { execSync } from 'child_process';

const liveTarget = '4D5803D83D1C78981FF3E408A2F4B2D5';
const reconTarget = '6D4B931B5EC0B7BE74E378FA2E19EDD9';

const regions = [
  { name: 'sidebar', clip: { x: 0, y: 0, width: 240, height: 765 } },
  { name: 'recent_cards', clip: { x: 464, y: 20, width: 752, height: 140 } },
  { name: 'greeting_block', clip: { x: 464, y: 400, width: 752, height: 50 } },
  { name: 'suggested_chips', clip: { x: 464, y: 460, width: 752, height: 160 } },
  { name: 'prompt_box', clip: { x: 464, y: 625, width: 752, height: 115 } },
  { name: 'bottom_glow', clip: { x: 240, y: 500, width: 1200, height: 265 } }
];

async function captureClip(targetId, clip) {
  const tabs = await fetch('http://127.0.0.1:9222/json').then(r => r.json());
  const tab = tabs.find(t => t.id === targetId);
  return new Promise((resolve, reject) => {
    const ws = new WebSocket(tab.webSocketDebuggerUrl);
    ws.on('open', () => {
      ws.send(JSON.stringify({ id: 1, method: 'Page.bringToFront' }));
      setTimeout(() => {
        ws.send(JSON.stringify({
          id: 2,
          method: 'Page.captureScreenshot',
          params: {
            format: 'png',
            clip: { ...clip, scale: 1 },
            captureBeyondViewport: false
          }
        }));
      }, 150);
    });
    ws.on('message', data => {
      const msg = JSON.parse(data);
      if (msg.id === 2) {
        ws.close();
        if (msg.error) return reject(msg.error);
        const b64 = msg.result.data;
        const buf = Buffer.from(b64, 'base64');
        const sha256 = crypto.createHash('sha256').update(buf).digest('hex');
        resolve({
          sha256,
          bytes: buf.length,
          media_type: 'image/png',
          data_base64: b64
        });
      }
    });
    ws.on('error', reject);
  });
}

async function main() {
  console.log('=== RUNNING REA REGIONAL COMPARISONS (Signed-In Dashboard) ===');
  const results = [];

  for (const reg of regions) {
    console.log(`\n[AGENT-COLLECTED] Region: ${reg.name} (x: ${reg.clip.x}, y: ${reg.clip.y}, w: ${reg.clip.width}, h: ${reg.clip.height})...`);
    const liveArt = await captureClip(liveTarget, reg.clip);
    const reconArt = await captureClip(reconTarget, reg.clip);

    const livePath = `work/captures/live_${reg.name}.json`;
    const reconPath = `work/captures/recon_${reg.name}.json`;
    fs.writeFileSync(livePath, JSON.stringify(liveArt, null, 2));
    fs.writeFileSync(reconPath, JSON.stringify(reconArt, null, 2));

    // Save PNGs for review
    fs.writeFileSync(`work/analysis/screens/live_${reg.name}.png`, Buffer.from(liveArt.data_base64, 'base64'));
    fs.writeFileSync(`work/analysis/screens/recon_${reg.name}.png`, Buffer.from(reconArt.data_base64, 'base64'));

    // Run REA diff at threshold 5
    const out5 = execSync(`rea compare-web-screenshots "${livePath}" "${reconPath}" --channel-threshold 5 --format json`, { encoding: 'utf8' });
    const diff5 = JSON.parse(out5).normalized_result;

    // Run REA diff at threshold 1
    const out1 = execSync(`rea compare-web-screenshots "${livePath}" "${reconPath}" --channel-threshold 1 --format json`, { encoding: 'utf8' });
    const diff1 = JSON.parse(out1).normalized_result;

    const res = {
      region: reg.name,
      clip: reg.clip,
      compared_pixels: diff5.compared_pixels,
      changed_pixels_t5: diff5.changed_pixels,
      changed_ratio_t5: (diff5.changed_ratio * 100).toFixed(2) + '%',
      changed_pixels_t1: diff1.changed_pixels,
      changed_ratio_t1: (diff1.changed_ratio * 100).toFixed(2) + '%',
      mean_channel_delta: diff5.mean_absolute_channel_delta.toFixed(3)
    };
    results.push(res);
    console.log(`  -> Threshold 5: ${res.changed_ratio_t5} changed (${res.changed_pixels_t5}/${res.compared_pixels})`);
    console.log(`  -> Threshold 1: ${res.changed_ratio_t1} changed (${res.changed_pixels_t1}/${res.compared_pixels})`);
    console.log(`  -> Mean Channel Delta: ${res.mean_channel_delta}`);
  }

  console.log('\n=== SUMMARY OF REGIONAL DIFFS ===');
  console.table(results);

  fs.writeFileSync('work/analysis/compare/signed_in_regional_diffs.json', JSON.stringify(results, null, 2));
}

main().catch(console.error);

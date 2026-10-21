import WebSocket from 'ws';
import { execSync } from 'child_process';
import fs from 'fs';

const TARGET_ID = '4D5803D83D1C78981FF3E408A2F4B2D5';

async function main() {
  const ws = new WebSocket(`ws://127.0.0.1:9222/devtools/page/${TARGET_ID}`);
  await new Promise(r => ws.onopen = r);
  let cid = 1;
  const send = (m, p={}) => new Promise(res => {
    const id = cid++;
    const handler = d => {
      const j = JSON.parse(d);
      if (j.id === id) {
        ws.removeListener('message', handler);
        res(j.result);
      }
    };
    ws.on('message', handler);
    ws.send(JSON.stringify({ id, method: m, params: p }));
  });

  console.log('[AGENT-COLLECTED] Setting viewport to 1440x900...');
  await send('Emulation.setDeviceMetricsOverride', {
    width: 1440,
    height: 900,
    deviceScaleFactor: 1,
    mobile: false
  });
  await send('Runtime.evaluate', { expression: 'window.scrollTo(0, 0)' });
  await new Promise(r => setTimeout(r, 600));

  console.log('[AGENT-COLLECTED] Running rea capture-web-screenshot on Home Dashboard...');
  const out = execSync(`npx rea capture-web-screenshot http://127.0.0.1:9222 ${TARGET_ID} --format json`, {
    encoding: 'utf8',
    maxBuffer: 50 * 1024 * 1024
  });

  const parsed = JSON.parse(out);
  fs.writeFileSync('work/analysis/signed_in/live_home_dashboard_artifact.json', JSON.stringify(parsed, null, 2), 'utf8');

  if (parsed.normalized_result?.data_base64) {
    const buf = Buffer.from(parsed.normalized_result.data_base64, 'base64');
    fs.writeFileSync('work/analysis/signed_in/live_home_dashboard.png', buf);
    console.log('Saved live_home_dashboard.png, bytes:', buf.length);
  }

  console.log('Screenshot SHA256:', parsed.normalized_result?.sha256);
  console.log('Width:', parsed.normalized_result?.width, 'Height:', parsed.normalized_result?.height);

  ws.close();
}

main().catch(console.error);

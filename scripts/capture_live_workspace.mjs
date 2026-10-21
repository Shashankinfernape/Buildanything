import WebSocket from 'ws';
import { execSync } from 'child_process';
import fs from 'fs';

const TARGET_ID = '32D66469546778B874EB0E14C1442401';

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

  console.log('[AGENT-COLLECTED] Setting viewport to 1440x900 on Workspace...');
  await send('Emulation.setDeviceMetricsOverride', {
    width: 1440,
    height: 900,
    deviceScaleFactor: 1,
    mobile: false
  });
  await new Promise(r => setTimeout(r, 1200));

  console.log('[AGENT-COLLECTED] Running rea capture-web-screenshot on Workspace...');
  const out = execSync(`npx rea capture-web-screenshot http://127.0.0.1:9222 ${TARGET_ID} --format json`, {
    encoding: 'utf8',
    maxBuffer: 50 * 1024 * 1024
  });

  const parsed = JSON.parse(out);
  fs.writeFileSync('work/analysis/signed_in/live_workspace_artifact.json', JSON.stringify(parsed, null, 2), 'utf8');

  const art = parsed.normalized_result?.artifact;
  if (art?.data_base64) {
    const buf = Buffer.from(art.data_base64, 'base64');
    fs.writeFileSync('work/analysis/signed_in/live_workspace.png', buf);
    console.log('Saved live_workspace.png, bytes:', buf.length, 'sha256:', art.sha256);
  }

  ws.close();
}

main().catch(console.error);

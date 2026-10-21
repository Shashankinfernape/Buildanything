import { execSync } from 'child_process';
import fs from 'fs';

async function setViewport(targetId, width, height) {
  const ws = new WebSocket(`ws://127.0.0.1:9222/devtools/page/${targetId}`);
  await new Promise(r => ws.onopen = r);
  let id = 1;
  const send = (method, params) => new Promise(resolve => {
    const curId = id++;
    const handler = (event) => {
      const data = JSON.parse(event.data);
      if (data.id === curId) {
        ws.removeEventListener('message', handler);
        resolve(data.result);
      }
    };
    ws.addEventListener('message', handler);
    ws.send(JSON.stringify({ id: curId, method, params }));
  });

  await send('Emulation.setDeviceMetricsOverride', {
    width,
    height,
    deviceScaleFactor: 1,
    mobile: false
  });
  ws.close();
}

async function main() {
  const LIVE_ID = '0CEBF5F820FA8AA89465BD16147DDED9';
  const RECON_ID = 'A7DF9577D21FF635BD6EF295E92FAEC1';

  console.log('1. Setting 1440x900 viewport on Live target...');
  await setViewport(LIVE_ID, 1440, 900);

  console.log('2. Setting 1440x900 viewport on Reconstruction target...');
  await setViewport(RECON_ID, 1440, 900);

  console.log('3. Capturing Live 1440 screenshot via REA...');
  const liveOut = execSync(`rea capture-web-screenshot http://127.0.0.1:9222 ${LIVE_ID} --format json`, {
    encoding: 'utf8',
    maxBuffer: 50 * 1024 * 1024
  });
  fs.writeFileSync('work/target_artifacts/replit/live-1440-screenshot-evidence.json', liveOut, 'utf8');
  const liveData = JSON.parse(liveOut);
  fs.writeFileSync(
    'work/target_artifacts/replit/live-1440-screenshot-artifact.json',
    JSON.stringify(liveData.normalized_result?.artifact, null, 2),
    'utf8'
  );

  console.log('4. Capturing Reconstruction 1440 screenshot via REA...');
  const reconOut = execSync(`rea capture-web-screenshot http://127.0.0.1:9222 ${RECON_ID} --format json`, {
    encoding: 'utf8',
    maxBuffer: 50 * 1024 * 1024
  });
  fs.writeFileSync('work/target_artifacts/replit/recon-1440-screenshot-evidence.json', reconOut, 'utf8');
  const reconData = JSON.parse(reconOut);
  fs.writeFileSync(
    'work/target_artifacts/replit/recon-1440-screenshot-artifact.json',
    JSON.stringify(reconData.normalized_result?.artifact, null, 2),
    'utf8'
  );

  console.log('5. Running rea compare-web-screenshots with --channel-threshold 1...');
  const diffCmd = 'rea compare-web-screenshots work/target_artifacts/replit/live-1440-screenshot-artifact.json work/target_artifacts/replit/recon-1440-screenshot-artifact.json --channel-threshold 1 --format json';
  
  let diffOut;
  try {
    diffOut = execSync(diffCmd, { encoding: 'utf8', maxBuffer: 50 * 1024 * 1024 });
  } catch (err) {
    diffOut = err.stdout || err.stderr || err.message;
  }

  fs.writeFileSync('work/analysis/screenshot-pixel-diff-1440.json', diffOut, 'utf8');
  console.log('\n--- Real Output of rea compare-web-screenshots ---');
  console.log(diffOut);
}

main().catch(console.error);

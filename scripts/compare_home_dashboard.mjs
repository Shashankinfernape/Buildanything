import WebSocket from 'ws';
import { execSync } from 'child_process';
import fs from 'fs';

async function getTargets() {
  const res = await fetch('http://127.0.0.1:9222/json');
  return res.json();
}

async function run() {
  const targets = await getTargets();
  const reconTarget = targets.find(t => t.url.includes('5174'));
  if (!reconTarget) {
    throw new Error('Could not find recon tab running on port 5174');
  }
  console.log('Found recon target:', reconTarget.id, reconTarget.url);

  const ws = new WebSocket(`ws://127.0.0.1:9222/devtools/page/${reconTarget.id}`);
  await new Promise(r => ws.onopen = r);

  let cid = 1;
  const send = (m, p = {}) => new Promise(res => {
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

  // Set exact viewport
  console.log('[AGENT-COLLECTED] Configuring recon viewport 1440x900...');
  await send('Emulation.setDeviceMetricsOverride', {
    width: 1440,
    height: 900,
    deviceScaleFactor: 1,
    mobile: false
  });

  // Ensure signed_in mode & home screen, hide dev switcher
  await send('Runtime.evaluate', {
    expression: `
      window.__hideDevSwitcher = true;
      if (window.__setReconAppMode) window.__setReconAppMode('signed_in');
      if (window.__setReconScreen) window.__setReconScreen('home');
      const dev = document.getElementById('dev-mode-switcher');
      if (dev) dev.style.display = 'none';
      window.scrollTo(0, 0);
    `
  });
  await new Promise(r => setTimeout(r, 600));

  console.log('[AGENT-COLLECTED] Capturing recon Home Dashboard screenshot...');
  const captureOut = execSync(`npx rea capture-web-screenshot http://127.0.0.1:9222 ${reconTarget.id} --format json`, {
    encoding: 'utf8',
    maxBuffer: 50 * 1024 * 1024
  });

  const parsed = JSON.parse(captureOut);
  fs.writeFileSync('work/analysis/signed_in/recon_home_dashboard_artifact.json', JSON.stringify(parsed, null, 2), 'utf8');
  if (parsed.normalized_result?.data_base64) {
    const buf = Buffer.from(parsed.normalized_result.data_base64, 'base64');
    fs.writeFileSync('work/analysis/signed_in/recon_home_dashboard.png', buf);
    console.log('Saved recon_home_dashboard.png, bytes:', buf.length);
  }

  // Run compare-web-screenshots with live home dashboard
  console.log('Running rea compare-web-screenshots...');
  const compOut = execSync(
    'npx rea compare-web-screenshots work/analysis/signed_in/live_home_dashboard_artifact.json work/analysis/signed_in/recon_home_dashboard_artifact.json --channel-threshold 1 --format json',
    { encoding: 'utf8', maxBuffer: 50 * 1024 * 1024 }
  );

  const compResult = JSON.parse(compOut);
  fs.writeFileSync('work/analysis/signed_in/compare_home_dashboard.json', JSON.stringify(compResult, null, 2), 'utf8');
  console.log('Home Dashboard Comparison (threshold 1):', {
    changed_ratio: compResult.normalized_result?.changed_ratio,
    changed_pixels: compResult.normalized_result?.changed_pixels,
    total_pixels: compResult.normalized_result?.total_pixels,
    mean_channel_delta: compResult.normalized_result?.mean_channel_delta
  });

  ws.close();
}

run().catch(console.error);

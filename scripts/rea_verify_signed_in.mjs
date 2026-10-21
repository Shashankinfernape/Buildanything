import { execSync } from 'child_process';
import WebSocket from 'ws';
import fs from 'fs';
import path from 'path';

const LIVE_TARGET = '4D5803D83D1C78981FF3E408A2F4B2D5';
const RECON_TARGET = '6D4B931B5EC0B7BE74E378FA2E19EDD9';
const OUT_DIR = 'work/analysis/signed_in';

async function bringToFront(targetId) {
  const ws = new WebSocket(`ws://127.0.0.1:9222/devtools/page/${targetId}`);
  await new Promise(r => ws.onopen = r);
  let cid = 1;
  const send = (m, p = {}) => new Promise(res => {
    const id = cid++;
    ws.on('message', function h(d) {
      const j = JSON.parse(d);
      if (j.id === id) { ws.removeListener('message', h); res(j.result); }
    });
    ws.send(JSON.stringify({ id, method: m, params: p }));
  });

  await send('Page.bringToFront');
  await send('Emulation.setDeviceMetricsOverride', { width: 1440, height: 900, deviceScaleFactor: 1, mobile: false });
  await new Promise(r => setTimeout(r, 400));
  ws.close();
}

function captureScreenshotREA(targetId, filenamePrefix) {
  console.log(`[AGENT-COLLECTED] Running rea capture-web-screenshot for target ${targetId}...`);
  const evidencePath = path.join(OUT_DIR, `${filenamePrefix}_evidence.json`);
  const artifactPath = path.join(OUT_DIR, `${filenamePrefix}_artifact.json`);

  const stdout = execSync(`rea capture-web-screenshot http://127.0.0.1:9222 ${targetId} --format json`, {
    maxBuffer: 50 * 1024 * 1024,
    encoding: 'utf8'
  });
  fs.writeFileSync(evidencePath, stdout, 'utf8');

  const parsed = JSON.parse(stdout);
  const artifact = parsed.normalized_result?.artifact;
  fs.writeFileSync(artifactPath, JSON.stringify(artifact, null, 2), 'utf8');

  if (artifact?.data_base64) {
    const pngBuf = Buffer.from(artifact.data_base64, 'base64');
    fs.writeFileSync(path.join(OUT_DIR, `${filenamePrefix}.png`), pngBuf);
    console.log(`Saved ${filenamePrefix}.png, SHA: ${artifact.sha256}`);
  }

  return artifactPath;
}

function compareScreenshotsREA(beforeArtifact, afterArtifact, threshold) {
  console.log(`Running rea compare-web-screenshots (channel-threshold: ${threshold})...`);
  const cmd = `rea compare-web-screenshots "${beforeArtifact}" "${afterArtifact}" --channel-threshold ${threshold} --format json`;
  const stdout = execSync(cmd, {
    maxBuffer: 50 * 1024 * 1024,
    encoding: 'utf8'
  });
  return JSON.parse(stdout);
}

async function main() {
  console.log('=== Step 1: Bringing Live Target to front & capturing with REA ===');
  await bringToFront(LIVE_TARGET);
  const liveArtifactPath = captureScreenshotREA(LIVE_TARGET, 'rea_live_dashboard');

  console.log('\n=== Step 2: Bringing Recon Target to front & capturing with REA ===');
  await bringToFront(RECON_TARGET);
  const reconArtifactPath = captureScreenshotREA(RECON_TARGET, 'rea_recon_dashboard');

  console.log('\n=== Step 3: Running rea compare-web-screenshots ===');
  const diffThreshold1 = compareScreenshotsREA(liveArtifactPath, reconArtifactPath, 1);
  const diffThreshold5 = compareScreenshotsREA(liveArtifactPath, reconArtifactPath, 5);
  const diffThreshold10 = compareScreenshotsREA(liveArtifactPath, reconArtifactPath, 10);

  const diffResult = {
    operation: 'compare_web_screenshots',
    provider: 'rea-cdp-browser',
    compared_pixels: diffThreshold1.normalized_result?.compared_pixels,
    threshold_1: {
      changed_pixels: diffThreshold1.normalized_result?.changed_pixels,
      changed_ratio: diffThreshold1.normalized_result?.changed_ratio,
      mean_absolute_channel_delta: diffThreshold1.normalized_result?.mean_absolute_channel_delta,
      max_channel_delta: diffThreshold1.normalized_result?.maximum_channel_delta
    },
    threshold_5: {
      changed_pixels: diffThreshold5.normalized_result?.changed_pixels,
      changed_ratio: diffThreshold5.normalized_result?.changed_ratio
    },
    threshold_10: {
      changed_pixels: diffThreshold10.normalized_result?.changed_pixels,
      changed_ratio: diffThreshold10.normalized_result?.changed_ratio
    }
  };

  console.log('\n--- REA compare-web-screenshots Real Output ---');
  console.log(JSON.stringify(diffResult, null, 2));

  fs.writeFileSync(path.join(OUT_DIR, 'rea_dashboard_diff.json'), JSON.stringify(diffResult, null, 2), 'utf8');
}

main().catch(console.error);

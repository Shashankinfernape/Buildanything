import WebSocket from 'ws';
import { execSync } from 'child_process';
import crypto from 'crypto';
import fs from 'fs';

const LIVE_ID = '0CEBF5F820FA8AA89465BD16147DDED9';
const RECON_ID = 'A7DF9577D21FF635BD6EF295E92FAEC1';

function createCdpSender(targetId) {
  return new Promise(async (resolve, reject) => {
    try {
      const ws = new WebSocket(`ws://127.0.0.1:9222/devtools/page/${targetId}`);
      await new Promise(r => ws.onopen = r);
      let cid = 1;
      const send = (method, params = {}) => new Promise((res, rej) => {
        const curId = cid++;
        const timer = setTimeout(() => rej(new Error(`CDP timeout: ${method}`)), 10000);
        const handler = (evt) => {
          const data = JSON.parse(evt.data);
          if (data.id === curId) {
            clearTimeout(timer);
            ws.removeEventListener('message', handler);
            res(data.result);
          }
        };
        ws.addEventListener('message', handler);
        ws.send(JSON.stringify({ id: curId, method, params }));
      });
      resolve({ ws, send });
    } catch (err) {
      reject(err);
    }
  });
}

const dropdowns = [
  { name: 'Products', panelId: 'marketing-header-panel-d7e540c5b986' },
  { name: 'Solutions', panelId: 'marketing-header-panel-00b55aa0ebe3' },
  { name: 'Resources', panelId: 'marketing-header-panel-20e7c4f7ecfe' }
];

async function run() {
  const summary = [];

  for (const dd of dropdowns) {
    console.log(`\n==================================================`);
    console.log(`Dropdown Panel Crop: ${dd.name}`);
    console.log(`==================================================`);

    // 1. OPEN LIVE VIA REAL MOUSE EVENT & GET PANEL BOUNDING BOX
    const liveCdp = await createCdpSender(LIVE_ID);
    await liveCdp.send('Page.bringToFront');

    const liveBtnCoords = await liveCdp.send('Runtime.evaluate', {
      expression: `(() => {
        const btns = Array.from(document.querySelectorAll("header button")).filter(b => (b.innerText || '').includes("${dd.name}"));
        const r = btns[0].getBoundingClientRect();
        return { x: r.x + r.width / 2, y: r.y + r.height / 2 };
      })()`,
      returnByValue: true
    });
    const liveBtn = liveBtnCoords.result.value;

    console.log(`[AGENT-COLLECTED] Moving mouse to Live ${dd.name} button: (${liveBtn.x}, ${liveBtn.y})`);
    await liveCdp.send('Input.dispatchMouseEvent', { type: 'mouseMoved', x: 0, y: 0 });
    await new Promise(r => setTimeout(r, 100));
    await liveCdp.send('Input.dispatchMouseEvent', { type: 'mouseMoved', x: liveBtn.x, y: liveBtn.y });
    await new Promise(r => setTimeout(r, 450));

    // Get live panel bounding box
    const panelBoxRes = await liveCdp.send('Runtime.evaluate', {
      expression: `(() => {
        const p = document.getElementById("${dd.panelId}");
        const r = p.getBoundingClientRect();
        return {
          x: Math.round(r.x),
          y: Math.round(r.y),
          width: Math.round(r.width),
          height: Math.round(r.height)
        };
      })()`,
      returnByValue: true
    });
    const panelBox = panelBoxRes.result.value;
    console.log(`[AGENT-COLLECTED] Live ${dd.name} panel bounding box:`, panelBox);

    // Capture cropped screenshot of Live panel
    console.log(`[AGENT-COLLECTED] Capturing Live cropped screenshot of ${dd.name} panel...`);
    const liveSnap = await liveCdp.send('Page.captureScreenshot', {
      format: 'png',
      clip: { x: panelBox.x, y: panelBox.y, width: panelBox.width, height: panelBox.height, scale: 1 }
    });

    // Close live dropdown
    await liveCdp.send('Input.dispatchMouseEvent', { type: 'mouseMoved', x: 0, y: 0 });
    await new Promise(r => setTimeout(r, 300));
    liveCdp.ws.close();

    const liveBuf = Buffer.from(liveSnap.data, 'base64');
    const liveSha = crypto.createHash('sha256').update(liveBuf).digest('hex');
    const liveArtifact = {
      sha256: liveSha,
      bytes: liveBuf.length,
      media_type: 'image/png',
      data_base64: liveSnap.data
    };
    const liveArtifactPath = `work/target_artifacts/replit/live-panel-${dd.name.toLowerCase()}-artifact.json`;
    fs.writeFileSync(liveArtifactPath, JSON.stringify(liveArtifact, null, 2), 'utf8');
    fs.writeFileSync(`work/analysis/compare/dropdown-${dd.name.toLowerCase()}-live-panel.png`, liveBuf);

    // 2. OPEN RECON VIA REAL MOUSE EVENT & CAPTURE RECON PANEL
    const reconCdp = await createCdpSender(RECON_ID);
    await reconCdp.send('Page.bringToFront');

    const reconBtnCoords = await reconCdp.send('Runtime.evaluate', {
      expression: `(() => {
        const btns = Array.from(document.querySelectorAll("header button")).filter(b => (b.innerText || '').includes("${dd.name}"));
        const r = btns[0].getBoundingClientRect();
        return { x: r.x + r.width / 2, y: r.y + r.height / 2 };
      })()`,
      returnByValue: true
    });
    const reconBtn = reconBtnCoords.result.value;

    console.log(`[AGENT-COLLECTED] Moving mouse to Recon ${dd.name} button: (${reconBtn.x}, ${reconBtn.y})`);
    await reconCdp.send('Input.dispatchMouseEvent', { type: 'mouseMoved', x: 0, y: 0 });
    await new Promise(r => setTimeout(r, 100));
    await reconCdp.send('Input.dispatchMouseEvent', { type: 'mouseMoved', x: reconBtn.x, y: reconBtn.y });
    await new Promise(r => setTimeout(r, 450));

    // Get recon panel bounding box (should match panelBox)
    const reconBoxRes = await reconCdp.send('Runtime.evaluate', {
      expression: `(() => {
        const p = document.getElementById("${dd.panelId}");
        const r = p.getBoundingClientRect();
        return {
          x: Math.round(r.x),
          y: Math.round(r.y),
          width: Math.round(r.width),
          height: Math.round(r.height)
        };
      })()`,
      returnByValue: true
    });
    const reconBox = reconBoxRes.result.value;
    console.log(`[AGENT-COLLECTED] Recon ${dd.name} panel bounding box:`, reconBox);

    // Capture cropped screenshot of Recon panel at the exact panelBox rectangle
    console.log(`[AGENT-COLLECTED] Capturing Recon cropped screenshot of ${dd.name} panel...`);
    const reconSnap = await reconCdp.send('Page.captureScreenshot', {
      format: 'png',
      clip: { x: reconBox.x, y: reconBox.y, width: reconBox.width, height: reconBox.height, scale: 1 }
    });

    // Close recon dropdown
    await reconCdp.send('Input.dispatchMouseEvent', { type: 'mouseMoved', x: 0, y: 0 });
    await new Promise(r => setTimeout(r, 300));
    reconCdp.ws.close();

    const reconBuf = Buffer.from(reconSnap.data, 'base64');
    const reconSha = crypto.createHash('sha256').update(reconBuf).digest('hex');
    const reconArtifact = {
      sha256: reconSha,
      bytes: reconBuf.length,
      media_type: 'image/png',
      data_base64: reconSnap.data
    };
    const reconArtifactPath = `work/target_artifacts/replit/recon-panel-${dd.name.toLowerCase()}-artifact.json`;
    fs.writeFileSync(reconArtifactPath, JSON.stringify(reconArtifact, null, 2), 'utf8');
    fs.writeFileSync(`work/analysis/compare/dropdown-${dd.name.toLowerCase()}-recon-panel.png`, reconBuf);

    // 3. COMPARE USING rea compare-web-screenshots
    console.log(`3. Running rea compare-web-screenshots on ${dd.name} panel rectangle...`);
    const diffCmd = `rea compare-web-screenshots ${liveArtifactPath} ${reconArtifactPath} --channel-threshold 1 --format json`;
    const diffOut = execSync(diffCmd, { encoding: 'utf8', maxBuffer: 50 * 1024 * 1024 });
    const diffPath = `work/analysis/compare/dropdown-${dd.name.toLowerCase()}-panel-diff.json`;
    fs.writeFileSync(diffPath, diffOut, 'utf8');
    const diffData = JSON.parse(diffOut);

    console.log(`\n=== PANEL RECTANGLE DIFF: ${dd.name} ===`);
    console.log(`  Panel Dimensions: ${panelBox.width} x ${panelBox.height}`);
    console.log(`  Compared Pixels: ${diffData.normalized_result?.compared_pixels}`);
    console.log(`  Changed Pixels: ${diffData.normalized_result?.changed_pixels}`);
    console.log(`  Changed Ratio: ${diffData.normalized_result?.changed_ratio}`);
    console.log(`  Mean Absolute Channel Delta: ${diffData.normalized_result?.mean_absolute_channel_delta}`);

    summary.push({
      dropdown: dd.name,
      panelBox,
      diff: diffData.normalized_result
    });
  }

  fs.writeFileSync('work/analysis/compare/panel-rectangles-summary.json', JSON.stringify(summary, null, 2), 'utf8');
  console.log('\nAll 3 panel rectangle diffs completed successfully!');
}

run().catch(console.error);

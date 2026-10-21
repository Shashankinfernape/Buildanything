import WebSocket from 'ws';
import { execSync } from 'child_process';
import crypto from 'crypto';
import fs from 'fs';

function createCdpSender(targetId) {
  return new Promise(async (resolve, reject) => {
    try {
      const ws = new WebSocket(`ws://127.0.0.1:9222/devtools/page/${targetId}`);
      await new Promise(r => ws.onopen = r);
      let cid = 1;
      const send = (method, params = {}) => new Promise((res, rej) => {
        const curId = cid++;
        const timer = setTimeout(() => rej(new Error(`CDP timeout: ${method}`)), 15000);
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

async function captureTabClip(targetId, clip, outPng, outArtifact) {
  const cdp = await createCdpSender(targetId);
  await cdp.send('Page.bringToFront');
  await cdp.send('Emulation.setDeviceMetricsOverride', { width: 1440, height: 900, deviceScaleFactor: 1, mobile: false });
  await new Promise(r => setTimeout(r, 400));

  const params = { format: 'png' };
  if (clip) params.clip = clip;

  const snap = await cdp.send('Page.captureScreenshot', params);
  cdp.ws.close();

  const buf = Buffer.from(snap.data, 'base64');
  const sha = crypto.createHash('sha256').update(buf).digest('hex');
  const artifact = {
    sha256: sha,
    bytes: buf.length,
    media_type: 'image/png',
    data_base64: snap.data
  };

  fs.writeFileSync(outPng, buf);
  fs.writeFileSync(outArtifact, JSON.stringify(artifact, null, 2), 'utf8');
  return artifact;
}

function runCompare(beforeArt, afterArt, threshold) {
  const cmd = `npx rea compare-web-screenshots ${beforeArt} ${afterArt} --channel-threshold ${threshold} --format json`;
  const out = execSync(cmd, { encoding: 'utf8', maxBuffer: 50 * 1024 * 1024 });
  return JSON.parse(out);
}

async function run() {
  const targets = await fetch('http://127.0.0.1:9222/json').then(r => r.json());
  const liveTarget = targets.find(t => t.url.includes('replit.com/~') || t.title.includes('Home - Replit'));
  const reconTarget = targets.find(t => t.url.includes('5174'));

  if (!liveTarget || !reconTarget) throw new Error('Missing target');

  // Setup recon tab state
  const reconInit = await createCdpSender(reconTarget.id);
  await reconInit.send('Runtime.evaluate', {
    expression: `
      window.__hideDevSwitcher = true;
      if (window.__setReconAppMode) window.__setReconAppMode('signed_in');
      if (window.__setReconScreen) window.__setReconScreen('home');
      const dev = document.getElementById('dev-mode-switcher');
      if (dev) dev.style.display = 'none';
      window.scrollTo(0, 0);
    `
  });
  reconInit.ws.close();
  await new Promise(r => setTimeout(r, 500));

  console.log('[AGENT-COLLECTED] 1. Capturing Sidebar Region (0, 0, 240, 760)...');
  const sidebarClip = { x: 0, y: 0, width: 240, height: 760, scale: 1 };
  await captureTabClip(liveTarget.id, sidebarClip, 'work/analysis/signed_in/live_sidebar.png', 'work/analysis/signed_in/live_sidebar_art.json');
  await captureTabClip(reconTarget.id, sidebarClip, 'work/analysis/signed_in/recon_sidebar.png', 'work/analysis/signed_in/recon_sidebar_art.json');

  console.log('[AGENT-COLLECTED] 2. Capturing Recent Projects Region (460, 20, 750, 140)...');
  const recentClip = { x: 460, y: 20, width: 750, height: 140, scale: 1 };
  await captureTabClip(liveTarget.id, recentClip, 'work/analysis/signed_in/live_recent.png', 'work/analysis/signed_in/live_recent_art.json');
  await captureTabClip(reconTarget.id, recentClip, 'work/analysis/signed_in/recon_recent.png', 'work/analysis/signed_in/recon_recent_art.json');

  console.log('[AGENT-COLLECTED] 3. Capturing Agent Input Card Region (460, 620, 750, 140)...');
  const promptClip = { x: 460, y: 620, width: 750, height: 140, scale: 1 };
  await captureTabClip(liveTarget.id, promptClip, 'work/analysis/signed_in/live_prompt.png', 'work/analysis/signed_in/live_prompt_art.json');
  await captureTabClip(reconTarget.id, promptClip, 'work/analysis/signed_in/recon_prompt.png', 'work/analysis/signed_in/recon_prompt_art.json');

  console.log('\n--- Comparing Regions with rea compare-web-screenshots ---');

  const diffSidebarT1 = runCompare('work/analysis/signed_in/live_sidebar_art.json', 'work/analysis/signed_in/recon_sidebar_art.json', 1);
  const diffSidebarT10 = runCompare('work/analysis/signed_in/live_sidebar_art.json', 'work/analysis/signed_in/recon_sidebar_art.json', 10);

  const diffRecentT1 = runCompare('work/analysis/signed_in/live_recent_art.json', 'work/analysis/signed_in/recon_recent_art.json', 1);
  const diffRecentT10 = runCompare('work/analysis/signed_in/live_recent_art.json', 'work/analysis/signed_in/recon_recent_art.json', 10);

  const diffPromptT1 = runCompare('work/analysis/signed_in/live_prompt_art.json', 'work/analysis/signed_in/recon_prompt_art.json', 1);
  const diffPromptT10 = runCompare('work/analysis/signed_in/live_prompt_art.json', 'work/analysis/signed_in/recon_prompt_art.json', 10);

  const results = {
    sidebar: {
      rect: sidebarClip,
      threshold_1: {
        changed_ratio: diffSidebarT1.normalized_result?.changed_ratio,
        mean_delta: diffSidebarT1.normalized_result?.mean_absolute_channel_delta,
        changed_pixels: diffSidebarT1.normalized_result?.changed_pixels,
        total_pixels: diffSidebarT1.normalized_result?.compared_pixels
      },
      threshold_10: {
        changed_ratio: diffSidebarT10.normalized_result?.changed_ratio
      }
    },
    recent_projects_grid: {
      rect: recentClip,
      threshold_1: {
        changed_ratio: diffRecentT1.normalized_result?.changed_ratio,
        mean_delta: diffRecentT1.normalized_result?.mean_absolute_channel_delta,
        changed_pixels: diffRecentT1.normalized_result?.changed_pixels,
        total_pixels: diffRecentT1.normalized_result?.compared_pixels
      },
      threshold_10: {
        changed_ratio: diffRecentT10.normalized_result?.changed_ratio
      }
    },
    agent_prompt_card: {
      rect: promptClip,
      threshold_1: {
        changed_ratio: diffPromptT1.normalized_result?.changed_ratio,
        mean_delta: diffPromptT1.normalized_result?.mean_absolute_channel_delta,
        changed_pixels: diffPromptT1.normalized_result?.changed_pixels,
        total_pixels: diffPromptT1.normalized_result?.compared_pixels
      },
      threshold_10: {
        changed_ratio: diffPromptT10.normalized_result?.changed_ratio
      }
    }
  };

  console.log('Results:\n', JSON.stringify(results, null, 2));
  fs.writeFileSync('work/analysis/signed_in/regional_diff_results.json', JSON.stringify(results, null, 2), 'utf8');
}

run().catch(console.error);

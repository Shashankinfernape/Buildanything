import WebSocket from 'ws';
import { execSync } from 'child_process';
import crypto from 'crypto';
import fs from 'fs';

async function getTargets() {
  const res = await fetch('http://127.0.0.1:9222/json');
  return res.json();
}

function createCdpClient(targetId) {
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

function runCompare(beforeArtifactPath, afterArtifactPath, channelThreshold) {
  const cmd = `npx rea compare-web-screenshots ${beforeArtifactPath} ${afterArtifactPath} --channel-threshold ${channelThreshold} --format json`;
  const out = execSync(cmd, { encoding: 'utf8', maxBuffer: 50 * 1024 * 1024 });
  return JSON.parse(out);
}

async function run() {
  const targets = await getTargets();
  const reconTarget = targets.find(t => t.url.includes('5174'));
  const liveTarget = targets.find(t => t.url.includes('replit.com/~') || t.title.includes('Home - Replit'));

  if (!reconTarget) throw new Error('Could not find recon target');
  if (!liveTarget) throw new Error('Could not find live target');

  console.log('Live Target ID:', liveTarget.id);
  console.log('Recon Target ID:', reconTarget.id);

  const recon = await createCdpClient(reconTarget.id);
  const live = await createCdpClient(liveTarget.id);

  // Set identical viewport on both
  await live.send('Emulation.setDeviceMetricsOverride', { width: 1440, height: 900, deviceScaleFactor: 1, mobile: false });
  await recon.send('Emulation.setDeviceMetricsOverride', { width: 1440, height: 900, deviceScaleFactor: 1, mobile: false });

  // Ensure recon is in signed_in mode, screen 'home', hide dev switcher
  await recon.send('Runtime.evaluate', {
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

  // 1. Full Dashboard Capture
  console.log('[AGENT-COLLECTED] Capturing live & recon dashboard full viewport...');
  const liveFullSnap = await live.send('Page.captureScreenshot', { format: 'png' });
  const reconFullSnap = await recon.send('Page.captureScreenshot', { format: 'png' });

  const liveFullBuf = Buffer.from(liveFullSnap.data, 'base64');
  const reconFullBuf = Buffer.from(reconFullSnap.data, 'base64');

  fs.writeFileSync('work/analysis/signed_in/live_dashboard_full.png', liveFullBuf);
  fs.writeFileSync('work/analysis/signed_in/recon_dashboard_full.png', reconFullBuf);

  const liveFullArt = {
    sha256: crypto.createHash('sha256').update(liveFullBuf).digest('hex'),
    bytes: liveFullBuf.length,
    media_type: 'image/png',
    data_base64: liveFullSnap.data
  };
  const reconFullArt = {
    sha256: crypto.createHash('sha256').update(reconFullBuf).digest('hex'),
    bytes: reconFullBuf.length,
    media_type: 'image/png',
    data_base64: reconFullSnap.data
  };

  fs.writeFileSync('work/analysis/signed_in/live_dashboard_full_art.json', JSON.stringify(liveFullArt, null, 2));
  fs.writeFileSync('work/analysis/signed_in/recon_dashboard_full_art.json', JSON.stringify(reconFullArt, null, 2));

  // 2. Region 1: Sidebar (x: 0, y: 0, w: 240, h: 900)
  console.log('[AGENT-COLLECTED] Capturing Sidebar region (0, 0, 240, 900)...');
  const sidebarClip = { x: 0, y: 0, width: 240, height: 900, scale: 1 };
  const liveSidebarSnap = await live.send('Page.captureScreenshot', { format: 'png', clip: sidebarClip });
  const reconSidebarSnap = await recon.send('Page.captureScreenshot', { format: 'png', clip: sidebarClip });

  const liveSidebarBuf = Buffer.from(liveSidebarSnap.data, 'base64');
  const reconSidebarBuf = Buffer.from(reconSidebarSnap.data, 'base64');
  fs.writeFileSync('work/analysis/signed_in/live_sidebar.png', liveSidebarBuf);
  fs.writeFileSync('work/analysis/signed_in/recon_sidebar.png', reconSidebarBuf);

  const liveSidebarArt = {
    sha256: crypto.createHash('sha256').update(liveSidebarBuf).digest('hex'),
    bytes: liveSidebarBuf.length,
    media_type: 'image/png',
    data_base64: liveSidebarSnap.data
  };
  const reconSidebarArt = {
    sha256: crypto.createHash('sha256').update(reconSidebarBuf).digest('hex'),
    bytes: reconSidebarBuf.length,
    media_type: 'image/png',
    data_base64: reconSidebarSnap.data
  };
  fs.writeFileSync('work/analysis/signed_in/live_sidebar_art.json', JSON.stringify(liveSidebarArt, null, 2));
  fs.writeFileSync('work/analysis/signed_in/recon_sidebar_art.json', JSON.stringify(reconSidebarArt, null, 2));

  // 3. Region 2: Recent Projects Grid (x: 460, y: 20, w: 760, h: 140)
  console.log('[AGENT-COLLECTED] Capturing Recent Projects region (460, 20, 760, 140)...');
  const recentClip = { x: 460, y: 20, width: 760, height: 140, scale: 1 };
  const liveRecentSnap = await live.send('Page.captureScreenshot', { format: 'png', clip: recentClip });
  const reconRecentSnap = await recon.send('Page.captureScreenshot', { format: 'png', clip: recentClip });

  const liveRecentBuf = Buffer.from(liveRecentSnap.data, 'base64');
  const reconRecentBuf = Buffer.from(reconRecentSnap.data, 'base64');
  fs.writeFileSync('work/analysis/signed_in/live_recent_grid.png', liveRecentBuf);
  fs.writeFileSync('work/analysis/signed_in/recon_recent_grid.png', reconRecentBuf);

  const liveRecentArt = {
    sha256: crypto.createHash('sha256').update(liveRecentBuf).digest('hex'),
    bytes: liveRecentBuf.length,
    media_type: 'image/png',
    data_base64: liveRecentSnap.data
  };
  const reconRecentArt = {
    sha256: crypto.createHash('sha256').update(reconRecentBuf).digest('hex'),
    bytes: reconRecentBuf.length,
    media_type: 'image/png',
    data_base64: reconRecentSnap.data
  };
  fs.writeFileSync('work/analysis/signed_in/live_recent_art.json', JSON.stringify(liveRecentArt, null, 2));
  fs.writeFileSync('work/analysis/signed_in/recon_recent_art.json', JSON.stringify(reconRecentArt, null, 2));

  // 4. Region 3: Agent Prompt Box (x: 460, y: 620, w: 760, h: 150)
  console.log('[AGENT-COLLECTED] Capturing Agent Prompt Box region (460, 620, 760, 150)...');
  const promptClip = { x: 460, y: 620, width: 760, height: 150, scale: 1 };
  const livePromptSnap = await live.send('Page.captureScreenshot', { format: 'png', clip: promptClip });
  const reconPromptSnap = await recon.send('Page.captureScreenshot', { format: 'png', clip: promptClip });

  const livePromptBuf = Buffer.from(livePromptSnap.data, 'base64');
  const reconPromptBuf = Buffer.from(reconPromptSnap.data, 'base64');
  fs.writeFileSync('work/analysis/signed_in/live_prompt_card.png', livePromptBuf);
  fs.writeFileSync('work/analysis/signed_in/recon_prompt_card.png', reconPromptBuf);

  const livePromptArt = {
    sha256: crypto.createHash('sha256').update(livePromptBuf).digest('hex'),
    bytes: livePromptBuf.length,
    media_type: 'image/png',
    data_base64: livePromptSnap.data
  };
  const reconPromptArt = {
    sha256: crypto.createHash('sha256').update(reconPromptBuf).digest('hex'),
    bytes: reconPromptBuf.length,
    media_type: 'image/png',
    data_base64: reconPromptSnap.data
  };
  fs.writeFileSync('work/analysis/signed_in/live_prompt_art.json', JSON.stringify(livePromptArt, null, 2));
  fs.writeFileSync('work/analysis/signed_in/recon_prompt_art.json', JSON.stringify(reconPromptArt, null, 2));

  live.ws.close();
  recon.ws.close();

  // Run Comparisons
  console.log('\n--- Running rea compare-web-screenshots on Dashboard Regions ---');
  
  // Sidebar compare
  const diffSidebarT1 = runCompare('work/analysis/signed_in/live_sidebar_art.json', 'work/analysis/signed_in/recon_sidebar_art.json', 1);
  const diffSidebarT10 = runCompare('work/analysis/signed_in/live_sidebar_art.json', 'work/analysis/signed_in/recon_sidebar_art.json', 10);
  console.log('Sidebar (threshold 1):', {
    compared_pixels: diffSidebarT1.normalized_result?.compared_pixels,
    changed_pixels: diffSidebarT1.normalized_result?.changed_pixels,
    changed_ratio: diffSidebarT1.normalized_result?.changed_ratio,
    mean_channel_delta: diffSidebarT1.normalized_result?.mean_absolute_channel_delta
  });
  console.log('Sidebar (threshold 10):', {
    changed_ratio: diffSidebarT10.normalized_result?.changed_ratio
  });

  // Recent Grid compare
  const diffRecentT1 = runCompare('work/analysis/signed_in/live_recent_art.json', 'work/analysis/signed_in/recon_recent_art.json', 1);
  const diffRecentT10 = runCompare('work/analysis/signed_in/live_recent_art.json', 'work/analysis/signed_in/recon_recent_art.json', 10);
  console.log('Recent Grid (threshold 1):', {
    compared_pixels: diffRecentT1.normalized_result?.compared_pixels,
    changed_pixels: diffRecentT1.normalized_result?.changed_pixels,
    changed_ratio: diffRecentT1.normalized_result?.changed_ratio,
    mean_channel_delta: diffRecentT1.normalized_result?.mean_absolute_channel_delta
  });
  console.log('Recent Grid (threshold 10):', {
    changed_ratio: diffRecentT10.normalized_result?.changed_ratio
  });

  // Prompt Card compare
  const diffPromptT1 = runCompare('work/analysis/signed_in/live_prompt_art.json', 'work/analysis/signed_in/recon_prompt_art.json', 1);
  const diffPromptT10 = runCompare('work/analysis/signed_in/live_prompt_art.json', 'work/analysis/signed_in/recon_prompt_art.json', 10);
  console.log('Prompt Card (threshold 1):', {
    compared_pixels: diffPromptT1.normalized_result?.compared_pixels,
    changed_pixels: diffPromptT1.normalized_result?.changed_pixels,
    changed_ratio: diffPromptT1.normalized_result?.changed_ratio,
    mean_channel_delta: diffPromptT1.normalized_result?.mean_absolute_channel_delta
  });
  console.log('Prompt Card (threshold 10):', {
    changed_ratio: diffPromptT10.normalized_result?.changed_ratio
  });

  // Save report
  fs.writeFileSync('work/analysis/signed_in/dashboard_regional_diffs.json', JSON.stringify({
    sidebar: { t1: diffSidebarT1.normalized_result, t10: diffSidebarT10.normalized_result },
    recent: { t1: diffRecentT1.normalized_result, t10: diffRecentT10.normalized_result },
    prompt: { t1: diffPromptT1.normalized_result, t10: diffPromptT10.normalized_result },
  }, null, 2));

  console.log('\nSaved work/analysis/signed_in/dashboard_regional_diffs.json successfully.');
}

run().catch(console.error);

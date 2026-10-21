import WebSocket from 'ws';
import { execSync } from 'child_process';
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
  { name: 'Products', index: 0, panelId: 'marketing-header-panel-d7e540c5b986' },
  { name: 'Solutions', index: 1, panelId: 'marketing-header-panel-00b55aa0ebe3' },
  { name: 'Resources', index: 2, panelId: 'marketing-header-panel-20e7c4f7ecfe' }
];

async function run() {
  const summary = [];

  for (const dd of dropdowns) {
    console.log(`\n==================================================`);
    console.log(`Processing Dropdown: ${dd.name}`);
    console.log(`==================================================`);

    // 1. OPEN IN LIVE TAB
    console.log(`[AGENT-COLLECTED] 1. Opening ${dd.name} in Live target...`);
    const liveCdp = await createCdpSender(LIVE_ID);
    await liveCdp.send('Page.bringToFront');
    
    const liveDomInfo = await liveCdp.send('Runtime.evaluate', {
      expression: `(async () => {
        const groups = Array.from(document.querySelectorAll("header div[role='group']"));
        const grp = groups[${dd.index}];
        const propsKey = Object.keys(grp).find(k => k.startsWith('__reactProps'));
        grp[propsKey].onMouseEnter();
        await new Promise(r => setTimeout(r, 400));

        const panel = document.getElementById("${dd.panelId}");
        const content = panel ? panel.parentElement : null;
        const btn = grp.querySelector("button");

        return {
          name: "${dd.name}",
          groupDataState: grp.getAttribute('data-state'),
          btnAriaExpanded: btn ? btn.getAttribute('aria-expanded') : null,
          contentDataState: content ? content.getAttribute('data-state') : null,
          contentClasses: content ? content.className : null,
          contentVisible: content ? window.getComputedStyle(content).visibility : null,
          contentOpacity: content ? window.getComputedStyle(content).opacity : null,
          panelAriaHidden: panel ? panel.getAttribute('aria-hidden') : null,
          panelOuterHtml: panel ? panel.outerHTML : null
        };
      })()`,
      awaitPromise: true,
      returnByValue: true
    });

    const liveData = liveDomInfo.result.value;
    fs.writeFileSync(
      `work/analysis/dropdown-${dd.name.toLowerCase()}-live-dom.html`,
      liveData.panelOuterHtml || '',
      'utf8'
    );
    console.log(`Live ${dd.name} open state confirmed: aria-expanded=${liveData.btnAriaExpanded}, panel aria-hidden=${liveData.panelAriaHidden}`);
    liveCdp.ws.close();

    // 2. CAPTURE LIVE SCREENSHOT VIA REA
    console.log(`2. Capturing Live ${dd.name} screenshot via REA...`);
    const liveOut = execSync(`rea capture-web-screenshot http://127.0.0.1:9222 ${LIVE_ID} --format json`, {
      encoding: 'utf8',
      maxBuffer: 50 * 1024 * 1024
    });
    const liveArtifact = JSON.parse(liveOut).normalized_result?.artifact;
    const liveArtifactPath = `work/target_artifacts/replit/live-dropdown-${dd.name.toLowerCase()}-artifact.json`;
    fs.writeFileSync(liveArtifactPath, JSON.stringify(liveArtifact, null, 2), 'utf8');

    // 3. OPEN IN RECONSTRUCTION TAB
    console.log(`[AGENT-COLLECTED] 3. Opening ${dd.name} in Reconstruction target...`);
    const reconCdp = await createCdpSender(RECON_ID);
    await reconCdp.send('Page.bringToFront');

    const reconDomInfo = await reconCdp.send('Runtime.evaluate', {
      expression: `(async () => {
        if (typeof window.__setNavDropdown === 'function') {
          window.__setNavDropdown("${dd.name}");
        }
        await new Promise(r => setTimeout(r, 400));

        const panel = document.getElementById("${dd.panelId}");
        const content = panel ? panel.parentElement : null;
        const btn = document.querySelector("button[aria-controls='${dd.panelId}']");

        return {
          name: "${dd.name}",
          btnAriaExpanded: btn ? btn.getAttribute('aria-expanded') : null,
          contentClasses: content ? content.className : null,
          contentVisible: content ? window.getComputedStyle(content).visibility : null,
          panelAriaHidden: panel ? panel.getAttribute('aria-hidden') : null,
          panelOuterHtml: panel ? panel.outerHTML : null
        };
      })()`,
      awaitPromise: true,
      returnByValue: true
    });
    const reconData = reconDomInfo.result.value;
    fs.writeFileSync(
      `work/analysis/dropdown-${dd.name.toLowerCase()}-recon-dom.html`,
      reconData.panelOuterHtml || '',
      'utf8'
    );
    console.log(`Recon ${dd.name} open state confirmed: aria-expanded=${reconData.btnAriaExpanded}, panel aria-hidden=${reconData.panelAriaHidden}`);
    reconCdp.ws.close();

    // 4. CAPTURE RECON SCREENSHOT VIA REA
    console.log(`4. Capturing Recon ${dd.name} screenshot via REA...`);
    const reconOut = execSync(`rea capture-web-screenshot http://127.0.0.1:9222 ${RECON_ID} --format json`, {
      encoding: 'utf8',
      maxBuffer: 50 * 1024 * 1024
    });
    const reconArtifact = JSON.parse(reconOut).normalized_result?.artifact;
    const reconArtifactPath = `work/target_artifacts/replit/recon-dropdown-${dd.name.toLowerCase()}-artifact.json`;
    fs.writeFileSync(reconArtifactPath, JSON.stringify(reconArtifact, null, 2), 'utf8');

    // 5. COMPARE SCREENSHOTS VIA REA
    console.log(`5. Running rea compare-web-screenshots with channel-threshold 1...`);
    const diffCmd = `rea compare-web-screenshots ${liveArtifactPath} ${reconArtifactPath} --channel-threshold 1 --format json`;
    const diffOut = execSync(diffCmd, { encoding: 'utf8', maxBuffer: 50 * 1024 * 1024 });
    const diffPath = `work/analysis/compare/dropdown-${dd.name.toLowerCase()}-diff.json`;
    fs.writeFileSync(diffPath, diffOut, 'utf8');
    const diffData = JSON.parse(diffOut);
    console.log(`Comparison result saved to ${diffPath}:`);
    console.log(`  Compared pixels: ${diffData.normalized_result?.compared_pixels}`);
    console.log(`  Changed pixels: ${diffData.normalized_result?.changed_pixels}`);
    console.log(`  Changed ratio: ${diffData.normalized_result?.changed_ratio}`);
    console.log(`  Mean channel delta: ${diffData.normalized_result?.mean_absolute_channel_delta}`);

    // 6. CLOSE BOTH DROPDOWNS
    console.log(`[AGENT-COLLECTED] 6. Closing ${dd.name} in Live and Recon tabs...`);
    const liveClose = await createCdpSender(LIVE_ID);
    await liveClose.send('Runtime.evaluate', {
      expression: `(async () => {
        const groups = Array.from(document.querySelectorAll("header div[role='group']"));
        const grp = groups[${dd.index}];
        const propsKey = Object.keys(grp).find(k => k.startsWith('__reactProps'));
        grp[propsKey].onMouseLeave();
        await new Promise(r => setTimeout(r, 300));
      })()`,
      awaitPromise: true
    });
    liveClose.ws.close();

    const reconClose = await createCdpSender(RECON_ID);
    await reconClose.send('Runtime.evaluate', {
      expression: `(async () => {
        if (typeof window.__setNavDropdown === 'function') {
          window.__setNavDropdown(null);
        }
        await new Promise(r => setTimeout(r, 300));
      })()`,
      awaitPromise: true
    });
    reconClose.ws.close();

    summary.push({
      dropdown: dd.name,
      liveDom: liveData,
      reconDom: reconData,
      diff: diffData.normalized_result
    });
  }

  fs.writeFileSync('work/analysis/compare/dropdowns-summary.json', JSON.stringify(summary, null, 2), 'utf8');
  console.log(`\nAll 3 dropdowns successfully tested, captured, compared, and closed!`);
}

run().catch(console.error);

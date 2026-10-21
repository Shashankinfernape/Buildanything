import WebSocket from 'ws';
import { execSync } from 'child_process';
import crypto from 'crypto';
import fs from 'fs';

const LIVE_ID = '1F77289A2297F8B8A35F03904F821099';
const RECON_ID = 'D443E8091E8733163C20C86AEEDB5714';

function createCdpSender(targetId) {
  return new Promise(async (resolve, reject) => {
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
  });
}

function runReaDiff(liveBuf, reconBuf, diffName) {
  const liveSha = crypto.createHash('sha256').update(liveBuf).digest('hex');
  const reconSha = crypto.createHash('sha256').update(reconBuf).digest('hex');

  const liveArtifact = {
    sha256: liveSha,
    bytes: liveBuf.length,
    media_type: 'image/png',
    data_base64: liveBuf.toString('base64')
  };
  const reconArtifact = {
    sha256: reconSha,
    bytes: reconBuf.length,
    media_type: 'image/png',
    data_base64: reconBuf.toString('base64')
  };

  const livePath = `work/target_artifacts/replit/live-${diffName}-artifact.json`;
  const reconPath = `work/target_artifacts/replit/recon-${diffName}-artifact.json`;

  fs.writeFileSync(livePath, JSON.stringify(liveArtifact, null, 2));
  fs.writeFileSync(reconPath, JSON.stringify(reconArtifact, null, 2));

  const diffCmd = `npx rea compare-web-screenshots ${livePath} ${reconPath} --channel-threshold 1 --format json`;
  const diffOut = execSync(diffCmd, { encoding: 'utf8', maxBuffer: 50 * 1024 * 1024 });
  const outPath = `work/analysis/compare/${diffName}-diff.json`;
  fs.writeFileSync(outPath, diffOut, 'utf8');

  const diffData = JSON.parse(diffOut);
  return diffData.normalized_result;
}

async function preparePage(sender, width, height, mobile) {
  await sender.send('Emulation.setDeviceMetricsOverride', {
    width,
    height,
    deviceScaleFactor: 1,
    mobile
  });
  await sender.send('Runtime.evaluate', { expression: 'window.scrollTo(0, 0)' });
  await new Promise(r => setTimeout(r, 600));

  const freezeExpr = `(() => {
    const fixed = "Build a website for…";
    const ta = document.querySelector('textarea[data-ruic="MultiLineInput"]');
    if (ta) {
      ta.value = "";
      ta.setAttribute('data-frozen', 'true');
      Object.defineProperty(ta, 'placeholder', {
        value: fixed,
        writable: false,
        configurable: true
      });
      ta.setAttribute('placeholder', fixed);
    }
  })()`;
  await sender.send('Runtime.evaluate', { expression: freezeExpr });
}

async function captureElement(sender, selector, clipW, clipH) {
  const getBoxExpr = `(() => {
    const el = document.querySelector('${selector}');
    if (!el) return null;
    const b = el.getBoundingClientRect();
    const y = Math.round(b.y + window.scrollY);
    return {
      x: 0,
      y,
      width: ${clipW},
      height: ${clipH},
      scale: 1,
      scrollY: y
    };
  })()`;

  const box = (await sender.send('Runtime.evaluate', { expression: getBoxExpr, returnByValue: true })).result.value;
  if (!box) throw new Error(`Element ${selector} not found`);

  await sender.send('Runtime.evaluate', { expression: `window.scrollTo(0, ${box.scrollY})` });
  await new Promise(r => setTimeout(r, 400));

  const snap = await sender.send('Page.captureScreenshot', {
    format: 'png',
    captureBeyondViewport: true,
    clip: {
      x: box.x,
      y: box.y,
      width: box.width,
      height: box.height,
      scale: 1
    }
  });

  return Buffer.from(snap.data, 'base64');
}

async function main() {
  const live = await createCdpSender(LIVE_ID);
  const recon = await createCdpSender(RECON_ID);

  const results = {};

  // ==========================================
  // VIEWPORT: 1034px WIDE
  // ==========================================
  console.log('\n========================================');
  console.log('Capturing & Diffing at 1034px Wide...');
  console.log('========================================');

  await preparePage(live, 1034, 900, false);
  await preparePage(recon, 1034, 900, false);

  // 1. Header (1034px, h: 80)
  const headerBufLive1034 = await captureElement(live, 'header', 1019, 80);
  const headerBufRecon1034 = await captureElement(recon, 'header', 1019, 80);
  fs.writeFileSync('work/analysis/compare/header-1034-live.png', headerBufLive1034);
  fs.writeFileSync('work/analysis/compare/header-1034-recon.png', headerBufRecon1034);
  results['header_1034'] = runReaDiff(headerBufLive1034, headerBufRecon1034, 'header-1034');
  console.log('Header 1034px Changed Ratio:', results['header_1034']?.changed_ratio);

  // 2. Hero (1034px, h: 833)
  const heroBufLive1034 = await captureElement(live, 'h1', 1019, 833);
  const heroBufRecon1034 = await captureElement(recon, 'h1', 1019, 833);
  fs.writeFileSync('work/analysis/compare/hero-1034-live.png', heroBufLive1034);
  fs.writeFileSync('work/analysis/compare/hero-1034-recon.png', heroBufRecon1034);
  results['hero_1034'] = runReaDiff(heroBufLive1034, heroBufRecon1034, 'hero-1034');
  console.log('Hero 1034px Changed Ratio:', results['hero_1034']?.changed_ratio);

  // 3. Footer (1034px, h: 811)
  const footerBufLive1034 = await captureElement(live, 'footer', 1019, 811);
  const footerBufRecon1034 = await captureElement(recon, 'footer', 1019, 811);
  fs.writeFileSync('work/analysis/compare/footer-1034-live.png', footerBufLive1034);
  fs.writeFileSync('work/analysis/compare/footer-1034-recon.png', footerBufRecon1034);
  results['footer_1034'] = runReaDiff(footerBufLive1034, footerBufRecon1034, 'footer-1034');
  console.log('Footer 1034px Changed Ratio:', results['footer_1034']?.changed_ratio);

  // ==========================================
  // VIEWPORT: 390px WIDE (Mobile)
  // ==========================================
  console.log('\n========================================');
  console.log('Capturing & Diffing at 390px Wide (Mobile)...');
  console.log('========================================');

  await preparePage(live, 390, 844, true);
  await preparePage(recon, 390, 844, true);

  // 1. Header (390px, h: 64)
  const headerBufLive390 = await captureElement(live, 'header', 390, 64);
  const headerBufRecon390 = await captureElement(recon, 'header', 390, 64);
  fs.writeFileSync('work/analysis/compare/header-390-live.png', headerBufLive390);
  fs.writeFileSync('work/analysis/compare/header-390-recon.png', headerBufRecon390);
  results['header_390'] = runReaDiff(headerBufLive390, headerBufRecon390, 'header-390');
  console.log('Header 390px Changed Ratio:', results['header_390']?.changed_ratio);

  // 2. Hero (390px, h: 777)
  const heroBufLive390 = await captureElement(live, 'h1', 390, 777);
  const heroBufRecon390 = await captureElement(recon, 'h1', 390, 777);
  fs.writeFileSync('work/analysis/compare/hero-390-live.png', heroBufLive390);
  fs.writeFileSync('work/analysis/compare/hero-390-recon.png', heroBufRecon390);
  results['hero_390'] = runReaDiff(heroBufLive390, heroBufRecon390, 'hero-390');
  console.log('Hero 390px Changed Ratio:', results['hero_390']?.changed_ratio);

  // 3. Footer (390px, h: 1131)
  const footerBufLive390 = await captureElement(live, 'footer', 390, 1131);
  const footerBufRecon390 = await captureElement(recon, 'footer', 390, 1131);
  fs.writeFileSync('work/analysis/compare/footer-390-live.png', footerBufLive390);
  fs.writeFileSync('work/analysis/compare/footer-390-recon.png', footerBufRecon390);
  results['footer_390'] = runReaDiff(footerBufLive390, footerBufRecon390, 'footer-390');
  console.log('Footer 390px Changed Ratio:', results['footer_390']?.changed_ratio);

  // Restore 1440 desktop viewport
  await live.send('Emulation.setDeviceMetricsOverride', { width: 1440, height: 900, deviceScaleFactor: 1, mobile: false });
  await recon.send('Emulation.setDeviceMetricsOverride', { width: 1440, height: 900, deviceScaleFactor: 1, mobile: false });
  await live.send('Runtime.evaluate', { expression: 'window.scrollTo(0, 0)' });
  await recon.send('Runtime.evaluate', { expression: 'window.scrollTo(0, 0)' });

  live.ws.close();
  recon.ws.close();

  fs.writeFileSync('work/analysis/compare/responsive-diff-summary.json', JSON.stringify(results, null, 2), 'utf8');
  console.log('\n--- Responsive Diffs Completed Successfully ---');
}

main().catch(console.error);

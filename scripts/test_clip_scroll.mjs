import WebSocket from 'ws';
import fs from 'fs';

async function testClip() {
  async function capture(targetId, label) {
    const ws = new WebSocket(`ws://127.0.0.1:9222/devtools/page/${targetId}`);
    await new Promise(r => ws.onopen = r);
    let id = 1;
    const send = (method, params = {}) => new Promise((resolve) => {
      const curId = id++;
      const handler = (evt) => {
        const data = JSON.parse(evt.data);
        if (data.id === curId) {
          ws.removeEventListener('message', handler);
          resolve(data.result);
        }
      };
      ws.addEventListener('message', handler);
      ws.send(JSON.stringify({ id: curId, method, params }));
    });

    await send('Page.bringToFront');
    // Scroll to 838
    await send('Runtime.evaluate', {
      expression: 'window.scrollTo(0, 838)'
    });
    await new Promise(r => setTimeout(r, 600));

    // Capture the bento bounding box in document coordinates:
    // x: 0, y: 838, width: 1440, height: 1032
    const snap = await send('Page.captureScreenshot', {
      format: 'png',
      captureBeyondViewport: true,
      clip: { x: 0, y: 838, width: 1440, height: 1032, scale: 1 }
    });

    const buf = Buffer.from(snap.data, 'base64');
    console.log(`${label} captured! bytes:`, buf.length);
    fs.writeFileSync(`work/analysis/compare/test-${label.toLowerCase()}-clip.png`, buf);

    // Also capture the cards rectangle:
    // in document coordinates: x: 23, y: 1090, width: 1380, height: 656
    const snapCards = await send('Page.captureScreenshot', {
      format: 'png',
      captureBeyondViewport: true,
      clip: { x: 23, y: 1090, width: 1380, height: 656, scale: 1 }
    });

    const bufCards = Buffer.from(snapCards.data, 'base64');
    console.log(`${label} cards captured! bytes:`, bufCards.length);
    fs.writeFileSync(`work/analysis/compare/test-${label.toLowerCase()}-cards.png`, bufCards);

    ws.close();
  }

  await capture('0CEBF5F820FA8AA89465BD16147DDED9', 'LIVE');
  await capture('A7DF9577D21FF635BD6EF295E92FAEC1', 'RECON');
}

testClip().catch(console.error);

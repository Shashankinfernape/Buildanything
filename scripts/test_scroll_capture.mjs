import WebSocket from 'ws';
import fs from 'fs';

async function testScrollCapture() {
  const ws = new WebSocket('ws://127.0.0.1:9222/devtools/page/0CEBF5F820FA8AA89465BD16147DDED9');
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
  const scrollInfo = await send('Runtime.evaluate', {
    expression: `(() => {
      const bento = document.querySelector('[data-analytics-id="free_mode_bento_grid"]')?.closest('.relative');
      bento?.scrollIntoView({ behavior: 'instant', block: 'start' });
      return {
        scrollY: window.scrollY,
        rect: bento?.getBoundingClientRect(),
        cardsRect: document.querySelector('[data-analytics-id="free_mode_bento_grid"]')?.getBoundingClientRect()
      };
    })()`,
    returnByValue: true
  });
  console.log('Scroll info:', scrollInfo.result?.value);

  await new Promise(r => setTimeout(r, 1000));

  const snap = await send('Page.captureScreenshot', {
    format: 'png',
    captureBeyondViewport: true
  });

  const buf = Buffer.from(snap.data, 'base64');
  console.log('Full viewport screenshot bytes after scroll:', buf.length);
  fs.writeFileSync('work/analysis/compare/test-live-scrolled.png', buf);
  ws.close();
}

testScrollCapture().catch(console.error);

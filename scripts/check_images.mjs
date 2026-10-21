import WebSocket from 'ws';

async function check() {
  const ws = new WebSocket('ws://127.0.0.1:9222/devtools/page/A7DF9577D21FF635BD6EF295E92FAEC1');
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

  const res = await send('Runtime.evaluate', {
    expression: `(() => {
      const imgs = Array.from(document.querySelectorAll('img')).map(img => ({
        src: img.src,
        complete: img.complete,
        naturalWidth: img.naturalWidth,
        naturalHeight: img.naturalHeight
      }));
      return imgs;
    })()`,
    returnByValue: true
  });
  console.log('Recon images full res:', JSON.stringify(res, null, 2));
  ws.close();
}

check().catch(console.error);

import WebSocket from 'ws';
import fs from 'fs';

async function inspectSection8() {
  const ws = new WebSocket('ws://127.0.0.1:9222/devtools/page/0CEBF5F820FA8AA89465BD16147DDED9');
  await new Promise(r => ws.onopen = r);
  let id = 1;
  const send = (method, params = {}) => new Promise((resolve) => {
    const curId = id++;
    const handler = (evt) => {
      const data = JSON.parse(evt.data);
      if (data.id === curId) {
        ws.removeEventListener('message', handler);
        resolve(data);
      }
    };
    ws.addEventListener('message', handler);
    ws.send(JSON.stringify({ id: curId, method, params }));
  });

  const res = await send('Runtime.evaluate', {
    expression: `(() => {
      const next = document.getElementById('__next');
      const pageWrapper = next.children[7].children[0];
      const c8 = pageWrapper.children[8];
      const r = c8.getBoundingClientRect();
      return {
        classes: c8.className,
        rect: {
          x: Math.round(r.x),
          y: Math.round(r.y + window.scrollY),
          w: Math.round(r.width),
          h: Math.round(r.height)
        },
        outerHTML: c8.outerHTML
      };
    })()`,
    returnByValue: true
  });

  const val = res.result?.result?.value;
  console.log('c8 classes:', val?.classes);
  console.log('c8 rect:', val?.rect);
  if (val?.outerHTML) {
    fs.writeFileSync('work/analysis/section8-logoblock-live-dom.html', val.outerHTML, 'utf8');
    console.log('Saved section8-logoblock-live-dom.html, size:', val.outerHTML.length);
  }
  ws.close();
}

inspectSection8().catch(console.error);

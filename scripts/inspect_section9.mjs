import WebSocket from 'ws';
import fs from 'fs';

async function inspectSection9() {
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
      const c9 = pageWrapper.children[9];
      const c10 = pageWrapper.children[10];
      const r9 = c9 ? c9.getBoundingClientRect() : null;
      const r10 = c10 ? c10.getBoundingClientRect() : null;
      return {
        c9Classes: c9 ? c9.className : null,
        c9Rect: r9 ? {
          x: Math.round(r9.x),
          y: Math.round(r9.y + window.scrollY),
          w: Math.round(r9.width),
          h: Math.round(r9.height)
        } : null,
        c10Classes: c10 ? c10.className : null,
        c10Rect: r10 ? {
          x: Math.round(r10.x),
          y: Math.round(r10.y + window.scrollY),
          w: Math.round(r10.width),
          h: Math.round(r10.height)
        } : null,
        c9Outer: c9 ? c9.outerHTML : null,
        c10Outer: c10 ? c10.outerHTML : null
      };
    })()`,
    returnByValue: true
  });

  const val = res.result?.result?.value;
  console.log('c9 classes:', val?.c9Classes);
  console.log('c9 rect:', val?.c9Rect);
  console.log('c10 classes:', val?.c10Classes);
  console.log('c10 rect:', val?.c10Rect);

  const combined = (val?.c9Outer || '') + '\n' + (val?.c10Outer || '');
  fs.writeFileSync('work/analysis/section9-footer-live-dom.html', combined, 'utf8');
  console.log('Saved section9-footer-live-dom.html, size:', combined.length);
  ws.close();
}

inspectSection9().catch(console.error);

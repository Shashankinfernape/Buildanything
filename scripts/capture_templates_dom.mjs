import WebSocket from 'ws';
import fs from 'fs';

async function captureTemplatesDom() {
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
      const c4 = pageWrapper.children[4];
      return {
        outerHTML: c4.outerHTML,
        rect: {
          x: Math.round(c4.getBoundingClientRect().x),
          y: Math.round(c4.getBoundingClientRect().y + window.scrollY),
          w: Math.round(c4.getBoundingClientRect().width),
          h: Math.round(c4.getBoundingClientRect().height)
        }
      };
    })()`,
    returnByValue: true
  });

  const val = res.result?.result?.value;
  console.log('Templates rect:', val?.rect);
  fs.writeFileSync('work/analysis/section4-templates-live-dom.html', val?.outerHTML || '', 'utf8');
  console.log('Saved live DOM snapshot, size:', (val?.outerHTML || '').length);
  ws.close();
}

captureTemplatesDom().catch(console.error);

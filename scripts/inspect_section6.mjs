import WebSocket from 'ws';
import fs from 'fs';

async function inspectSection6() {
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
      const children = Array.from(pageWrapper.children).map((c, i) => {
        const r = c.getBoundingClientRect();
        return {
          idx: i,
          tag: c.tagName,
          classes: c.className,
          text: (c.innerText || '').slice(0, 80).replace(/\\n/g, ' '),
          rect: {
            x: Math.round(r.x),
            y: Math.round(r.y + window.scrollY),
            w: Math.round(r.width),
            h: Math.round(r.height)
          }
        };
      });
      const c6 = pageWrapper.children[6];
      return {
        children,
        c6Outer: c6 ? c6.outerHTML : null,
        c6Rect: c6 ? {
          x: Math.round(c6.getBoundingClientRect().x),
          y: Math.round(c6.getBoundingClientRect().y + window.scrollY),
          w: Math.round(c6.getBoundingClientRect().width),
          h: Math.round(c6.getBoundingClientRect().height)
        } : null
      };
    })()`,
    returnByValue: true
  });

  const val = res.result?.result?.value;
  console.log('Children list:');
  console.log(JSON.stringify(val?.children, null, 2));
  console.log('c6 rect:', val?.c6Rect);
  if (val?.c6Outer) {
    fs.writeFileSync('work/analysis/section6-testimonials-live-dom.html', val.c6Outer, 'utf8');
    console.log('Saved section6-testimonials-live-dom.html, size:', val.c6Outer.length);
  }
  ws.close();
}

inspectSection6().catch(console.error);

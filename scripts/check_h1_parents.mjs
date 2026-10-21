import WebSocket from 'ws';

async function run() {
  const ws = new WebSocket('ws://127.0.0.1:9222/devtools/page/A7DF9577D21FF635BD6EF295E92FAEC1');
  await new Promise(r => ws.onopen = r);
  let cid = 1;
  const send = (method, params = {}) => new Promise((resolve) => {
    const curId = cid++;
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
      const getR = (el) => {
        if (!el) return null;
        const r = el.getBoundingClientRect();
        return { y: Math.round(r.y), h: Math.round(r.height), pt: window.getComputedStyle(el).paddingTop, mt: window.getComputedStyle(el).marginTop };
      };
      const h1 = document.querySelector("h1");
      const p1 = h1 ? h1.parentElement : null;
      const p2 = p1 ? p1.parentElement : null;
      const p3 = p2 ? p2.parentElement : null;
      return {
        h1: getR(h1),
        p1: getR(p1),
        p2: getR(p2),
        p3: getR(p3)
      };
    })()`,
    returnByValue: true
  });

  console.log('Live h1 parent chain:', res.result.value);
  ws.close();
}

run();

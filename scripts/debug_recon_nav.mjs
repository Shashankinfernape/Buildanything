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
      const getR = (el) => {
        if (!el) return null;
        const r = el.getBoundingClientRect();
        return { x: Math.round(r.x), y: Math.round(r.y), w: Math.round(r.width), h: Math.round(r.height) };
      };
      const h = document.querySelector("header");
      const nav = h.querySelector("nav");
      return {
        header: getR(h),
        nav: getR(nav),
        topDiv: nav ? getR(nav.firstElementChild) : null,
        children: nav ? Array.from(nav.children).map(c => ({
          tag: c.tagName,
          classes: c.className,
          rect: getR(c)
        })) : []
      };
    })()`,
    returnByValue: true
  });
  console.log(JSON.stringify(res.result.value, null, 2));
  ws.close();
}
check();

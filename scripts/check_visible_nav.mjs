import WebSocket from 'ws';

async function checkDesktopButtons() {
  for (const [id, label] of [['0CEBF5F820FA8AA89465BD16147DDED9', 'LIVE'], ['A7DF9577D21FF635BD6EF295E92FAEC1', 'RECON']]) {
    const ws = new WebSocket('ws://127.0.0.1:9222/devtools/page/' + id);
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
        const h = document.querySelector("header");
        const nav = h.querySelector("nav");
        const items = Array.from(nav.querySelectorAll("button, a")).map(el => {
          const r = el.getBoundingClientRect();
          return {
            tag: el.tagName,
            text: (el.innerText || '').split('\\n')[0].trim(),
            rect: { x: Math.round(r.x), y: Math.round(r.y), w: Math.round(r.width), h: Math.round(r.height) },
            visible: r.width > 0 && r.height > 0
          };
        }).filter(x => x.visible);
        return items;
      })()`,
      returnByValue: true
    });
    console.log('=== ' + label + ' VISIBLE NAV ITEMS ===');
    console.log(JSON.stringify(res.result?.value, null, 2));
    ws.close();
  }
}
checkDesktopButtons();

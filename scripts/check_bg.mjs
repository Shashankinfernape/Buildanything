import WebSocket from 'ws';

async function checkBg() {
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
        const body = document.body;
        const html = document.documentElement;
        return {
          htmlBg: window.getComputedStyle(html).backgroundColor,
          bodyBg: window.getComputedStyle(body).backgroundColor,
          headerBg: h ? window.getComputedStyle(h).backgroundColor : null,
          headerBackdrop: h ? window.getComputedStyle(h).backdropFilter : null,
          headerBorder: h ? window.getComputedStyle(h).borderBottom : null
        };
      })()`,
      returnByValue: true
    });
    console.log(label, res.result?.value);
    ws.close();
  }
}
checkBg();

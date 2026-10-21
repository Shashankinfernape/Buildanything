import WebSocket from 'ws';

function createCdpSender(targetId) {
  return new Promise(async (resolve, reject) => {
    try {
      const ws = new WebSocket(`ws://127.0.0.1:9222/devtools/page/${targetId}`);
      await new Promise(r => ws.onopen = r);
      let cid = 1;
      const send = (method, params = {}) => new Promise((res, rej) => {
        const curId = cid++;
        const timer = setTimeout(() => rej(new Error(`CDP timeout: ${method}`)), 10000);
        const handler = (evt) => {
          const data = JSON.parse(evt.data);
          if (data.id === curId) {
            clearTimeout(timer);
            ws.removeEventListener('message', handler);
            res(data.result);
          }
        };
        ws.addEventListener('message', handler);
        ws.send(JSON.stringify({ id: curId, method, params }));
      });
      resolve({ ws, send });
    } catch (err) {
      reject(err);
    }
  });
}

async function check(targetId, label) {
  const cdp = await createCdpSender(targetId);
  const res = await cdp.send('Runtime.evaluate', {
    expression: `(() => {
      const p = document.querySelector(".banner-content-container")?.parentElement;
      const r = p ? p.getBoundingClientRect() : null;
      const h1 = document.querySelector("h1");
      const hr = h1 ? h1.getBoundingClientRect() : null;
      return {
        bannerParent: r ? { y: Math.round(r.y), h: Math.round(r.height) } : null,
        h1: hr ? { y: Math.round(hr.y), h: Math.round(hr.height) } : null
      };
    })()`,
    returnByValue: true
  });
  console.log(label, res.result.value);
  cdp.ws.close();
}

async function run() {
  await check('0CEBF5F820FA8AA89465BD16147DDED9', 'LIVE');
  await check('A7DF9577D21FF635BD6EF295E92FAEC1', 'RECON');
}

run();

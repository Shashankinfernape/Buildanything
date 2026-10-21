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

async function inspectHero(targetId, label) {
  const cdp = await createCdpSender(targetId);
  const res = await cdp.send('Runtime.evaluate', {
    expression: `(() => {
      const h1 = document.querySelector('h1');
      const textarea = document.querySelector('textarea');
      const inputRoot = document.querySelector('[data-agent-input2-root]');
      const submitBtn = document.querySelector('[data-cy=\"ai-prompt-submit\"]');

      const getR = (el) => {
        if (!el) return null;
        const r = el.getBoundingClientRect();
        return { x: Math.round(r.x), y: Math.round(r.y), w: Math.round(r.width), h: Math.round(r.height) };
      };

      return {
        h1: {
          text: h1?.innerText?.trim(),
          rect: getR(h1),
          fontSize: h1 ? window.getComputedStyle(h1).fontSize : null,
          fontFamily: h1 ? window.getComputedStyle(h1).fontFamily : null,
          color: h1 ? window.getComputedStyle(h1).color : null
        },
        inputRoot: getR(inputRoot),
        textarea: {
          rect: getR(textarea),
          fontSize: textarea ? window.getComputedStyle(textarea).fontSize : null,
          fontFamily: textarea ? window.getComputedStyle(textarea).fontFamily : null
        },
        submitBtn: getR(submitBtn)
      };
    })()`,
    returnByValue: true
  });
  console.log(`=== ${label} HERO LAYOUT ===`);
  console.log(JSON.stringify(res.result.value, null, 2));
  cdp.ws.close();
}

async function run() {
  await inspectHero('0CEBF5F820FA8AA89465BD16147DDED9', 'LIVE REPLIT');
  await inspectHero('A7DF9577D21FF635BD6EF295E92FAEC1', 'RECONSTRUCTION');
}

run().catch(console.error);

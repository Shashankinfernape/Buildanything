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

async function run() {
  const cdp = await createCdpSender('0CEBF5F820FA8AA89465BD16147DDED9');
  const res = await cdp.send('Runtime.evaluate', {
    expression: `(() => {
      const textarea = document.querySelector('textarea');
      const box = textarea.closest('._sdz_theme-text-input > div') || textarea.parentElement.parentElement;
      const submit = document.querySelector('[data-cy=\"ai-prompt-submit\"]');
      const attach = document.querySelector('button[aria-label=\"Add attachment\"]');
      const pills = document.querySelector('.snap-x');

      const getS = (el) => {
        if (!el) return null;
        const s = window.getComputedStyle(el);
        const r = el.getBoundingClientRect();
        return {
          rect: { x: Math.round(r.x), y: Math.round(r.y), w: Math.round(r.width), h: Math.round(r.height) },
          bg: s.backgroundColor,
          border: s.border,
          borderRadius: s.borderRadius,
          boxShadow: s.boxShadow,
          padding: s.padding
        };
      };

      return {
        box: getS(box),
        textarea: getS(textarea),
        submit: getS(submit),
        attach: getS(attach),
        pills: getS(pills)
      };
    })()`,
    returnByValue: true
  });

  console.log('LIVE PROMPT BOX COMPUTED STYLES:');
  console.log(JSON.stringify(res.result.value, null, 2));
  cdp.ws.close();
}

run().catch(console.error);

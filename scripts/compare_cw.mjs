import WebSocket from 'ws';

const LIVE_ID = '0CEBF5F820FA8AA89465BD16147DDED9';
const RECON_ID = 'A7DF9577D21FF635BD6EF295E92FAEC1';

function createCdpSender(targetId) {
  return new Promise(async (resolve, reject) => {
    const ws = new WebSocket(`ws://127.0.0.1:9222/devtools/page/${targetId}`);
    await new Promise(r => ws.onopen = r);
    let cid = 1;
    const send = (method, params = {}) => new Promise((res) => {
      const curId = cid++;
      const handler = (evt) => {
        const data = JSON.parse(evt.data);
        if (data.id === curId) {
          ws.removeEventListener('message', handler);
          res(data.result);
        }
      };
      ws.addEventListener('message', handler);
      ws.send(JSON.stringify({ id: curId, method, params }));
    });
    resolve({ ws, send });
  });
}

async function run() {
  const live = await createCdpSender(LIVE_ID);
  const recon = await createCdpSender(RECON_ID);

  const script = `(() => {
    const c1 = document.querySelector('h1').closest('.pt-900');
    const contentWrapper = c1.children[1];
    const inner = contentWrapper.children[0];
    const r1 = c1.getBoundingClientRect();
    const rc = contentWrapper.getBoundingClientRect();
    const ri = inner.getBoundingClientRect();
    return {
      c1: { y: Math.round(r1.y), h: Math.round(r1.height) },
      cw: { y: Math.round(rc.y), h: Math.round(rc.height) },
      in: { y: Math.round(ri.y), h: Math.round(ri.height) }
    };
  })()`;

  const lRes = await live.send('Runtime.evaluate', { expression: script, returnByValue: true });
  const rRes = await recon.send('Runtime.evaluate', { expression: script, returnByValue: true });

  console.log('Live:', lRes.result?.value);
  console.log('Recon:', rRes.result?.value);

  live.ws.close();
  recon.ws.close();
}

run().catch(console.error);

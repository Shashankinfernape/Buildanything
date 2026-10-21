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
    const h1 = document.querySelector('h1');
    const h1R = h1 ? h1.getBoundingClientRect() : null;
    const tagline = h1 ? h1.nextElementSibling : null;
    const tagR = tagline ? tagline.getBoundingClientRect() : null;
    const box = document.querySelector('[data-agent-input2-root]');
    const boxR = box ? box.getBoundingClientRect() : null;
    const banner = document.querySelector('.banner-content-container');
    const bannerR = banner ? banner.parentElement.getBoundingClientRect() : null;
    return {
      banner: bannerR ? { y: Math.round(bannerR.y), h: Math.round(bannerR.height) } : null,
      h1: h1R ? { y: Math.round(h1R.y), h: Math.round(h1R.height) } : null,
      tagline: tagR ? { y: Math.round(tagR.y), h: Math.round(tagR.height) } : null,
      box: boxR ? { y: Math.round(boxR.y), h: Math.round(boxR.height) } : null
    };
  })()`;

  const lRes = await live.send('Runtime.evaluate', { expression: script, returnByValue: true });
  const rRes = await recon.send('Runtime.evaluate', { expression: script, returnByValue: true });

  console.log('Live above box:', lRes.result?.value);
  console.log('Recon above box:', rRes.result?.value);

  live.ws.close();
  recon.ws.close();
}

run().catch(console.error);

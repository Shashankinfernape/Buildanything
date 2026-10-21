import WebSocket from 'ws';

const LIVE_ID = '1F77289A2297F8B8A35F03904F821099';
const RECON_ID = 'D443E8091E8733163C20C86AEEDB5714';

function createCdpSender(targetId) {
  return new Promise(async (resolve, reject) => {
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
  });
}

async function measureAtWidth(sender, width, height, mobile) {
  await sender.send('Emulation.setDeviceMetricsOverride', {
    width,
    height,
    deviceScaleFactor: 1,
    mobile
  });
  await new Promise(r => setTimeout(r, 600));

  const expr = `(() => {
    const header = document.querySelector('header');
    const h1 = document.querySelector('h1');
    const hero = h1 ? h1.closest('.flex.box-border.min-h-0.min-w-0.border-0.border-solid.view-outline-none.flex-col.justify-logical-start.items-stretch.shrink-0') || h1.parentElement.parentElement.parentElement : null;
    const footer = document.querySelector('footer');

    const getBox = (el) => {
      if (!el) return null;
      const b = el.getBoundingClientRect();
      return {
        x: Math.round(b.x),
        y: Math.round(b.y + window.scrollY),
        w: Math.round(b.width),
        h: Math.round(b.height)
      };
    };

    return {
      header: getBox(header),
      hero: getBox(hero),
      footer: getBox(footer),
      windowInner: { w: window.innerWidth, h: window.innerHeight }
    };
  })()`;

  return (await sender.send('Runtime.evaluate', { expression: expr, returnByValue: true })).result.value;
}

async function main() {
  const live = await createCdpSender(LIVE_ID);
  const recon = await createCdpSender(RECON_ID);

  console.log('--- 1034px Measurement ---');
  const live1034 = await measureAtWidth(live, 1034, 900, false);
  const recon1034 = await measureAtWidth(recon, 1034, 900, false);
  console.log('LIVE 1034:', JSON.stringify(live1034, null, 2));
  console.log('RECON 1034:', JSON.stringify(recon1034, null, 2));

  console.log('\n--- 390px Measurement ---');
  const live390 = await measureAtWidth(live, 390, 844, true);
  const recon390 = await measureAtWidth(recon, 390, 844, true);
  console.log('LIVE 390:', JSON.stringify(live390, null, 2));
  console.log('RECON 390:', JSON.stringify(recon390, null, 2));

  live.ws.close();
  recon.ws.close();
}

main().catch(console.error);

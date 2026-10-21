import WebSocket from 'ws';

async function checkBounds() {
  const liveWs = new WebSocket('ws://127.0.0.1:9222/devtools/page/0CEBF5F820FA8AA89465BD16147DDED9');
  await new Promise(r => liveWs.onopen = r);
  let liveId = 1;
  const sendLive = (method, params = {}) => new Promise((resolve) => {
    const curId = liveId++;
    const handler = (evt) => {
      const data = JSON.parse(evt.data);
      if (data.id === curId) {
        liveWs.removeEventListener('message', handler);
        resolve(data);
      }
    };
    liveWs.addEventListener('message', handler);
    liveWs.send(JSON.stringify({ id: curId, method, params }));
  });

  const reconWs = new WebSocket('ws://127.0.0.1:9222/devtools/page/A7DF9577D21FF635BD6EF295E92FAEC1');
  await new Promise(r => reconWs.onopen = r);
  let reconId = 1;
  const sendRecon = (method, params = {}) => new Promise((resolve) => {
    const curId = reconId++;
    const handler = (evt) => {
      const data = JSON.parse(evt.data);
      if (data.id === curId) {
        reconWs.removeEventListener('message', handler);
        resolve(data);
      }
    };
    reconWs.addEventListener('message', handler);
    reconWs.send(JSON.stringify({ id: curId, method, params }));
  });

  // Reload recon tab to get fresh build
  await sendRecon('Page.reload');
  await new Promise(r => setTimeout(r, 1000));

  const liveRes = await sendLive('Runtime.evaluate', {
    expression: `(() => {
      const next = document.getElementById('__next');
      const pageWrapper = next.children[7].children[0];
      const c9 = pageWrapper.children[9];
      const c10 = pageWrapper.children[10];
      const r9 = c9.getBoundingClientRect();
      const r10 = c10.getBoundingClientRect();
      return {
        c9: { x: Math.round(r9.x), y: Math.round(r9.y + window.scrollY), w: Math.round(r9.width), h: Math.round(r9.height) },
        c10: { x: Math.round(r10.x), y: Math.round(r10.y + window.scrollY), w: Math.round(r10.width), h: Math.round(r10.height) }
      };
    })()`,
    returnByValue: true
  });

  const reconRes = await sendRecon('Runtime.evaluate', {
    expression: `(() => {
      const page = document.querySelector('.min-h-screen');
      const c9 = page.children[9];
      const c10 = page.children[10];
      const r9 = c9.getBoundingClientRect();
      const r10 = c10.getBoundingClientRect();
      return {
        c9: { x: Math.round(r9.x), y: Math.round(r9.y + window.scrollY), w: Math.round(r9.width), h: Math.round(r9.height) },
        c10: { x: Math.round(r10.x), y: Math.round(r10.y + window.scrollY), w: Math.round(r10.width), h: Math.round(r10.height) }
      };
    })()`,
    returnByValue: true
  });

  console.log('Live Section 9 bounds:', JSON.stringify(liveRes.result?.result?.value, null, 2));
  console.log('Recon Section 9 bounds:', JSON.stringify(reconRes.result?.result?.value, null, 2));

  liveWs.close();
  reconWs.close();
}

checkBounds().catch(console.error);

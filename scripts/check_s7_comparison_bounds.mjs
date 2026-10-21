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
      const c7 = next.children[7].children[0].children[7];
      const r = c7.getBoundingClientRect();
      const grid = c7.querySelector('.grid');
      const gridR = grid ? grid.getBoundingClientRect() : null;
      const h2 = c7.querySelector('h2');
      const h2R = h2 ? h2.getBoundingClientRect() : null;
      const control = c7.querySelector('fieldset');
      const controlR = control ? control.getBoundingClientRect() : null;
      return {
        section: { x: Math.round(r.x), y: Math.round(r.y + window.scrollY), w: Math.round(r.width), h: Math.round(r.height) },
        h2: h2R ? { x: Math.round(h2R.x), y: Math.round(h2R.y + window.scrollY), w: Math.round(h2R.width), h: Math.round(h2R.height) } : null,
        control: controlR ? { x: Math.round(controlR.x), y: Math.round(controlR.y + window.scrollY), w: Math.round(controlR.width), h: Math.round(controlR.height) } : null,
        grid: gridR ? { x: Math.round(gridR.x), y: Math.round(gridR.y + window.scrollY), w: Math.round(gridR.width), h: Math.round(gridR.height) } : null
      };
    })()`,
    returnByValue: true
  });

  const reconRes = await sendRecon('Runtime.evaluate', {
    expression: `(() => {
      const c7 = document.querySelector('.min-h-screen').children[7];
      const r = c7.getBoundingClientRect();
      const grid = c7.querySelector('.grid');
      const gridR = grid ? grid.getBoundingClientRect() : null;
      const h2 = c7.querySelector('h2');
      const h2R = h2 ? h2.getBoundingClientRect() : null;
      const control = c7.querySelector('fieldset');
      const controlR = control ? control.getBoundingClientRect() : null;
      return {
        section: { x: Math.round(r.x), y: Math.round(r.y + window.scrollY), w: Math.round(r.width), h: Math.round(r.height) },
        h2: h2R ? { x: Math.round(h2R.x), y: Math.round(h2R.y + window.scrollY), w: Math.round(h2R.width), h: Math.round(h2R.height) } : null,
        control: controlR ? { x: Math.round(controlR.x), y: Math.round(controlR.y + window.scrollY), w: Math.round(controlR.width), h: Math.round(controlR.height) } : null,
        grid: gridR ? { x: Math.round(gridR.x), y: Math.round(gridR.y + window.scrollY), w: Math.round(gridR.width), h: Math.round(gridR.height) } : null
      };
    })()`,
    returnByValue: true
  });

  console.log('Live Section 7 bounds:', JSON.stringify(liveRes.result?.result?.value, null, 2));
  console.log('Recon Section 7 bounds:', JSON.stringify(reconRes.result?.result?.value, null, 2));

  liveWs.close();
  reconWs.close();
}

checkBounds().catch(console.error);

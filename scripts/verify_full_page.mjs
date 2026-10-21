import WebSocket from 'ws';

async function verifyFullPage() {
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
      return Array.from(pageWrapper.children).map((c, i) => {
        const r = c.getBoundingClientRect();
        return {
          idx: i,
          tag: c.tagName,
          text: (c.innerText || '').slice(0, 30).replace(/\\n/g, ' '),
          x: Math.round(r.x),
          y: Math.round(r.y + window.scrollY),
          w: Math.round(r.width),
          h: Math.round(r.height)
        };
      });
    })()`,
    returnByValue: true
  });

  const reconRes = await sendRecon('Runtime.evaluate', {
    expression: `(() => {
      const page = document.querySelector('.min-h-screen');
      return Array.from(page.children).map((c, i) => {
        const r = c.getBoundingClientRect();
        return {
          idx: i,
          tag: c.tagName,
          text: (c.innerText || '').slice(0, 30).replace(/\\n/g, ' '),
          x: Math.round(r.x),
          y: Math.round(r.y + window.scrollY),
          w: Math.round(r.width),
          h: Math.round(r.height)
        };
      });
    })()`,
    returnByValue: true
  });

  console.log('=== LIVE SECTIONS ===');
  console.log(JSON.stringify(liveRes.result?.result?.value, null, 2));

  console.log('\n=== RECON SECTIONS ===');
  console.log(JSON.stringify(reconRes.result?.result?.value, null, 2));

  liveWs.close();
  reconWs.close();
}

verifyFullPage().catch(console.error);

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
      const c6 = next.children[7].children[0].children[6];
      const r = c6.getBoundingClientRect();
      const badge = c6.querySelector('.pointer-events-none.absolute.left-0');
      const badgeR = badge ? badge.getBoundingClientRect() : null;
      const bubble = c6.querySelector('.pointer-events-none.absolute.right-0');
      const bubbleR = bubble ? bubble.getBoundingClientRect() : null;
      const fig = c6.querySelector('figure');
      const figR = fig ? fig.getBoundingClientRect() : null;
      return {
        section: { x: Math.round(r.x), y: Math.round(r.y + window.scrollY), w: Math.round(r.width), h: Math.round(r.height) },
        badge: badgeR ? { x: Math.round(badgeR.x), y: Math.round(badgeR.y + window.scrollY), w: Math.round(badgeR.width), h: Math.round(badgeR.height) } : null,
        bubble: bubbleR ? { x: Math.round(bubbleR.x), y: Math.round(bubbleR.y + window.scrollY), w: Math.round(bubbleR.width), h: Math.round(bubbleR.height) } : null,
        figure: figR ? { x: Math.round(figR.x), y: Math.round(figR.y + window.scrollY), w: Math.round(figR.width), h: Math.round(figR.height) } : null
      };
    })()`,
    returnByValue: true
  });

  const reconRes = await sendRecon('Runtime.evaluate', {
    expression: `(() => {
      const c6 = document.querySelector('.min-h-screen').children[6];
      const r = c6.getBoundingClientRect();
      const badge = c6.querySelector('.pointer-events-none.absolute.left-0');
      const badgeR = badge ? badge.getBoundingClientRect() : null;
      const bubble = c6.querySelector('.pointer-events-none.absolute.right-0');
      const bubbleR = bubble ? bubble.getBoundingClientRect() : null;
      const fig = c6.querySelector('figure');
      const figR = fig ? fig.getBoundingClientRect() : null;
      return {
        section: { x: Math.round(r.x), y: Math.round(r.y + window.scrollY), w: Math.round(r.width), h: Math.round(r.height) },
        badge: badgeR ? { x: Math.round(badgeR.x), y: Math.round(badgeR.y + window.scrollY), w: Math.round(badgeR.width), h: Math.round(badgeR.height) } : null,
        bubble: bubbleR ? { x: Math.round(bubbleR.x), y: Math.round(bubbleR.y + window.scrollY), w: Math.round(bubbleR.width), h: Math.round(bubbleR.height) } : null,
        figure: figR ? { x: Math.round(figR.x), y: Math.round(figR.y + window.scrollY), w: Math.round(figR.width), h: Math.round(figR.height) } : null
      };
    })()`,
    returnByValue: true
  });

  console.log('Live Section 6 bounds:', JSON.stringify(liveRes.result?.result?.value, null, 2));
  console.log('Recon Section 6 bounds:', JSON.stringify(reconRes.result?.result?.value, null, 2));

  liveWs.close();
  reconWs.close();
}

checkBounds().catch(console.error);

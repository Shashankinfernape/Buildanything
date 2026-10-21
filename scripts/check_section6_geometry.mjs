import WebSocket from 'ws';

async function checkPhotoRect() {
  const ws = new WebSocket('ws://127.0.0.1:9222/devtools/page/0CEBF5F820FA8AA89465BD16147DDED9');
  await new Promise(r => ws.onopen = r);
  let id = 1;
  const send = (method, params = {}) => new Promise((resolve) => {
    const curId = id++;
    const handler = (evt) => {
      const data = JSON.parse(evt.data);
      if (data.id === curId) {
        ws.removeEventListener('message', handler);
        resolve(data);
      }
    };
    ws.addEventListener('message', handler);
    ws.send(JSON.stringify({ id: curId, method, params }));
  });

  const res = await send('Runtime.evaluate', {
    expression: `(() => {
      const next = document.getElementById('__next');
      const c6 = next.children[7].children[0].children[6];
      const img = c6.querySelector('img');
      const r = img ? img.getBoundingClientRect() : null;
      const parentR = img ? img.parentElement.getBoundingClientRect() : null;
      const fig = c6.querySelector('figure');
      const figR = fig ? fig.getBoundingClientRect() : null;
      const svg = c6.querySelector('svg');
      const bubbleR = svg ? svg.getBoundingClientRect() : null;
      const badge = c6.querySelector('span'); // "Trusted by builders" container
      return {
        img: r ? { x: Math.round(r.x), y: Math.round(r.y + window.scrollY), w: Math.round(r.width), h: Math.round(r.height) } : null,
        parent: parentR ? { x: Math.round(parentR.x), y: Math.round(parentR.y + window.scrollY), w: Math.round(parentR.width), h: Math.round(parentR.height) } : null,
        figure: figR ? { x: Math.round(figR.x), y: Math.round(figR.y + window.scrollY), w: Math.round(figR.width), h: Math.round(figR.height) } : null,
        bubble: bubbleR ? { x: Math.round(bubbleR.x), y: Math.round(bubbleR.y + window.scrollY), w: Math.round(bubbleR.width), h: Math.round(bubbleR.height) } : null
      };
    })()`,
    returnByValue: true
  });

  console.log('Testimonial elements geometry:', JSON.stringify(res.result?.result?.value, null, 2));
  ws.close();
}

checkPhotoRect().catch(console.error);

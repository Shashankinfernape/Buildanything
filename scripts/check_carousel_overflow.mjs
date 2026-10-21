import WebSocket from 'ws';

async function checkOverflow() {
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
      const carouselViewport = c6.querySelector('.relative.hidden > div');
      const cs = window.getComputedStyle(carouselViewport);
      return {
        className: carouselViewport.className,
        overflow: cs.overflow,
        overflowX: cs.overflowX,
        width: cs.width
      };
    })()`,
    returnByValue: true
  });

  console.log('Carousel viewport computed style:', res.result?.result?.value);
  ws.close();
}

checkOverflow().catch(console.error);

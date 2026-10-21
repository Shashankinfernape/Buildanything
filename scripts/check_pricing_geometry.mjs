import WebSocket from 'ws';

async function checkPricingGeometry() {
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
      const c7 = next.children[7].children[0].children[7];
      const r = c7.getBoundingClientRect();
      const grid = c7.querySelector('.grid');
      const gridR = grid ? grid.getBoundingClientRect() : null;
      const cards = grid ? Array.from(grid.children).map((c, i) => {
        const cr = c.getBoundingClientRect();
        return {
          idx: i,
          x: Math.round(cr.x),
          y: Math.round(cr.y + window.scrollY),
          w: Math.round(cr.width),
          h: Math.round(cr.height)
        };
      }) : [];
      return {
        section: { x: Math.round(r.x), y: Math.round(r.y + window.scrollY), w: Math.round(r.width), h: Math.round(r.height) },
        grid: gridR ? { x: Math.round(gridR.x), y: Math.round(gridR.y + window.scrollY), w: Math.round(gridR.width), h: Math.round(gridR.height) } : null,
        cards
      };
    })()`,
    returnByValue: true
  });

  console.log('Pricing geometry on live page:');
  console.log(JSON.stringify(res.result?.result?.value, null, 2));
  ws.close();
}

checkPricingGeometry().catch(console.error);

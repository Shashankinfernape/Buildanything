import WebSocket from 'ws';

const TARGET_ID = '4D5803D83D1C78981FF3E408A2F4B2D5';

async function main() {
  const ws = new WebSocket(`ws://127.0.0.1:9222/devtools/page/${TARGET_ID}`);
  await new Promise(r => ws.onopen = r);
  let cid = 1;
  const send = (m, p = {}) => new Promise(res => {
    const id = cid++;
    const handler = d => {
      const j = JSON.parse(d);
      if (j.id === id) {
        ws.removeListener('message', handler);
        res(j.result);
      }
    };
    ws.on('message', handler);
    ws.send(JSON.stringify({ id, method: m, params: p }));
  });

  const domSummary = await send('Runtime.evaluate', {
    expression: `(() => {
      const main = document.querySelector('main');
      if (!main) return 'no main';
      
      const elements = Array.from(main.querySelectorAll('h1, h2, h3, p, span, button, a, textarea, [contenteditable="true"]')).map(el => {
        const r = el.getBoundingClientRect();
        return {
          tag: el.tagName,
          text: el.innerText ? el.innerText.trim().slice(0, 80) : '',
          rect: { x: Math.round(r.x), y: Math.round(r.y), w: Math.round(r.width), h: Math.round(r.height) },
          classes: el.className
        };
      }).filter(item => item.text.length > 0 && item.rect.w > 0 && item.rect.h > 0);

      return elements.slice(0, 40);
    })()`,
    returnByValue: true
  });

  console.log('Live Main DOM Summary (First 40 text elements):');
  console.log(JSON.stringify(domSummary.result?.value, null, 2));
  ws.close();
}

main().catch(console.error);

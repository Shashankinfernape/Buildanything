import WebSocket from 'ws';
import fs from 'fs';

const TARGET_ID = '4D5803D83D1C78981FF3E408A2F4B2D5';

async function main() {
  const ws = new WebSocket(`ws://127.0.0.1:9222/devtools/page/${TARGET_ID}`);
  await new Promise(r => ws.onopen = r);
  let cid = 1;
  const send = (m, p={}) => new Promise(res => {
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

  const res = await send('Runtime.evaluate', {
    expression: `(() => {
      // Find sidebar and main container
      const sidebar = document.querySelector('nav') || document.querySelector('aside') || Array.from(document.querySelectorAll('*')).find(el => {
        const r = el.getBoundingClientRect();
        return r.left === 0 && r.width >= 200 && r.width <= 280 && r.height > 600;
      });

      const main = document.querySelector('main') || document.querySelector('[role="main"]') || Array.from(document.querySelectorAll('*')).find(el => {
        const r = el.getBoundingClientRect();
        return r.left > 200 && r.width > 600 && r.height > 600;
      });

      return {
        sidebar: sidebar ? {
          tag: sidebar.tagName,
          cls: sidebar.className,
          w: Math.round(sidebar.getBoundingClientRect().width),
          h: Math.round(sidebar.getBoundingClientRect().height)
        } : null,
        main: main ? {
          tag: main.tagName,
          cls: main.className,
          w: Math.round(main.getBoundingClientRect().width),
          h: Math.round(main.getBoundingClientRect().height)
        } : null
      };
    })()`,
    returnByValue: true
  });

  console.log(JSON.stringify(res.result.value, null, 2));
  ws.close();
}

main().catch(console.error);

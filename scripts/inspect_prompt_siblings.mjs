import WebSocket from 'ws';

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
      const h1 = document.querySelector('h1');
      const section = h1.closest('.flex.box-border.min-h-0.min-w-0.border-0.border-solid.view-outline-none.flex-col.justify-logical-start.items-stretch.shrink-0.gap-\\[13px\\]');
      const p = section?.parentElement;
      return {
        parentCls: p?.className,
        siblings: Array.from(p ? p.children : []).map(c => ({
          tag: c.tagName,
          cls: c.className,
          w: Math.round(c.getBoundingClientRect().width),
          h: Math.round(c.getBoundingClientRect().height),
          textSnippet: c.textContent.trim().slice(0, 80),
          htmlSnippet: c.outerHTML.slice(0, 150)
        }))
      };
    })()`,
    returnByValue: true
  });

  console.log(JSON.stringify(res.result.value, null, 2));
  ws.close();
}

main().catch(console.error);

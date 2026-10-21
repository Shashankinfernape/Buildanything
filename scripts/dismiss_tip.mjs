import WebSocket from 'ws';

const TARGET_ID = '4D5803D83D1C78981FF3E408A2F4B2D5';

async function main() {
  const ws = new WebSocket(`ws://127.0.0.1:9222/devtools/page/${TARGET_ID}`);
  await new Promise(r => ws.onopen = r);
  let cid = 1;
  const send = (m, p = {}) => new Promise(res => {
    const id = cid++;
    ws.on('message', function h(d) {
      const j = JSON.parse(d);
      if (j.id === id) { ws.removeListener('message', h); res(j.result); }
    });
    ws.send(JSON.stringify({ id, method: m, params: p }));
  });

  const res = await send('Runtime.evaluate', {
    expression: `(() => {
      const closeBtn = document.querySelector('[aria-label="Close"]');
      if (closeBtn) closeBtn.click();
      return { clicked: !!closeBtn };
    })()`,
    returnByValue: true
  });

  console.log('Dismiss result:', res.result?.value);
  ws.close();
}

main().catch(console.error);

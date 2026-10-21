import WebSocket from 'ws';

async function checkLive() {
  const ws = new WebSocket('ws://127.0.0.1:9222/devtools/page/1F77289A2297F8B8A35F03904F821099');
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
      return {
        url: window.location.href,
        title: document.title,
        text: document.body ? document.body.innerText.slice(0, 800) : 'no body',
        htmlLength: document.documentElement ? document.documentElement.outerHTML.length : 0
      };
    })()`,
    returnByValue: true
  });

  console.log('Live page state:', JSON.stringify(res.result?.value, null, 2));
  ws.close();
}

checkLive().catch(console.error);

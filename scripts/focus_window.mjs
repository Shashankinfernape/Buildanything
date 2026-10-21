import WebSocket from 'ws';

async function focusWindow() {
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

  const win = await send('Browser.getWindowForTarget');
  console.log('Window info:', win);
  if (win && win.windowId) {
    await send('Browser.setWindowBounds', {
      windowId: win.windowId,
      bounds: { windowState: 'normal' }
    });
  }
  await send('Page.bringToFront');
  ws.close();
}

focusWindow().catch(console.error);

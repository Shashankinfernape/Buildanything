import WebSocket from 'ws';

async function bringToFrontAndReload() {
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

  console.log('Bringing Replit tab to front...');
  await send('Page.bringToFront');
  console.log('Navigating to https://replit.com/ ...');
  await send('Page.navigate', { url: 'https://replit.com/' });
  await new Promise(r => setTimeout(r, 1000));
  ws.close();
  console.log('Done.');
}

bringToFrontAndReload().catch(console.error);

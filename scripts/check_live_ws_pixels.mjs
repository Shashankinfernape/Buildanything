import WebSocket from 'ws';

async function main() {
  const tabs = await fetch('http://127.0.0.1:9222/json').then(r => r.json());
  const recon = tabs.find(t => t.id === '6D4B931B5EC0B7BE74E378FA2E19EDD9');
  const ws = new WebSocket(recon.webSocketDebuggerUrl);
  ws.on('open', () => {
    ws.send(JSON.stringify({
      id: 1,
      method: 'Runtime.evaluate',
      params: {
        expression: `(async () => {
          // Load debug_live_ws.png and check pixels
          const img = new Image();
          img.src = 'data:image/png;base64,' + (await fetch('/work/analysis/signed_in/debug_live_ws.png').catch(() => null));
          return 'done';
        })()`,
        returnByValue: true
      }
    }));
  });
  ws.on('message', d => { const m = JSON.parse(d); if (m.id === 1) { console.log(m); process.exit(0); } });
}

main().catch(console.error);

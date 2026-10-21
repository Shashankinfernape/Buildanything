import WebSocket from 'ws';

async function testSnap() {
  const tabs = await fetch('http://127.0.0.1:9222/json').then(r => r.json());
  const tab = tabs.find(t => t.id === '6D4B931B5EC0B7BE74E378FA2E19EDD9');
  const ws = new WebSocket(tab.webSocketDebuggerUrl);

  const res = await new Promise((resolve, reject) => {
    ws.on('open', () => {
      ws.send(JSON.stringify({ id: 100, method: 'Page.captureScreenshot', params: { format: 'png' } }));
    });
    ws.on('message', data => {
      try {
        const msg = JSON.parse(data);
        if (msg.id === 100) {
          ws.close();
          resolve(msg);
        }
      } catch (err) {}
    });
    ws.on('error', reject);
  });

  console.log('Got snap res! Length of data:', res.result?.data?.length);
}

testSnap().catch(console.error);

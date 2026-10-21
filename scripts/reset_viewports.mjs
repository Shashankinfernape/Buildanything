import WebSocket from 'ws';

async function cdpCommand(targetId, method, params = {}) {
  const tabs = await fetch('http://127.0.0.1:9222/json').then(r => r.json());
  const tab = tabs.find(t => t.id === targetId);
  return new Promise((resolve, reject) => {
    const ws = new WebSocket(tab.webSocketDebuggerUrl);
    ws.on('open', () => {
      ws.send(JSON.stringify({ id: 1, method, params }));
    });
    ws.on('message', data => {
      try {
        const msg = JSON.parse(data);
        if (msg.id === 1) {
          ws.close();
          resolve(msg);
        }
      } catch (e) {}
    });
    ws.on('error', reject);
  });
}

async function main() {
  const liveTarget = '4D5803D83D1C78981FF3E408A2F4B2D5';
  const reconTarget = '6D4B931B5EC0B7BE74E378FA2E19EDD9';

  console.log('Resetting live viewport to 1440x765...');
  await cdpCommand(liveTarget, 'Emulation.setDeviceMetricsOverride', {
    width: 1440,
    height: 765,
    deviceScaleFactor: 1,
    mobile: false
  });

  console.log('Resetting recon viewport to 1440x765...');
  await cdpCommand(reconTarget, 'Emulation.setDeviceMetricsOverride', {
    width: 1440,
    height: 765,
    deviceScaleFactor: 1,
    mobile: false
  });

  console.log('Reset complete!');
}

main().catch(console.error);

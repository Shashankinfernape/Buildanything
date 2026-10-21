import WebSocket from 'ws';

async function evalInTab(targetId, expression) {
  const tabs = await fetch('http://127.0.0.1:9222/json').then(r => r.json());
  const tab = tabs.find(t => t.id === targetId);
  return new Promise((resolve, reject) => {
    const ws = new WebSocket(tab.webSocketDebuggerUrl);
    ws.on('open', () => {
      ws.send(JSON.stringify({
        id: 1,
        method: 'Runtime.evaluate',
        params: { expression, returnByValue: true }
      }));
    });
    ws.on('message', data => {
      try {
        const msg = JSON.parse(data);
        if (msg.id === 1) {
          ws.close();
          resolve(msg.result?.result?.value);
        }
      } catch (e) {}
    });
    ws.on('error', reject);
  });
}

async function main() {
  const liveTarget = '4D5803D83D1C78981FF3E408A2F4B2D5';
  const reconTarget = '6D4B931B5EC0B7BE74E378FA2E19EDD9';

  const script = `(() => {
    const m = document.querySelector('main');
    const mr = m ? m.getBoundingClientRect() : null;
    const mcs = m ? window.getComputedStyle(m) : null;

    const inner = document.querySelector('div[data-settings-layout="compact"] > div');
    const ir = inner ? inner.getBoundingClientRect() : null;
    const ics = inner ? window.getComputedStyle(inner) : null;

    return {
      main: mr ? { x: mr.x, y: mr.y, w: mr.width, pl: mcs.paddingLeft, ml: mcs.marginLeft } : null,
      inner: ir ? { x: ir.x, y: ir.y, w: ir.width, pl: ics.paddingLeft, pr: ics.paddingRight, maxW: ics.maxWidth } : null
    };
  })()`;

  const live = await evalInTab(liveTarget, script);
  const recon = await evalInTab(reconTarget, script);

  console.log('Live layout: ', live);
  console.log('Recon layout:', recon);
}

main().catch(console.error);

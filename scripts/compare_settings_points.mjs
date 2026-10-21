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
    const points = [
      { name: 'nav_back_btn', x: 50, y: 24 },
      { name: 'nav_workspace_switcher', x: 100, y: 65 },
      { name: 'nav_overview_item', x: 100, y: 135 },
      { name: 'nav_collaborators', x: 100, y: 170 },
      { name: 'main_h3_title', x: 350, y: 90 },
      { name: 'main_avatar', x: 350, y: 190 },
      { name: 'main_input', x: 550, y: 215 },
      { name: 'main_export_btn', x: 900, y: 350 }
    ];

    return points.map(pt => {
      const el = document.elementFromPoint(pt.x, pt.y);
      const cs = el ? window.getComputedStyle(el) : null;
      return {
        point: pt.name,
        tag: el?.tagName,
        text: el?.innerText?.slice(0, 30),
        bg: cs?.backgroundColor,
        color: cs?.color
      };
    });
  })()`;

  const live = await evalInTab(liveTarget, script);
  const recon = await evalInTab(reconTarget, script);

  console.log('--- POINT COMPARISON ---');
  for (let i = 0; i < live.length; i++) {
    console.log(`\nPoint [${live[i].point}]:`);
    console.log('  Live: ', live[i]);
    console.log('  Recon:', recon[i]);
  }
}

main().catch(console.error);

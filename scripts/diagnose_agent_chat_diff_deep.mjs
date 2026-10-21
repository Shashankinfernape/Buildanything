import WebSocket from 'ws';

async function evalInTab(targetId, expression) {
  const tabs = await fetch('http://127.0.0.1:9222/json').then(r => r.json());
  const tab = tabs.find(t => t.id === targetId);
  return new Promise((resolve, reject) => {
    const ws = new WebSocket(tab.webSocketDebuggerUrl);
    ws.on('open', () => {
      ws.send(JSON.stringify({ id: 1, method: 'Runtime.evaluate', params: { expression, returnByValue: true } }));
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

  await evalInTab(reconTarget, "window.__openProject ? window.__openProject('proj_demo') : window.__setReconScreen('workspace')");
  await new Promise(r => setTimeout(r, 1500));

  const script = `(() => {
    // List all visible elements in agent pane (x: 240..691)
    const els = Array.from(document.querySelectorAll('*')).filter(el => {
      const r = el.getBoundingClientRect();
      return r.left >= 240 && r.right <= 700 && r.top >= 0 && r.height > 10 && el.children.length === 0;
    }).map(el => ({
      tag: el.tagName,
      text: el.innerText ? el.innerText.trim() : '',
      rect: { left: Math.round(el.getBoundingClientRect().left), top: Math.round(el.getBoundingClientRect().top), width: Math.round(el.getBoundingClientRect().width), height: Math.round(el.getBoundingClientRect().height) },
      color: window.getComputedStyle(el).color,
      bg: window.getComputedStyle(el).backgroundColor
    }));
    return els;
  })()`;

  const live = await evalInTab(liveTarget, script);
  const recon = await evalInTab(reconTarget, script);

  console.log('LIVE leaf elements in agent chat (first 15):');
  console.log(JSON.stringify(live.slice(0, 15), null, 2));

  console.log('\nRECON leaf elements in agent chat (first 15):');
  console.log(JSON.stringify(recon.slice(0, 15), null, 2));
}

main().catch(console.error);

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
  const script = `(() => {
    // Find all top-level header or bar containers between y: 0 and y: 48, across the whole x: 240..1440
    const buttons = Array.from(document.querySelectorAll('button, a, fieldset')).filter(el => {
      const r = el.getBoundingClientRect();
      return r.top >= 0 && r.bottom <= 48 && r.left >= 240;
    }).map(el => ({
      tag: el.tagName,
      text: el.innerText.trim(),
      ariaLabel: el.getAttribute('aria-label'),
      rect: { left: Math.round(el.getBoundingClientRect().left), top: Math.round(el.getBoundingClientRect().top), width: Math.round(el.getBoundingClientRect().width), height: Math.round(el.getBoundingClientRect().height) }
    }));
    return buttons;
  })()`;

  const res = await evalInTab(liveTarget, script);
  console.log('All buttons in top bar (y: 0..48):', JSON.stringify(res, null, 2));
}

main().catch(console.error);

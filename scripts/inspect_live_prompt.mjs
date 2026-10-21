import WebSocket from 'ws';

async function evalInTab(targetId, expression) {
  const tabs = await fetch('http://127.0.0.1:9222/json').then(r => r.json());
  const tab = tabs.find(t => t.id === targetId);
  return new Promise((resolve, reject) => {
    const ws = new WebSocket(tab.webSocketDebuggerUrl);
    ws.on('open', () => {
      ws.send(JSON.stringify({ id: 1, method: 'Page.bringToFront' }));
      setTimeout(() => {
        ws.send(JSON.stringify({
          id: 2,
          method: 'Runtime.evaluate',
          params: { expression, returnByValue: true }
        }));
      }, 100);
    });
    ws.on('message', (data) => {
      const msg = JSON.parse(data);
      if (msg.id === 2) {
        ws.close();
        if (msg.error) reject(msg.error);
        else resolve(msg.result?.result?.value);
      }
    });
    ws.on('error', reject);
  });
}

async function main() {
  const liveTarget = '4D5803D83D1C78981FF3E408A2F4B2D5';

  const res = await evalInTab(liveTarget, `
    (() => {
      const promptRoot = document.querySelector('form, [aria-label*="prompt"], [class*="prompt"]') || 
        Array.from(document.querySelectorAll('*')).find(el => el.textContent?.includes('Start chatting or describe a task...'))?.closest('[class*="border"], [class*="rounded"]');
      if (!promptRoot) return 'not found';
      const r = promptRoot.getBoundingClientRect();
      const cs = window.getComputedStyle(promptRoot);
      return {
        tag: promptRoot.tagName,
        className: promptRoot.className,
        rect: { x: Math.round(r.x), y: Math.round(r.y), w: Math.round(r.width), h: Math.round(r.height) },
        bg: cs.backgroundColor,
        borderRadius: cs.borderRadius,
        boxShadow: cs.boxShadow,
        backdropFilter: cs.backdropFilter,
        padding: cs.padding
      };
    })()
  `);

  console.log('Prompt Container:', JSON.stringify(res, null, 2));
}

main().catch(console.error);

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
    ws.on('message', data => {
      const msg = JSON.parse(data);
      if (msg.id === 2) {
        ws.close();
        resolve(msg.result?.result?.value);
      }
    });
    ws.on('error', reject);
  });
}

async function main() {
  const script = `(() => {
    const el = document.querySelector('textarea, [contenteditable="true"]')?.closest('[class*="overflow-hidden"], div[style*="106px"], [data-agent-input2-drop-target]');
    if (!el) return null;
    const cs = window.getComputedStyle(el);
    const textarea = el.querySelector('textarea, [contenteditable="true"]');
    const tcs = textarea ? window.getComputedStyle(textarea) : null;
    const buttons = Array.from(el.querySelectorAll('button')).map(b => ({
      label: b.getAttribute('aria-label') || b.innerText?.trim(),
      rect: { x: Math.round(b.getBoundingClientRect().x), y: Math.round(b.getBoundingClientRect().y), w: Math.round(b.getBoundingClientRect().width), h: Math.round(b.getBoundingClientRect().height) },
      cs: { bg: window.getComputedStyle(b).backgroundColor, color: window.getComputedStyle(b).color }
    }));
    return {
      container: {
        bg: cs.backgroundColor,
        border: cs.border,
        boxShadow: cs.boxShadow,
        backdropFilter: cs.backdropFilter,
        borderRadius: cs.borderRadius
      },
      input: textarea ? {
        tag: textarea.tagName,
        rect: { x: Math.round(textarea.getBoundingClientRect().x), y: Math.round(textarea.getBoundingClientRect().y), w: Math.round(textarea.getBoundingClientRect().width), h: Math.round(textarea.getBoundingClientRect().height) },
        color: tcs.color,
        fontSize: tcs.fontSize,
        fontFamily: tcs.fontFamily,
        placeholder: textarea.placeholder || textarea.getAttribute('aria-placeholder')
      } : null,
      buttons
    };
  })()`;

  console.log('--- LIVE PROMPT BOX DETAILS ---');
  console.log(JSON.stringify(await evalInTab('4D5803D83D1C78981FF3E408A2F4B2D5', script), null, 2));

  console.log('--- RECON PROMPT BOX DETAILS ---');
  console.log(JSON.stringify(await evalInTab('6D4B931B5EC0B7BE74E378FA2E19EDD9', script), null, 2));
}

main();

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
    // Find the chat container element that spans around x: 240 to 691
    let chatRoot = null;
    document.querySelectorAll('*').forEach(el => {
      const r = el.getBoundingClientRect();
      if (Math.abs(r.x - 240) < 5 && Math.abs(r.width - 451) < 20 && r.height > 600) {
        chatRoot = el;
      }
    });

    if (!chatRoot) {
      // Find from point
      chatRoot = document.elementFromPoint(350, 300);
      while (chatRoot && chatRoot.parentElement && chatRoot.getBoundingClientRect().width < 400) {
        chatRoot = chatRoot.parentElement;
      }
    }

    if (!chatRoot) return 'No chat root found';

    const r = chatRoot.getBoundingClientRect();
    const cs = window.getComputedStyle(chatRoot);

    // Extract text, headers, buttons, inputs
    const texts = Array.from(chatRoot.querySelectorAll('h1, h2, h3, h4, span, p, button, textarea, input')).map(el => {
      const er = el.getBoundingClientRect();
      return {
        tag: el.tagName,
        className: el.className.slice(0, 30),
        text: el.innerText ? el.innerText.trim() : (el.placeholder || ''),
        rect: { x: Math.round(er.x), y: Math.round(er.y), w: Math.round(er.width), h: Math.round(er.height) }
      };
    }).filter(t => t.text.length > 0);

    return {
      root: { tag: chatRoot.tagName, className: chatRoot.className, rect: r, bg: cs.backgroundColor },
      elements: texts
    };
  })()`;

  const info = await evalInTab(liveTarget, script);
  console.log('Live chat root:');
  console.log(info.root);
  console.log('\nLive chat elements:');
  console.table(info.elements);
}

main().catch(console.error);

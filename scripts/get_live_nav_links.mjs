import WebSocket from 'ws';

async function checkNavLinks() {
  const tabs = await fetch('http://127.0.0.1:9222/json').then(r => r.json());
  const tab = tabs.find(t => t.id === '4D5803D83D1C78981FF3E408A2F4B2D5');
  return new Promise((resolve) => {
    const ws = new WebSocket(tab.webSocketDebuggerUrl);
    ws.on('open', () => {
      ws.send(JSON.stringify({
        id: 1,
        method: 'Runtime.evaluate',
        params: {
          expression: `(() => {
            return Array.from(document.querySelectorAll('nav a, nav button')).map(el => ({
              tag: el.tagName,
              text: el.innerText.trim(),
              href: el.getAttribute('href'),
              ariaLabel: el.getAttribute('aria-label')
            }));
          })()`,
          returnByValue: true
        }
      }));
    });
    ws.on('message', data => {
      ws.close();
      resolve(JSON.parse(data).result?.result?.value);
    });
  });
}

checkNavLinks().then(r => console.log(JSON.stringify(r, null, 2))).catch(console.error);

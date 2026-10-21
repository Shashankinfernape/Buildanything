import WebSocket from 'ws';

async function main() {
  const tabs = await fetch('http://127.0.0.1:9222/json').then(r => r.json());
  const tab = tabs.find(t => t.id === '4D5803D83D1C78981FF3E408A2F4B2D5');
  const ws = new WebSocket(tab.webSocketDebuggerUrl);
  ws.on('open', () => {
    ws.send(JSON.stringify({
      id: 1,
      method: 'Runtime.evaluate',
      params: {
        expression: `(() => {
          function toObj(r) {
            return r ? { left: Math.round(r.left), top: Math.round(r.top), width: Math.round(r.width), height: Math.round(r.height) } : null;
          }
          const spinner = document.querySelector('[data-testid="agent-working-spinner"]');
          const title = Array.from(document.querySelectorAll('h1')).find(h => h.innerText.includes('New chat'));
          const nix = Array.from(document.querySelectorAll('*')).find(d => d.innerText && d.innerText.includes('Nix environment is broken') && d.children.length > 2);
          const composer = document.querySelector('.cm-editor') || document.querySelector('#agent-chat2-input');
          const footer = document.querySelector('button[aria-label="Send"]')?.parentElement?.parentElement?.parentElement;

          return {
            spinner: toObj(spinner?.getBoundingClientRect()),
            title: toObj(title?.getBoundingClientRect()),
            nix: toObj(nix?.getBoundingClientRect()),
            composer: toObj(composer?.getBoundingClientRect()),
            footer: toObj(footer?.getBoundingClientRect())
          };
        })()`,
        returnByValue: true
      }
    }));
  });
  ws.on('message', data => {
    const msg = JSON.parse(data);
    if (msg.id === 1) {
      console.log('LIVE exact coordinates at 1440x765:');
      console.log(JSON.stringify(msg.result?.result?.value, null, 2));
      process.exit(0);
    }
  });
}

main().catch(console.error);

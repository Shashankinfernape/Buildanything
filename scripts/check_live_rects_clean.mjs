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
          const showChat = document.querySelector('button[aria-label="Show chat"]');
          const agentPane = Array.from(document.querySelectorAll('*')).find(el => el.innerText && el.innerText.includes('New chat'));
          const nix = Array.from(document.querySelectorAll('*')).find(el => el.innerText && el.innerText.includes('Nix environment is broken'));
          return {
            showChat: toObj(showChat?.getBoundingClientRect()),
            agentPane: toObj(agentPane?.getBoundingClientRect()),
            nix: toObj(nix?.getBoundingClientRect())
          };
        })()`,
        returnByValue: true
      }
    }));
  });
  ws.on('message', data => {
    const msg = JSON.parse(data);
    if (msg.id === 1) {
      console.log('Result:', JSON.stringify(msg.result?.result?.value, null, 2));
      process.exit(0);
    }
  });
}

main().catch(console.error);

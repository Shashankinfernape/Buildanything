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
          const chips = Array.from(document.querySelectorAll('button')).filter(b => 
            b.textContent?.includes('Help me') || 
            b.textContent?.includes('Find emails') || 
            b.textContent?.includes('Turn my notes')
          );
          const header = Array.from(document.querySelectorAll('*')).find(el => el.textContent?.trim() === 'Suggested for you');
          return {
            headerRect: header ? header.getBoundingClientRect() : null,
            chips: chips.map(c => ({
              text: c.textContent?.trim(),
              rect: { x: Math.round(c.getBoundingClientRect().x), y: Math.round(c.getBoundingClientRect().y), w: Math.round(c.getBoundingClientRect().width), h: Math.round(c.getBoundingClientRect().height) },
              classes: c.className
            }))
          };
        })()`,
        returnByValue: true
      }
    }));
  });
  ws.on('message', data => {
    console.log(JSON.stringify(JSON.parse(data).result?.result?.value, null, 2));
    ws.close();
  });
}
main();

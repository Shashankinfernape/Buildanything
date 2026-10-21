import WebSocket from 'ws';

async function evalTab(targetId) {
  const tabs = await fetch('http://127.0.0.1:9222/json').then(r => r.json());
  const tab = tabs.find(t => t.id === targetId);
  return new Promise((resolve) => {
    const ws = new WebSocket(tab.webSocketDebuggerUrl);
    ws.on('open', () => {
      ws.send(JSON.stringify({
        id: 1,
        method: 'Runtime.evaluate',
        params: {
          expression: `(() => {
            const h1 = document.querySelector('main h1');
            const p = document.querySelector('main h1 + p') || document.querySelector('main p');
            const el = p || h1;
            const rect = el ? el.getBoundingClientRect() : null;
            const style = el ? getComputedStyle(el) : null;
            return {
              text: el ? el.innerText : null,
              html: el ? el.innerHTML : null,
              parentRect: el?.parentElement ? el.parentElement.getBoundingClientRect() : null,
              rect: rect ? { x: rect.x, y: rect.y, width: rect.width, height: rect.height } : null,
              fontFamily: style?.fontFamily,
              fontSize: style?.fontSize,
              fontWeight: style?.fontWeight,
              lineHeight: style?.lineHeight,
              letterSpacing: style?.letterSpacing,
              color: style?.color
            };
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

async function main() {
  const live = await evalTab('4D5803D83D1C78981FF3E408A2F4B2D5');
  const recon = await evalTab('6D4B931B5EC0B7BE74E378FA2E19EDD9');
  console.log('LIVE:', JSON.stringify(live, null, 2));
  console.log('RECON:', JSON.stringify(recon, null, 2));
}

main().catch(console.error);

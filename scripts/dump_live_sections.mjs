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

  const bottomHtml = await evalInTab(liveTarget, `
    (() => {
      const bottom = document.querySelector('main .flex-none');
      return bottom ? bottom.innerHTML : 'Not found';
    })()
  `);

  console.log('Bottom HTML length:', bottomHtml.length);
  // Also check top Recent projects HTML
  const topHtml = await evalInTab(liveTarget, `
    (() => {
      const top = document.querySelector('main .flex-\\\\[1_1_0\\\\]');
      return top ? top.innerHTML : 'Not found';
    })()
  `);
  console.log('Top HTML length:', topHtml.length);

  // Write these authentic snippets to inspection files so we can review them exactly
  import('fs').then(fs => {
    fs.writeFileSync('work/analysis/signed_in/authentic_top.html', topHtml);
    fs.writeFileSync('work/analysis/signed_in/authentic_bottom.html', bottomHtml);
    console.log('Wrote authentic_top.html and authentic_bottom.html');
  });
}

main().catch(console.error);

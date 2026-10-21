import WebSocket from 'ws';

async function main() {
  const tabs = await fetch('http://127.0.0.1:9222/json').then(r => r.json());
  const liveTab = tabs.find(t => t.url.includes('replit.com'));
  const reconTab = tabs.find(t => t.url.includes('5174'));

  async function inspectTab(tab, label) {
    const ws = new WebSocket(tab.webSocketDebuggerUrl);
    await new Promise(r => ws.on('open', r));
    const expr = `(() => {
      function getBgAt(x, y) {
        const el = document.elementFromPoint(x, y);
        let cur = el;
        while (cur && cur !== document.documentElement) {
          const bg = window.getComputedStyle(cur).backgroundColor;
          if (bg && bg !== 'rgba(0, 0, 0, 0)' && bg !== 'transparent') return { x, y, tag: cur.tagName, bg, cls: (cur.className || '').toString().slice(0, 30) };
          cur = cur.parentElement;
        }
        return { x, y, bg: window.getComputedStyle(document.body).backgroundColor };
      }
      return {
        bodyBg: window.getComputedStyle(document.body).backgroundColor,
        points: [
          getBgAt(100, 300),
          getBgAt(300, 300),
          getBgAt(500, 300),
          getBgAt(800, 300),
          getBgAt(1200, 300)
        ]
      };
    })()`;
    return new Promise(resolve => {
      ws.send(JSON.stringify({ id: 1, method: 'Runtime.evaluate', params: { expression: expr, returnByValue: true } }));
      ws.on('message', d => {
        ws.close();
        resolve({ label, res: JSON.parse(d).result?.result?.value });
      });
    });
  }

  const live = await inspectTab(liveTab, 'LIVE');
  const recon = await inspectTab(reconTab, 'RECON');
  console.log('LIVE:', JSON.stringify(live.res, null, 2));
  console.log('RECON:', JSON.stringify(recon.res, null, 2));
}

main().catch(console.error);

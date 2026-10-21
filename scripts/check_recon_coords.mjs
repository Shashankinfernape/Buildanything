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
    const toRect = el => {
      if (!el) return null;
      const r = el.getBoundingClientRect();
      return { x: Math.round(r.x), y: Math.round(r.y), w: Math.round(r.width), h: Math.round(r.height) };
    };
    const nav = document.querySelector('nav');
    const recentHeader = Array.from(document.querySelectorAll('h2')).find(h => h.textContent.includes('Recent'));
    const recentList = document.querySelector('ol');
    const greeting = document.querySelector('p[aria-hidden="true"], h1');
    const chip1 = Array.from(document.querySelectorAll('button')).find(b => b.textContent?.includes('Help me'));
    const chip2 = Array.from(document.querySelectorAll('button')).find(b => b.textContent?.includes('Find emails'));
    const chip3 = Array.from(document.querySelectorAll('button')).find(b => b.textContent?.includes('Turn my notes'));
    const promptContainer = document.querySelector('textarea, [contenteditable="true"]')?.closest('[class*="overflow-hidden"], div[style*="106px"], [data-agent-input2-drop-target]');

    return {
      nav: toRect(nav),
      recentHeader: toRect(recentHeader),
      recentList: toRect(recentList),
      greeting: toRect(greeting),
      chip1: toRect(chip1),
      chip2: toRect(chip2),
      chip3: toRect(chip3),
      promptContainer: toRect(promptContainer)
    };
  })()`;

  console.log('--- LIVE COORDS ---');
  console.log(JSON.stringify(await evalInTab('4D5803D83D1C78981FF3E408A2F4B2D5', script), null, 2));

  console.log('--- RECON COORDS ---');
  console.log(JSON.stringify(await evalInTab('6D4B931B5EC0B7BE74E378FA2E19EDD9', script), null, 2));
}

main();

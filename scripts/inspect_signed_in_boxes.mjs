import WebSocket from 'ws';

async function evalInTab(targetId, expression) {
  const tabs = await fetch('http://127.0.0.1:9222/json').then(r => r.json());
  const tab = tabs.find(t => t.id === targetId);
  if (!tab || !tab.webSocketDebuggerUrl) throw new Error('Tab not found: ' + targetId);

  return new Promise((resolve, reject) => {
    const ws = new WebSocket(tab.webSocketDebuggerUrl);
    ws.on('open', () => {
      // Bring tab to front first
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
  const reconTarget = '6D4B931B5EC0B7BE74E378FA2E19EDD9';

  console.log('--- LIVE TAB INSPECTION ---');
  const liveData = await evalInTab(liveTarget, `
    (() => {
      const nav = document.querySelector('nav');
      const recentHeader = Array.from(document.querySelectorAll('h2, [class*="heading"]')).find(h => h.textContent.includes('Recent projects'));
      const recentList = recentHeader ? (recentHeader.parentElement?.nextElementSibling || document.querySelector('ol')) : null;
      const greeting = document.querySelector('h1');
      const promptBox = document.querySelector('textarea, [contenteditable="true"]')?.closest('[class*="border"], form, div') || document.querySelector('form');
      const suggestions = Array.from(document.querySelectorAll('*')).find(el => el.textContent?.trim() === 'Suggested for you')?.parentElement?.parentElement;
      
      const getRect = (el) => {
        if (!el) return null;
        const r = el.getBoundingClientRect();
        return { x: Math.round(r.x), y: Math.round(r.y), width: Math.round(r.width), height: Math.round(r.height) };
      };

      return {
        viewport: { width: window.innerWidth, height: window.innerHeight },
        nav: getRect(nav),
        recentList: getRect(recentList),
        greeting: getRect(greeting),
        suggestions: getRect(suggestions),
        promptBox: getRect(promptBox)
      };
    })()
  `);
  console.log('Live Bounding Boxes:', JSON.stringify(liveData, null, 2));

  console.log('--- RECON TAB INSPECTION ---');
  const reconData = await evalInTab(reconTarget, `
    (() => {
      const nav = document.querySelector('nav');
      const recentHeader = Array.from(document.querySelectorAll('h2')).find(h => h.textContent.includes('Recent projects'));
      const recentList = recentHeader?.parentElement?.nextElementSibling || document.querySelector('ol');
      const greeting = document.querySelector('h1');
      const promptBox = document.querySelector('textarea')?.closest('[class*="min-h-[106px]"]');
      const suggestions = Array.from(document.querySelectorAll('*')).find(el => el.textContent?.trim() === 'Suggested for you')?.parentElement?.parentElement;

      const getRect = (el) => {
        if (!el) return null;
        const r = el.getBoundingClientRect();
        return { x: Math.round(r.x), y: Math.round(r.y), width: Math.round(r.width), height: Math.round(r.height) };
      };

      return {
        viewport: { width: window.innerWidth, height: window.innerHeight },
        nav: getRect(nav),
        recentList: getRect(recentList),
        greeting: getRect(greeting),
        suggestions: getRect(suggestions),
        promptBox: getRect(promptBox)
      };
    })()
  `);
  console.log('Recon Bounding Boxes:', JSON.stringify(reconData, null, 2));
}

main().catch(console.error);

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

  const styles = await evalInTab(liveTarget, `
    (() => {
      const getStyles = (el, props) => {
        if (!el) return null;
        const cs = window.getComputedStyle(el);
        const r = el.getBoundingClientRect();
        const res = {
          rect: { x: Math.round(r.x), y: Math.round(r.y), w: Math.round(r.width), h: Math.round(r.height) }
        };
        for (const p of props) res[p] = cs.getPropertyValue(p);
        return res;
      };

      const nav = document.querySelector('nav');
      const wsBtn = nav?.querySelector('button[aria-haspopup="dialog"], button');
      const newBtn = Array.from(nav?.querySelectorAll('a, button') || []).find(el => el.textContent?.trim() === 'New');
      const importRow = Array.from(nav?.querySelectorAll('a, button') || []).find(el => el.textContent?.trim() === 'Import');
      const recentHeader = Array.from(nav?.querySelectorAll('*') || []).find(el => el.textContent?.trim() === 'Recent');
      const recentProjectRow = nav?.querySelector('a[href*="/@"], button[data-cy*="recent"]');
      const newTaskBtn = Array.from(nav?.querySelectorAll('a, button') || []).find(el => el.textContent?.trim() === 'New task');
      const upgradeCard = Array.from(nav?.querySelectorAll('*') || []).find(el => el.textContent?.includes('Upgrade your plan'))?.closest('[class*="border"], div');
      const learnMoreBtn = Array.from(nav?.querySelectorAll('a, button') || []).find(el => el.textContent?.trim() === 'Learn more');
      const userRow = Array.from(nav?.querySelectorAll('*') || []).find(el => el.textContent?.includes('Shashank'))?.closest('div[class*="flex"]');

      const props = [
        'background-color', 'color', 'font-family', 'font-size', 'font-weight', 'line-height',
        'border-top', 'border-right', 'border-bottom', 'border-left', 'border-radius',
        'padding-top', 'padding-right', 'padding-bottom', 'padding-left',
        'margin-top', 'margin-right', 'margin-bottom', 'margin-left',
        'gap', 'box-shadow', 'backdrop-filter'
      ];

      // Main elements
      const main = document.querySelector('main');
      const recentCard = document.querySelector('ol > li, ol > div, [class*="recent"] li');
      const greeting = document.querySelector('h1');
      const chip = Array.from(document.querySelectorAll('button')).find(b => b.textContent?.includes('Help me get things done'));
      const promptBox = document.querySelector('textarea, [contenteditable="true"]')?.closest('[class*="border"], div');

      return {
        nav: getStyles(nav, props),
        wsBtn: getStyles(wsBtn, props),
        newBtn: getStyles(newBtn, props),
        importRow: getStyles(importRow, props),
        recentHeader: getStyles(recentHeader, props),
        recentProjectRow: getStyles(recentProjectRow, props),
        newTaskBtn: getStyles(newTaskBtn, props),
        upgradeCard: getStyles(upgradeCard, props),
        learnMoreBtn: getStyles(learnMoreBtn, props),
        userRow: getStyles(userRow, props),
        main: getStyles(main, props),
        recentCard: getStyles(recentCard, props),
        greeting: getStyles(greeting, props),
        chip: getStyles(chip, props),
        promptBox: getStyles(promptBox, props)
      };
    })()
  `);

  console.log(JSON.stringify(styles, null, 2));
}

main().catch(console.error);

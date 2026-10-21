import WebSocket from 'ws';

const TARGET_ID = '4D5803D83D1C78981FF3E408A2F4B2D5';

async function main() {
  const ws = new WebSocket(`ws://127.0.0.1:9222/devtools/page/${TARGET_ID}`);
  await new Promise(r => ws.onopen = r);
  let cid = 1;
  const send = (m, p = {}) => new Promise(res => {
    const id = cid++;
    const handler = d => {
      const j = JSON.parse(d);
      if (j.id === id) {
        ws.removeListener('message', handler);
        res(j.result);
      }
    };
    ws.on('message', handler);
    ws.send(JSON.stringify({ id, method: m, params: p }));
  });

  const liveInfo = await send('Runtime.evaluate', {
    expression: `(() => {
      const nav = document.querySelector('nav');
      const main = document.querySelector('main');
      const body = document.body;
      const html = document.documentElement;
      const navRect = nav ? nav.getBoundingClientRect() : null;
      const mainRect = main ? main.getBoundingClientRect() : null;
      const navStyle = nav ? window.getComputedStyle(nav) : null;
      const bodyStyle = window.getComputedStyle(body);
      const htmlStyle = window.getComputedStyle(html);

      // Prompt textarea / agent input on live dashboard
      const promptTa = document.querySelector('textarea, [contenteditable="true"]');
      const promptRect = promptTa ? promptTa.getBoundingClientRect() : null;

      // Recent items
      const recentHeading = Array.from(document.querySelectorAll('h2, h3, h4, span, div')).find(el => el.textContent?.trim() === 'Recent' || el.textContent?.trim() === 'Recents');
      const recentRect = recentHeading ? recentHeading.getBoundingClientRect() : null;

      return {
        themeClass: html.className,
        colorScheme: htmlStyle.colorScheme,
        bodyBg: bodyStyle.backgroundColor,
        bodyColor: bodyStyle.color,
        navBg: navStyle ? navStyle.backgroundColor : null,
        navRect: navRect ? { x: navRect.x, y: navRect.y, w: navRect.width, h: navRect.height } : null,
        mainRect: mainRect ? { x: mainRect.x, y: mainRect.y, w: mainRect.width, h: mainRect.height } : null,
        promptRect: promptRect ? { x: promptRect.x, y: promptRect.y, w: promptRect.width, h: promptRect.height } : null,
        recentRect: recentRect ? { x: recentRect.x, y: recentRect.y, w: recentRect.width, h: recentRect.height } : null,
      };
    })()`,
    returnByValue: true
  });

  console.log('Live DOM inspection:', JSON.stringify(liveInfo.result?.value, null, 2));
  ws.close();
}

main().catch(console.error);

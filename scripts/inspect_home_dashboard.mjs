import WebSocket from 'ws';

const TARGET_ID = '4D5803D83D1C78981FF3E408A2F4B2D5';

async function main() {
  const ws = new WebSocket(`ws://127.0.0.1:9222/devtools/page/${TARGET_ID}`);
  await new Promise(r => ws.onopen = r);
  let cid = 1;
  const send = (m, p={}) => new Promise(res => {
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

  const res = await send('Runtime.evaluate', {
    expression: `(() => {
      // Find main structural layout elements
      const body = document.body;
      const nav = document.querySelector('nav');
      const header = document.querySelector('header');
      const main = document.querySelector('main') || document.querySelector('[role="main"]');
      const sidebar = document.querySelector('aside') || document.querySelector('[data-testid="sidebar"]') || document.querySelector('nav');
      
      // Look at top-level children of __next or body
      const root = document.querySelector('#__next') || body;
      const topChildren = Array.from(root.children).map(c => ({
        tag: c.tagName,
        id: c.id,
        cls: c.className.slice(0, 100),
        rect: c.getBoundingClientRect()
      }));

      // Find any sidebar links/items
      const sidebarLinks = Array.from(document.querySelectorAll('a, button'))
        .filter(el => {
          const r = el.getBoundingClientRect();
          return r.left < 260 && r.width > 20 && r.height > 20;
        })
        .map(el => ({
          text: el.innerText.trim().split('\\n')[0],
          href: el.getAttribute('href') || null,
          role: el.getAttribute('role') || el.tagName
        }))
        .filter(x => x.text.length > 0 && x.text.length < 40)
        .slice(0, 25);

      // Main content headings and cards
      const headings = Array.from(document.querySelectorAll('h1, h2, h3, h4')).map(h => ({
        tag: h.tagName,
        text: h.innerText.trim(),
        rect: h.getBoundingClientRect()
      }));

      return {
        title: document.title,
        topChildren,
        sidebarLinks,
        headings,
        theme: document.documentElement.getAttribute('data-theme') || document.documentElement.className,
        viewport: { w: window.innerWidth, h: window.innerHeight }
      };
    })()`,
    returnByValue: true
  });

  console.log(JSON.stringify(res.result.value, null, 2));
  ws.close();
}

main().catch(console.error);

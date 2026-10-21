import WebSocket from 'ws';

async function checkBoth() {
  async function getMetrics(targetId) {
    const ws = new WebSocket(`ws://127.0.0.1:9222/devtools/page/${targetId}`);
    await new Promise(r => ws.onopen = r);
    let id = 1;
    const send = (method, params = {}) => new Promise((resolve) => {
      const curId = id++;
      const handler = (evt) => {
        const data = JSON.parse(evt.data);
        if (data.id === curId) {
          ws.removeEventListener('message', handler);
          resolve(data.result);
        }
      };
      ws.addEventListener('message', handler);
      ws.send(JSON.stringify({ id: curId, method, params }));
    });

    if (targetId === 'A7DF9577D21FF635BD6EF295E92FAEC1') {
      await send('Page.reload');
      await new Promise(r => setTimeout(r, 1200));
    }

    const res = await send('Runtime.evaluate', {
      expression: `(() => {
        const next = document.getElementById('__next') || document.querySelector('.min-h-screen');
        // Find the platform section by heading
        const h2 = Array.from(document.querySelectorAll('h2')).find(h => h.innerText.includes('Powered by the Replit platform'));
        const section = h2?.closest('.flex.box-border.min-h-0.min-w-0.border-0.border-solid.view-outline-none.flex-col.justify-logical-start.items-stretch.shrink-0.w-full');
        if (!section) return { found: false };
        const rect = section.getBoundingClientRect();
        const cardsGrid = section.querySelector('.grid');
        const cards = Array.from(cardsGrid?.children || []).map((c, i) => ({
          i,
          bg: getComputedStyle(c).backgroundColor,
          rect: {
            x: Math.round(c.getBoundingClientRect().x),
            y: Math.round(c.getBoundingClientRect().y + window.scrollY),
            w: Math.round(c.getBoundingClientRect().width),
            h: Math.round(c.getBoundingClientRect().height)
          }
        }));
        return {
          found: true,
          rect: {
            x: Math.round(rect.x),
            y: Math.round(rect.y + window.scrollY),
            w: Math.round(rect.width),
            h: Math.round(rect.height)
          },
          headingRect: {
            x: Math.round(h2.getBoundingClientRect().x),
            y: Math.round(h2.getBoundingClientRect().y + window.scrollY),
            w: Math.round(h2.getBoundingClientRect().width),
            h: Math.round(h2.getBoundingClientRect().height)
          },
          cards
        };
      })()`,
      returnByValue: true
    });

    ws.close();
    console.log('raw res:', JSON.stringify(res, null, 2));
    return res.result?.result?.value || res.result?.value;
  }

  const live = await getMetrics('0CEBF5F820FA8AA89465BD16147DDED9');
  const recon = await getMetrics('A7DF9577D21FF635BD6EF295E92FAEC1');

  console.log('LIVE Platform:');
  console.log(JSON.stringify(live, null, 2));
  console.log('RECON Platform:');
  console.log(JSON.stringify(recon, null, 2));
}

checkBoth().catch(console.error);

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

    // Reload page if recon to get latest build
    if (targetId === 'A7DF9577D21FF635BD6EF295E92FAEC1') {
      await send('Page.reload');
      await new Promise(r => setTimeout(r, 1200));
    }

    const res = await send('Runtime.evaluate', {
      expression: `(() => {
        const tplSection = document.querySelector('[data-analytics-id="template_filter_chip_list"]')?.closest('.flex.box-border.min-h-0.min-w-0.border-0.border-solid.view-outline-none.flex-col.justify-logical-start.items-stretch.shrink-0.w-full.px-0');
        if (!tplSection) return { found: false };
        const rect = tplSection.getBoundingClientRect();
        const chips = Array.from(document.querySelectorAll('[data-analytics-id="template_filter_chip"]')).map(c => ({
          text: c.innerText.trim(),
          w: Math.round(c.getBoundingClientRect().width),
          h: Math.round(c.getBoundingClientRect().height)
        }));
        const cards = Array.from(document.querySelectorAll('[data-analytics-id="template_card"]')).map(c => ({
          label: c.getAttribute('aria-label'),
          rect: {
            x: Math.round(c.getBoundingClientRect().x),
            y: Math.round(c.getBoundingClientRect().y + window.scrollY),
            w: Math.round(c.getBoundingClientRect().width),
            h: Math.round(c.getBoundingClientRect().height)
          }
        }));
        const browse = document.querySelector('[data-analytics-id="template_browse_all_link"]');
        return {
          found: true,
          rect: {
            x: Math.round(rect.x),
            y: Math.round(rect.y + window.scrollY),
            w: Math.round(rect.width),
            h: Math.round(rect.height)
          },
          chips,
          cardsCount: cards.length,
          firstCardRect: cards[0]?.rect,
          browseRect: browse ? {
            x: Math.round(browse.getBoundingClientRect().x),
            y: Math.round(browse.getBoundingClientRect().y + window.scrollY),
            w: Math.round(browse.getBoundingClientRect().width),
            h: Math.round(browse.getBoundingClientRect().height)
          } : null
        };
      })()`,
      returnByValue: true
    });

    ws.close();
    return res.result?.value;
  }

  const live = await getMetrics('0CEBF5F820FA8AA89465BD16147DDED9');
  const recon = await getMetrics('A7DF9577D21FF635BD6EF295E92FAEC1');

  console.log('LIVE:');
  console.log(JSON.stringify(live, null, 2));
  console.log('RECON:');
  console.log(JSON.stringify(recon, null, 2));
}

checkBoth().catch(console.error);

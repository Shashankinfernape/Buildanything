import WebSocket from 'ws';
import fs from 'fs';

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
      const nav = document.querySelector('nav');
      if (!nav) return 'No nav';

      function sanitize(str) {
        if (!str) return '';
        return str
          .replace(/Shashank/gi, 'Alex')
          .replace(/infernapeshasha/gi, 'alexbuilder')
          .replace(/VisionMart/gi, 'CommerceApp')
          .replace(/PetCareConnect/gi, 'ServiceHub')
          .replace(/WaitlistWizard/gi, 'WaitlistApp')
          .replace(/DeficientPlumpMisrac/gi, 'DemoProject');
      }

      const items = Array.from(nav.querySelectorAll('a, button')).map(el => {
        const svg = el.querySelector('svg');
        const b = el.getBoundingClientRect();
        return {
          tag: el.tagName,
          text: sanitize(el.innerText?.trim().split('\\n')[0] || ''),
          ariaLabel: el.getAttribute('aria-label') || '',
          cls: el.className,
          rect: { x: Math.round(b.x), y: Math.round(b.y), w: Math.round(b.width), h: Math.round(b.height) },
          svg: svg ? {
            viewBox: svg.getAttribute('viewBox'),
            d: svg.querySelector('path')?.getAttribute('d')?.slice(0, 80),
            cls: svg.className?.toString()
          } : null
        };
      }).filter(x => x.text || x.ariaLabel);

      return {
        navCls: nav.className,
        navBox: { w: nav.offsetWidth, h: nav.offsetHeight },
        items
      };
    })()`,
    returnByValue: true
  });

  fs.writeFileSync('work/analysis/signed_in/sidebar_items.json', JSON.stringify(res.result.value, null, 2), 'utf8');
  console.log('Sidebar items saved:', res.result.value.items?.length);
  for (const item of res.result.value.items || []) {
    console.log(`[${item.tag}] "${item.text || item.ariaLabel}" (${item.rect.w}x${item.rect.h}) svg: ${item.svg ? 'yes' : 'no'}`);
  }
  ws.close();
}

main().catch(console.error);

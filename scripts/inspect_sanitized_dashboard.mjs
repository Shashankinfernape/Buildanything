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
      const main = document.querySelector('main');

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

      function getTree(el, maxDepth = 3) {
        if (!el || maxDepth < 0) return null;
        const b = el.getBoundingClientRect();
        return {
          tag: el.tagName,
          cls: el.className,
          w: Math.round(b.width),
          h: Math.round(b.height),
          ariaLabel: el.getAttribute('aria-label') || undefined,
          role: el.getAttribute('role') || undefined,
          text: el.children.length === 0 ? sanitize(el.textContent.trim().slice(0, 50)) : undefined,
          children: Array.from(el.children).map(c => getTree(c, maxDepth - 1)).filter(Boolean)
        };
      }

      return {
        navTree: getTree(nav, 3),
        mainSections: Array.from(main ? main.children : []).map(c => ({
          tag: c.tagName,
          cls: c.className,
          rect: {
            x: Math.round(c.getBoundingClientRect().x),
            y: Math.round(c.getBoundingClientRect().y),
            w: Math.round(c.getBoundingClientRect().width),
            h: Math.round(c.getBoundingClientRect().height)
          },
          headings: Array.from(c.querySelectorAll('h1, h2, h3')).map(h => sanitize(h.textContent.trim())),
          buttons: Array.from(c.querySelectorAll('button')).map(b => sanitize(b.textContent.trim())).filter(x => x && x.length < 30)
        }))
      };
    })()`,
    returnByValue: true
  });

  fs.writeFileSync('work/analysis/signed_in/sanitized_dashboard_tree.json', JSON.stringify(res.result.value, null, 2), 'utf8');
  console.log('Sanitized dashboard tree saved.');
  console.log('Main sections count:', res.result.value.mainSections.length);
  for (const s of res.result.value.mainSections) {
    console.log(`- ${s.tag} (${s.rect.w}x${s.rect.h}), headings: ${s.headings.join(' | ')}, buttons: ${s.buttons.slice(0, 5).join(', ')}`);
  }
  ws.close();
}

main().catch(console.error);

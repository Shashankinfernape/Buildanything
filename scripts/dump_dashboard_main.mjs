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
      const main = document.querySelector('main');
      const inner = main?.children[2]?.children[1];
      if (!inner) return null;

      function sanitize(s) {
        return (s || '')
          .replace(/Shashank/gi, 'Alex')
          .replace(/infernapeshasha/gi, 'alexbuilder')
          .replace(/VisionMart/gi, 'CommerceApp')
          .replace(/PetCareConnect/gi, 'ServiceHub')
          .replace(/WaitlistWizard/gi, 'WaitlistApp')
          .replace(/DeficientPlumpMisrac/gi, 'DemoProject');
      }

      function dump(el, depth = 0) {
        if (!el || depth > 2) return null;
        const b = el.getBoundingClientRect();
        return {
          tag: el.tagName,
          cls: el.className,
          w: Math.round(b.width),
          h: Math.round(b.height),
          text: sanitize(el.innerText?.slice(0, 100)),
          children: Array.from(el.children).map(c => dump(c, depth + 1))
        };
      }

      return dump(inner, 0);
    })()`,
    returnByValue: true
  });

  fs.writeFileSync('work/analysis/signed_in/dashboard_main_dump.json', JSON.stringify(res.result.value, null, 2), 'utf8');
  console.log('Saved dashboard main dump.');
  console.log('Top level child tags:', res.result.value.children?.map(c => `${c.tag} (${c.w}x${c.h}): ${c.text?.slice(0, 60)}`));
  ws.close();
}

main().catch(console.error);

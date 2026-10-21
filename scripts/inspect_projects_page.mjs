import WebSocket from 'ws';
import fs from 'fs';

const TARGET_ID = '64E08E72E212BB1623ECA0BB68CE3F48';

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

      const main = document.querySelector('main');
      const h1 = document.querySelector('h1');
      const tabs = Array.from(document.querySelectorAll('[role=\"tab\"], button')).map(t => ({
        text: sanitize(t.textContent.trim().split('\\n')[0]),
        selected: t.getAttribute('aria-selected') || t.getAttribute('data-selected')
      })).filter(x => x.text && x.text.length < 30).slice(0, 15);

      const rows = Array.from(document.querySelectorAll('a[href*=\"/@\"]')).map(a => {
        const b = a.getBoundingClientRect();
        return {
          title: sanitize(a.querySelector('span, h3, p')?.textContent.trim() || a.textContent.trim().split('\\n')[0]),
          rect: { w: Math.round(b.width), h: Math.round(b.height) },
          text: sanitize(a.textContent.trim().replace(/\\s+/g, ' '))
        };
      }).filter(x => x.rect.w > 200);

      return {
        h1: h1 ? sanitize(h1.textContent.trim()) : null,
        tabs,
        rows
      };
    })()`,
    returnByValue: true
  });

  fs.writeFileSync('work/analysis/signed_in/projects_page_data.json', JSON.stringify(res.result.value, null, 2), 'utf8');
  console.log('Projects page data:', JSON.stringify(res.result.value, null, 2));
  ws.close();
}

main().catch(console.error);

import WebSocket from 'ws';
import fs from 'fs';

const TARGET_ID = '9F75EB9D0E753E0F1F70C91FAB0C771F';

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
          .replace(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}/gi, 'alex@example.com');
      }

      // Settings tabs in dialog or page
      const tabs = Array.from(document.querySelectorAll('[role=\"tab\"], a[href*=\"tab=\"]')).map(t => ({
        text: sanitize(t.textContent.trim()),
        href: t.getAttribute('href'),
        selected: t.getAttribute('aria-selected')
      }));

      // Headings and labels in settings
      const headings = Array.from(document.querySelectorAll('h1, h2, h3, h4, label')).map(h => ({
        tag: h.tagName,
        text: sanitize(h.textContent.trim())
      })).filter(x => x.text && x.text.length < 50);

      return {
        tabs,
        headings: headings.slice(0, 20)
      };
    })()`,
    returnByValue: true
  });

  fs.writeFileSync('work/analysis/signed_in/settings_page_data.json', JSON.stringify(res.result.value, null, 2), 'utf8');
  console.log('Settings tabs:', res.result.value.tabs?.map(t => t.text));
  console.log('Settings headings/labels:', res.result.value.headings?.map(h => h.text).slice(0, 10));
  ws.close();
}

main().catch(console.error);

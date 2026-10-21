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

      // 1. Recent Projects cards
      const recentHeader = Array.from(document.querySelectorAll('h2')).find(h => h.textContent.includes('Recent'));
      const recentContainer = recentHeader ? recentHeader.closest('.flex') || recentHeader.parentElement.parentElement : null;
      
      const projectCards = Array.from(document.querySelectorAll('a[href*="/@"]')).map(a => {
        const b = a.getBoundingClientRect();
        return {
          title: sanitize(a.querySelector('span, div')?.textContent.trim() || a.textContent.trim().split('\\n')[0]),
          href: a.getAttribute('href'),
          rect: { w: Math.round(b.width), h: Math.round(b.height) },
          text: sanitize(a.textContent.trim().replace(/\\s+/g, ' '))
        };
      }).filter(x => x.rect.w > 100);

      // 2. Prompt input box
      const ta = document.querySelector('textarea');
      const taBox = ta ? ta.getBoundingClientRect() : null;
      const promptRoot = ta ? ta.closest('[class*="border"]') : null;

      // 3. Suggested for you
      const suggestedHeader = Array.from(document.querySelectorAll('h2')).find(h => h.textContent.includes('Suggested'));
      const suggestedContainer = suggestedHeader ? suggestedHeader.parentElement : null;
      const suggestedCards = suggestedContainer ? Array.from(suggestedContainer.querySelectorAll('button, a')).map(el => ({
        text: sanitize(el.textContent.trim().replace(/\\s+/g, ' ')),
        rect: { w: Math.round(el.getBoundingClientRect().width), h: Math.round(el.getBoundingClientRect().height) }
      })).filter(x => x.rect.w > 80 && x.text.length < 100) : [];

      return {
        projectCards,
        textarea: ta ? {
          placeholder: ta.getAttribute('placeholder'),
          w: Math.round(taBox.width),
          h: Math.round(taBox.height)
        } : null,
        promptRootCls: promptRoot ? promptRoot.className : null,
        suggestedCards
      };
    })()`,
    returnByValue: true
  });

  fs.writeFileSync('work/analysis/signed_in/main_content_items.json', JSON.stringify(res.result.value, null, 2), 'utf8');
  console.log('Main content items saved:');
  console.log('Project cards:', res.result.value.projectCards?.length);
  console.log('Textarea:', res.result.value.textarea);
  console.log('Suggested cards:', res.result.value.suggestedCards?.length);
  ws.close();
}

main().catch(console.error);

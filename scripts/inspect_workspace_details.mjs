import WebSocket from 'ws';
import fs from 'fs';

const TARGET_ID = '32D66469546778B874EB0E14C1442401';

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

      // Find file tree items
      const fileTreeItems = Array.from(document.querySelectorAll('[role=\"treeitem\"], [data-testid*=\"file\"], [class*=\"tree\"]')).map(el => ({
        text: sanitize(el.textContent.trim()),
        ariaLabel: el.getAttribute('aria-label')
      })).filter(x => x.text && x.text.length < 50);

      // Find editor tabs
      const tabs = Array.from(document.querySelectorAll('[role=\"tab\"]')).map(t => ({
        text: sanitize(t.textContent.trim()),
        selected: t.getAttribute('aria-selected')
      }));

      // Find workspace tool icons / buttons (Files, Agent, Tools, Secrets, Settings, Deploy)
      const toolButtons = Array.from(document.querySelectorAll('button[aria-label], button[title], [data-testid*=\"pane\"], [data-testid*=\"tool\"]')).map(b => ({
        label: b.getAttribute('aria-label') || b.getAttribute('title') || b.textContent.trim(),
        rect: { w: Math.round(b.getBoundingClientRect().width), h: Math.round(b.getBoundingClientRect().height) }
      })).filter(x => x.label && x.label.length < 40);

      // Main pane layout boxes
      const paneLayout = Array.from(document.querySelectorAll('[data-mosaic-id], [class*=\"pane\"], [class*=\"layout\"]')).map(el => {
        const b = el.getBoundingClientRect();
        return {
          tag: el.tagName,
          rect: { x: Math.round(b.x), y: Math.round(b.y), w: Math.round(b.width), h: Math.round(b.height) }
        };
      }).filter(x => x.rect.w > 100 && x.rect.h > 100).slice(0, 10);

      return {
        fileTreeItems: fileTreeItems.slice(0, 20),
        tabs,
        toolButtons: toolButtons.slice(0, 30),
        paneLayout
      };
    })()`,
    returnByValue: true
  });

  fs.writeFileSync('work/analysis/signed_in/workspace_data.json', JSON.stringify(res.result.value, null, 2), 'utf8');
  console.log('Workspace data saved:');
  console.log('File tree items:', res.result.value.fileTreeItems?.length);
  console.log('Tabs:', res.result.value.tabs);
  console.log('Tool buttons:', res.result.value.toolButtons?.map(b => b.label).slice(0, 15));
  ws.close();
}

main().catch(console.error);

import fs from 'fs';
import path from 'path';

const TARGET_ID = 'CB678B8B384E39FEEBDCC619BA51F684';
const WS_URL = `ws://127.0.0.1:9222/devtools/page/${TARGET_ID}`;

async function main() {
  const ws = new WebSocket(WS_URL);

  let idCounter = 1;
  const pending = new Map();

  function sendCommand(method, params = {}) {
    return new Promise((resolve, reject) => {
      const id = idCounter++;
      pending.set(id, { resolve, reject });
      ws.send(JSON.stringify({ id, method, params }));
    });
  }

  ws.onmessage = (event) => {
    const data = JSON.parse(event.data);
    if (data.id && pending.has(data.id)) {
      const { resolve, reject } = pending.get(data.id);
      pending.delete(data.id);
      if (data.error) reject(data.error);
      else resolve(data.result);
    }
  };

  await new Promise((resolve) => {
    ws.onopen = resolve;
  });

  console.log('Connected to CDP target:', TARGET_ID);

  // 1. Inspect theme and documentElement attributes
  const evalTheme = await sendCommand('Runtime.evaluate', {
    expression: `(() => {
      const html = document.documentElement;
      const body = document.body;
      const compHtml = window.getComputedStyle(html);
      const compBody = window.getComputedStyle(body);
      return {
        htmlClasses: html.className,
        htmlAttributes: Array.from(html.attributes).map(a => ({ name: a.name, value: a.value })),
        bodyClasses: body.className,
        bodyAttributes: Array.from(body.attributes).map(a => ({ name: a.name, value: a.value })),
        viewport: {
          innerWidth: window.innerWidth,
          innerHeight: window.innerHeight,
          devicePixelRatio: window.devicePixelRatio
        },
        prefersDark: window.matchMedia('(prefers-color-scheme: dark)').matches,
        computed: {
          htmlBackground: compHtml.backgroundColor,
          htmlColor: compHtml.color,
          bodyBackground: compBody.backgroundColor,
          bodyColor: compBody.color
        }
      };
    })()`,
    returnByValue: true
  });

  const themeInfo = evalTheme.result.value;
  console.log('Theme & Baseline Info:\n', JSON.stringify(themeInfo, null, 2));

  // 2. Fetch full outerHTML snapshot
  const evalOuterHTML = await sendCommand('Runtime.evaluate', {
    expression: 'document.documentElement.outerHTML',
    returnByValue: true
  });

  const outerHTML = evalOuterHTML.result.value;
  const snapshotPath = path.resolve('work/target_artifacts/replit/live-rendered-snapshot.html');
  fs.writeFileSync(snapshotPath, outerHTML, 'utf8');
  console.log(`\nSaved live rendered-HTML snapshot: ${snapshotPath} (${outerHTML.length} characters)`);

  ws.close();
}

main().catch(console.error);

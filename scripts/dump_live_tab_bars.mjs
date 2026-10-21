import WebSocket from 'ws';
import fs from 'fs';

async function evalInTab(targetId, expression) {
  const tabs = await fetch('http://127.0.0.1:9222/json').then(r => r.json());
  const tab = tabs.find(t => t.id === targetId);
  return new Promise((resolve, reject) => {
    const ws = new WebSocket(tab.webSocketDebuggerUrl);
    ws.on('open', () => {
      ws.send(JSON.stringify({
        id: 1,
        method: 'Runtime.evaluate',
        params: { expression, returnByValue: true }
      }));
    });
    ws.on('message', data => {
      try {
        const msg = JSON.parse(data);
        if (msg.id === 1) {
          ws.close();
          resolve(msg.result?.result?.value);
        }
      } catch (e) {}
    });
    ws.on('error', reject);
  });
}

async function main() {
  const liveTarget = '4D5803D83D1C78981FF3E408A2F4B2D5';
  const script = `(() => {
    const tabs = Array.from(document.querySelectorAll('div[data-tab-bar="true"]')).map(d => {
      let p = d;
      while (p && p.parentElement && p.parentElement.tagName !== 'MAIN') {
        p = p.parentElement;
      }
      return { html: p.outerHTML, style: p.getAttribute('style') };
    });
    return tabs;
  })()`;

  const res = await evalInTab(liveTarget, script);
  console.log('Found tab bars:', res?.length);
  if (res && res.length) {
    fs.writeFileSync('work/analysis/signed_in/live_tab_bars.json', JSON.stringify(res, null, 2));
    console.log('Saved live_tab_bars.json');
  }
}

main().catch(console.error);

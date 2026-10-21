import WebSocket from 'ws';

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

  console.log('Navigating live to workspace repl...');
  const cdp = await fetch('http://127.0.0.1:9222/json').then(r => r.json());
  const tab = cdp.find(t => t.id === liveTarget);
  const ws = new WebSocket(tab.webSocketDebuggerUrl);

  await new Promise(resolve => {
    ws.on('open', () => {
      ws.send(JSON.stringify({
        id: 10,
        method: 'Page.navigate',
        params: { url: 'https://replit.com/@infernapeshasha/DeficientPlumpMisrac' }
      }));
    });
    ws.on('message', d => {
      const msg = JSON.parse(d);
      if (msg.id === 10) {
        ws.close();
        resolve();
      }
    });
  });

  console.log('Waiting 6s for workspace to load...');
  await new Promise(r => setTimeout(r, 6000));

  const script = `(() => {
    const header = document.querySelector('header');
    const hr = header ? header.getBoundingClientRect() : null;
    const hcs = header ? window.getComputedStyle(header) : null;

    const main = document.querySelector('main');
    const mr = main ? main.getBoundingClientRect() : null;

    // Split panels
    const panes = Array.from(document.querySelectorAll('[data-tab-bar="true"], [role="tablist"], [role="tabpanel"]')).map(el => {
      const r = el.getBoundingClientRect();
      return {
        tag: el.tagName,
        role: el.getAttribute('role'),
        ariaLabel: el.getAttribute('aria-label'),
        text: el.innerText.slice(0, 30),
        rect: { x: r.x, y: r.y, w: r.width, h: r.height }
      };
    });

    return {
      header: hr ? { x: hr.x, y: hr.y, w: hr.width, h: hr.height, bg: hcs.backgroundColor } : null,
      main: mr ? { x: mr.x, y: mr.y, w: mr.width, h: mr.height } : null,
      panes: panes.slice(0, 10)
    };
  })()`;

  const info = await evalInTab(liveTarget, script);
  console.log('Live workspace layout:');
  console.dir(info, { depth: null });
}

main().catch(console.error);

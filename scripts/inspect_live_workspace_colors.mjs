import WebSocket from 'ws';

async function evalInTab(targetId, expr) {
  const tabs = await fetch('http://127.0.0.1:9222/json').then(r => r.json());
  const tab = tabs.find(t => t.id === targetId);
  const ws = new WebSocket(tab.webSocketDebuggerUrl);
  await new Promise(r => ws.on('open', r));

  return new Promise((resolve, reject) => {
    ws.send(JSON.stringify({ id: 1, method: 'Runtime.evaluate', params: { expression: expr, returnByValue: true } }));
    ws.on('message', d => {
      const m = JSON.parse(d);
      if (m.id === 1) {
        ws.close();
        resolve(m.result.result.value);
      }
    });
    ws.on('error', reject);
  });
}

async function main() {
  const liveTarget = '4D5803D83D1C78981FF3E408A2F4B2D5';

  const expr = `(() => {
    const rootStyle = window.getComputedStyle(document.documentElement);
    const bodyStyle = window.getComputedStyle(document.body);

    // Sample background colors at key workspace coordinates
    // (100, 300) -> Sidebar
    // (400, 300) -> Agent chat pane
    // (800, 300) -> Tools pane
    // (1200, 300) -> Console pane
    function getBgAt(x, y) {
      const el = document.elementFromPoint(x, y);
      let cur = el;
      while (cur && cur !== document.documentElement) {
        const bg = window.getComputedStyle(cur).backgroundColor;
        if (bg && bg !== 'rgba(0, 0, 0, 0)' && bg !== 'transparent') return { x, y, tag: cur.tagName, class: cur.className, bg };
        cur = cur.parentElement;
      }
      return { x, y, bg: window.getComputedStyle(document.body).backgroundColor };
    }

    return {
      bodyBg: bodyStyle.backgroundColor,
      cssVars: {
        backgroundDefault: rootStyle.getPropertyValue('--background-default').trim(),
        backgroundRoot: rootStyle.getPropertyValue('--background-root').trim(),
        backgroundHigher: rootStyle.getPropertyValue('--background-higher').trim(),
        backgroundHighest: rootStyle.getPropertyValue('--background-highest').trim(),
        surface: rootStyle.getPropertyValue('--surface').trim(),
        surfaceBorderColorRegular: rootStyle.getPropertyValue('--surface-border-color-regular').trim(),
        foregroundDefault: rootStyle.getPropertyValue('--foreground-default').trim(),
        foregroundDimmer: rootStyle.getPropertyValue('--foreground-dimmer').trim(),
        foregroundDimmest: rootStyle.getPropertyValue('--foreground-dimmest').trim(),
      },
      paneBgs: [
        getBgAt(100, 300),
        getBgAt(400, 300),
        getBgAt(800, 300),
        getBgAt(1200, 300)
      ]
    };
  })()`;

  const res = await evalInTab(liveTarget, expr);
  console.log('LIVE WORKSPACE EXACT COLORS & CSS VARS:');
  console.log(JSON.stringify(res, null, 2));
}

main().catch(console.error);

import WebSocket from 'ws';

async function evalInTab(targetId, expression) {
  const tabs = await fetch('http://127.0.0.1:9222/json').then(r => r.json());
  const tab = tabs.find(t => t.id === targetId);
  return new Promise((resolve, reject) => {
    const ws = new WebSocket(tab.webSocketDebuggerUrl);
    ws.on('open', () => {
      ws.send(JSON.stringify({ id: 1, method: 'Runtime.evaluate', params: { expression, returnByValue: true } }));
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
  const reconTarget = '6D4B931B5EC0B7BE74E378FA2E19EDD9';

  const script = `(() => {
    function toObj(r) {
      return r ? { left: Math.round(r.left), top: Math.round(r.top), width: Math.round(r.width), height: Math.round(r.height) } : null;
    }
    const spinner = document.querySelector('[data-testid="agent-working-spinner"]') || document.querySelector('svg[fill="var(--brand-accent-default)"]')?.parentElement;
    const title = Array.from(document.querySelectorAll('h1')).find(h => h.innerText.includes('New chat'));
    const nix = document.querySelector('[data-popup="true"]') || Array.from(document.querySelectorAll('*')).find(d => d.innerText && d.innerText.includes('Nix environment is broken') && d.children.length > 2);
    const composer = document.querySelector('textarea') || document.querySelector('.cm-editor');

    return {
      spinner: toObj(spinner?.getBoundingClientRect()),
      title: toObj(title?.getBoundingClientRect()),
      nix: toObj(nix?.getBoundingClientRect()),
      composer: toObj(composer?.getBoundingClientRect())
    };
  })()`;

  const live = await evalInTab(liveTarget, script);
  const recon = await evalInTab(reconTarget, script);

  console.log('LIVE exact coords:');
  console.log(JSON.stringify(live, null, 2));

  console.log('\nRECON exact coords:');
  console.log(JSON.stringify(recon, null, 2));
}

main().catch(console.error);

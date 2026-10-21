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
  const reconTarget = '6D4B931B5EC0B7BE74E378FA2E19EDD9';

  const script = `(() => {
    const bodyBg = window.getComputedStyle(document.body).backgroundColor;
    const nav = document.querySelector('nav');
    const navBg = nav ? window.getComputedStyle(nav).backgroundColor : null;
    const main = document.querySelector('main');
    const mainBg = main ? window.getComputedStyle(main).backgroundColor : null;
    const input = document.querySelector('input[disabled]');
    const inputBg = input ? window.getComputedStyle(input).backgroundColor : null;
    const inputBorder = input ? window.getComputedStyle(input).borderColor : null;

    return { bodyBg, navBg, mainBg, inputBg, inputBorder };
  })()`;

  const live = await evalInTab(liveTarget, script);
  const recon = await evalInTab(reconTarget, script);

  console.log('Live styles: ', live);
  console.log('Recon styles:', recon);
}

main().catch(console.error);

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
    const title = Array.from(document.querySelectorAll('*')).find(el => el.innerText === 'Nix environment is broken');
    if (!title) return 'Title not found';
    let card = title;
    while (card && card.parentElement && card.parentElement.innerText.includes('Nix environment is broken') && card.parentElement.innerText.length < 500) {
      card = card.parentElement;
    }
    return {
      tag: card.tagName,
      className: card.className,
      rect: card.getBoundingClientRect(),
      html: card.outerHTML
    };
  })()`;

  const info = await evalInTab(liveTarget, script);
  fs.writeFileSync('work/analysis/signed_in/live_nix_card_clean.html', info.html);
  console.log('Saved live_nix_card_clean.html! Length:', info.html?.length);
  console.log('Rect:', info.rect);
}

main().catch(console.error);

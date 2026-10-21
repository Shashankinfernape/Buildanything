import WebSocket from 'ws';

function getRect(targetId) {
  return new Promise((resolve) => {
    const ws = new WebSocket('ws://127.0.0.1:9222/devtools/page/' + targetId);
    ws.on('open', () => {
      ws.send(JSON.stringify({
        id: 1,
        method: 'Runtime.evaluate',
        params: {
          expression: `JSON.stringify({
            chipsContainer: document.querySelector('button[aria-label="More ideas..."]')?.closest('div')?.parentElement?.children[1]?.getBoundingClientRect(),
            chip1: document.querySelector('button[aria-label="More ideas..."]')?.closest('div')?.parentElement?.children[1]?.children[0]?.getBoundingClientRect(),
            chip2: document.querySelector('button[aria-label="More ideas..."]')?.closest('div')?.parentElement?.children[1]?.children[1]?.getBoundingClientRect(),
            chip3: document.querySelector('button[aria-label="More ideas..."]')?.closest('div')?.parentElement?.children[1]?.children[2]?.getBoundingClientRect()
          })`,
          returnByValue: true
        }
      }));
    });
    ws.on('message', data => {
      const msg = JSON.parse(data);
      if (msg.id === 1) {
        ws.close();
        resolve(JSON.parse(msg.result?.result?.value || '{}'));
      }
    });
  });
}

const [live, recon] = await Promise.all([
  getRect('4D5803D83D1C78981FF3E408A2F4B2D5'),
  getRect('6D4B931B5EC0B7BE74E378FA2E19EDD9')
]);

console.log('--- LIVE CHIPS ---');
console.log(JSON.stringify(live, null, 2));
console.log('--- RECON CHIPS ---');
console.log(JSON.stringify(recon, null, 2));

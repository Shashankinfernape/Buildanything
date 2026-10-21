import WebSocket from 'ws';

function getBg(targetId) {
  return new Promise((resolve) => {
    const ws = new WebSocket('ws://127.0.0.1:9222/devtools/page/' + targetId);
    ws.on('open', () => {
      ws.send(JSON.stringify({
        id: 1,
        method: 'Runtime.evaluate',
        params: {
          expression: `(() => {
            const m = document.querySelector('main');
            return {
              bodyBg: getComputedStyle(document.body).backgroundColor,
              nextBg: getComputedStyle(document.getElementById('__next') || document.body.firstElementChild).backgroundColor,
              mainParentBg: m ? getComputedStyle(m.parentElement).backgroundColor : 'none',
              mainBg: m ? getComputedStyle(m).backgroundColor : 'none'
            };
          })()`,
          returnByValue: true
        }
      }));
    });
    ws.on('message', data => {
      const msg = JSON.parse(data);
      if (msg.id === 1) {
        ws.close();
        resolve(msg.result?.result?.value);
      }
    });
  });
}

const [live, recon] = await Promise.all([
  getBg('4D5803D83D1C78981FF3E408A2F4B2D5'),
  getBg('6D4B931B5EC0B7BE74E378FA2E19EDD9')
]);

console.log('LIVE BACKGROUNDS:', live);
console.log('RECON BACKGROUNDS:', recon);

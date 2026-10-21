import WebSocket from 'ws';

async function main() {
  const ws = new WebSocket('ws://127.0.0.1:9222/devtools/page/6D4B931B5EC0B7BE74E378FA2E19EDD9');
  await new Promise(r => ws.onopen = r);
  let cid = 1;
  const send = (m, p = {}) => new Promise(res => {
    const id = cid++;
    ws.on('message', function h(d) {
      const j = JSON.parse(d);
      if (j.id === id) { ws.removeListener('message', h); res(j.result); }
    });
    ws.send(JSON.stringify({ id, method: m, params: p }));
  });

  const res = await send('Runtime.evaluate', {
    expression: `(() => {
      const main = document.querySelector('main');
      const nav = document.querySelector('nav');
      const body = document.body;
      return {
        bodyBg: window.getComputedStyle(body).backgroundColor,
        bodyColor: window.getComputedStyle(body).color,
        mainBg: main ? window.getComputedStyle(main).backgroundColor : null,
        mainChildBg: main?.firstElementChild ? window.getComputedStyle(main.firstElementChild).backgroundColor : null,
        navBg: nav ? window.getComputedStyle(nav).backgroundColor : null,
        bodyFirstChildClass: body.firstElementChild?.className,
        bodyHtmlSnippet: body.innerHTML.slice(0, 300)
      };
    })()`,
    returnByValue: true
  });
  console.log('Recon state:', JSON.stringify(res.result?.value, null, 2));
  ws.close();
}

main().catch(console.error);

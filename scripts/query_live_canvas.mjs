import WebSocket from 'ws';

const ws = new WebSocket('ws://127.0.0.1:9222/devtools/page/4D5803D83D1C78981FF3E408A2F4B2D5');
ws.on('open', () => {
  ws.send(JSON.stringify({
    id: 1,
    method: 'Runtime.evaluate',
    params: {
      expression: `(() => {
        const bodyBg = getComputedStyle(document.body).backgroundColor;
        const canvases = Array.from(document.querySelectorAll('canvas')).map(c => ({
          w: c.width,
          h: c.height,
          rect: c.getBoundingClientRect(),
          cls: c.className,
          parentCls: c.parentElement?.className,
          parentStyle: c.parentElement ? {
            opacity: getComputedStyle(c.parentElement).opacity,
            bg: getComputedStyle(c.parentElement).backgroundColor,
            dataState: c.parentElement.getAttribute('data-state')
          } : null
        }));
        return { bodyBg, dpr: window.devicePixelRatio, innerW: window.innerWidth, innerH: window.innerHeight, canvases };
      })()`,
      returnByValue: true
    }
  }));
});

ws.on('message', data => {
  console.log(JSON.stringify(JSON.parse(data).result?.result?.value, null, 2));
  process.exit(0);
});

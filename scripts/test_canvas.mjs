import WebSocket from 'ws';

const ws = new WebSocket('ws://127.0.0.1:9222/devtools/page/6D4B931B5EC0B7BE74E378FA2E19EDD9');
ws.on('open', () => {
  ws.send(JSON.stringify({
    id: 1,
    method: 'Runtime.evaluate',
    params: {
      expression: `(() => {
        const c = document.querySelector('canvas');
        return {
          exists: !!c,
          width: c?.width,
          height: c?.height,
          dataUrlLen: c?.toDataURL()?.length,
          parentClass: c?.parentElement?.className,
          parentStyle: c?.parentElement?.getAttribute('style')
        };
      })()`,
      returnByValue: true
    }
  }));
});

ws.on('message', data => {
  console.log(JSON.parse(data).result?.result?.value);
  process.exit(0);
});

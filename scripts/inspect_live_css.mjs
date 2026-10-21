import WebSocket from 'ws';

const ws = new WebSocket('ws://127.0.0.1:9222/devtools/page/4D5803D83D1C78981FF3E408A2F4B2D5');
ws.on('open', () => {
  ws.send(JSON.stringify({
    id: 1,
    method: 'Runtime.evaluate',
    params: {
      expression: `Array.from(document.querySelectorAll('link[rel=stylesheet], style')).map(el => el.tagName === 'LINK' ? el.href : {tag: 'STYLE', id: el.id, len: el.textContent.length})`,
      returnByValue: true
    }
  }));
});
ws.on('message', data => {
  console.log(JSON.stringify(JSON.parse(data).result.result.value, null, 2));
  process.exit(0);
});

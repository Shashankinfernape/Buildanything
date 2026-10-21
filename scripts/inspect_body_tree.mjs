import WebSocket from 'ws';

const ws = new WebSocket('ws://127.0.0.1:9222/devtools/page/4D5803D83D1C78981FF3E408A2F4B2D5');
ws.on('open', () => {
  ws.send(JSON.stringify({
    id: 1,
    method: 'Runtime.evaluate',
    params: {
      expression: `(() => {
        function getSummary(el, depth = 0) {
          if (depth > 4) return '...';
          const tag = el.tagName.toLowerCase();
          const id = el.id ? '#' + el.id : '';
          const cls = el.className && typeof el.className === 'string' ? '.' + el.className.split(' ').slice(0, 3).join('.') : '';
          const style = el.getAttribute('style') ? ' [' + el.getAttribute('style').slice(0, 60) + ']' : '';
          const children = Array.from(el.children).map(c => getSummary(c, depth + 1));
          return { tag: tag + id + cls + style, children };
        }
        return getSummary(document.body);
      })()`,
      returnByValue: true
    }
  }));
});

ws.on('message', data => {
  console.log(JSON.stringify(JSON.parse(data).result.result.value, null, 2));
  process.exit(0);
});

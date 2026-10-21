import WebSocket from 'ws';
import fs from 'fs';

const ws = new WebSocket('ws://127.0.0.1:9222/devtools/page/4D5803D83D1C78981FF3E408A2F4B2D5');
ws.on('open', () => {
  ws.send(JSON.stringify({
    id: 1,
    method: 'Runtime.evaluate',
    params: {
      expression: `(() => {
        const c = document.querySelector('canvas');
        return c.toDataURL('image/png');
      })()`,
      returnByValue: true
    }
  }));
});

ws.on('message', data => {
  const res = JSON.parse(data).result.result.value;
  console.log('toDataURL result length:', res?.length);
  if (res && res.startsWith('data:image/png;base64,')) {
    const b64 = res.replace('data:image/png;base64,', '');
    fs.writeFileSync('work/reconstruction/public/live_canvas_glow.png', Buffer.from(b64, 'base64'));
    console.log('Saved work/reconstruction/public/live_canvas_glow.png!');
  }
  process.exit(0);
});

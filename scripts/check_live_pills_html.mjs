import WebSocket from 'ws';

const LIVE_ID = '0CEBF5F820FA8AA89465BD16147DDED9';

async function test() {
  const ws = new WebSocket(`ws://127.0.0.1:9222/devtools/page/${LIVE_ID}`);
  await new Promise(r => ws.onopen = r);
  let cid = 1;
  const send = (method, params = {}) => new Promise((res) => {
    const curId = cid++;
    const handler = (evt) => {
      const data = JSON.parse(evt.data);
      if (data.id === curId) {
        ws.removeEventListener('message', handler);
        res(data.result);
      }
    };
    ws.addEventListener('message', handler);
    ws.send(JSON.stringify({ id: curId, method, params }));
  });
  const res = await send('Runtime.evaluate', {
    expression: `(() => {
      const root = document.querySelector('[data-agent-input2-root]');
      return root.children[1].outerHTML;
    })()`,
    returnByValue: true
  });
  console.log(res.result?.value);
  ws.close();
}

test();

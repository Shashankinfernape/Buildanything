import WebSocket from 'ws';

const LIVE_ID = '0CEBF5F820FA8AA89465BD16147DDED9';
const RECON_ID = 'A7DF9577D21FF635BD6EF295E92FAEC1';

async function test() {
  for (const [name, id] of [['Live', LIVE_ID], ['Recon', RECON_ID]]) {
    const ws = new WebSocket(`ws://127.0.0.1:9222/devtools/page/${id}`);
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
        const box = root.children[0];
        const pills = root.children[1];
        return {
          rootH: root.getBoundingClientRect().height,
          boxH: box.getBoundingClientRect().height,
          pillsH: pills.getBoundingClientRect().height,
          textareaH: root.querySelector('textarea').getBoundingClientRect().height,
          suggestedH: root.querySelector('._sdz_theme-text-input')?.getBoundingClientRect().height
        };
      })()`,
      returnByValue: true
    });
    console.log(name, res.result?.value);
    ws.close();
  }
}

test();

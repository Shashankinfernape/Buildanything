import WebSocket from 'ws';

async function checkClosed() {
  for (const [id, label] of [['0CEBF5F820FA8AA89465BD16147DDED9', 'LIVE'], ['A7DF9577D21FF635BD6EF295E92FAEC1', 'RECON']]) {
    const ws = new WebSocket('ws://127.0.0.1:9222/devtools/page/' + id);
    await new Promise(r => ws.onopen = r);
    let cid = 1;
    const send = (method, params = {}) => new Promise((resolve) => {
      const curId = cid++;
      const handler = (evt) => {
        const data = JSON.parse(evt.data);
        if (data.id === curId) {
          ws.removeEventListener('message', handler);
          resolve(data.result);
        }
      };
      ws.addEventListener('message', handler);
      ws.send(JSON.stringify({ id: curId, method, params }));
    });

    const res = await send('Runtime.evaluate', {
      expression: `(() => {
        const expanded = Array.from(document.querySelectorAll("button[aria-expanded='true']"));
        const openGroups = Array.from(document.querySelectorAll("div[data-state='open']"));
        return {
          expandedButtons: expanded.map(b => (b.innerText || '').trim()),
          openGroupsCount: openGroups.length
        };
      })()`,
      returnByValue: true
    });
    console.log(label, 'current closed state:', res.result?.value);
    ws.close();
  }
}
checkClosed();

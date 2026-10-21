import WebSocket from 'ws';

async function findRule() {
  const ws = new WebSocket('ws://127.0.0.1:9222/devtools/page/0CEBF5F820FA8AA89465BD16147DDED9');
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
      let el = document.querySelector("header");
      const chain = [];
      while (el) {
        const val = el.style.getPropertyValue("--surface-color") || window.getComputedStyle(el).getPropertyValue("--surface-color");
        chain.push({
          tag: el.tagName,
          id: el.id,
          class: el.className,
          inlineStyle: el.getAttribute("style"),
          surfaceColor: val
        });
        el = el.parentElement;
      }
      return chain;
    })()`,
    returnByValue: true
  });
  console.log(JSON.stringify(res.result?.value, null, 2));
  ws.close();
}
findRule();

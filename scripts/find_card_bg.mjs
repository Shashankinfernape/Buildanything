import WebSocket from 'ws';

async function run() {
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
      let el = document.querySelector("textarea");
      const list = [];
      while (el && el.tagName !== "BODY") {
        const s = window.getComputedStyle(el);
        if (s.backgroundColor !== "rgba(0, 0, 0, 0)" || s.boxShadow !== "none" || s.borderWidth !== "0px") {
          list.push({
            tag: el.tagName,
            class: el.className,
            bg: s.backgroundColor,
            shadow: s.boxShadow,
            border: s.border,
            radius: s.borderRadius,
            rect: { x: Math.round(el.getBoundingClientRect().x), y: Math.round(el.getBoundingClientRect().y), w: Math.round(el.getBoundingClientRect().width), h: Math.round(el.getBoundingClientRect().height) }
          });
        }
        el = el.parentElement;
      }
      return list;
    })()`,
    returnByValue: true
  });

  console.log(JSON.stringify(res.result.value, null, 2));
  ws.close();
}

run();

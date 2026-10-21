import WebSocket from 'ws';

async function evalHeader(targetId, label) {
  const ws = new WebSocket('ws://127.0.0.1:9222/devtools/page/' + targetId);
  await new Promise(r => ws.onopen = r);
  let id = 1;
  const send = (method, params = {}) => new Promise((resolve) => {
    const curId = id++;
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
      const h = document.querySelector("header");
      if (!h) return { error: "No header found" };
      const rect = h.getBoundingClientRect();
      const style = window.getComputedStyle(h);
      const nav = h.querySelector("nav");
      const navRect = nav ? nav.getBoundingClientRect() : null;
      const elements = Array.from(h.querySelectorAll("button, a")).map(b => ({
        tag: b.tagName,
        text: (b.innerText || "").split('\\n')[0].trim(),
        rect: {
          x: Math.round(b.getBoundingClientRect().x),
          y: Math.round(b.getBoundingClientRect().y),
          w: Math.round(b.getBoundingClientRect().width),
          h: Math.round(b.getBoundingClientRect().height)
        },
        bg: window.getComputedStyle(b).backgroundColor,
        color: window.getComputedStyle(b).color,
        fontSize: window.getComputedStyle(b).fontSize
      }));
      return {
        headerRect: { x: Math.round(rect.x), y: Math.round(rect.y), w: Math.round(rect.width), h: Math.round(rect.height) },
        navRect: navRect ? { x: Math.round(navRect.x), y: Math.round(navRect.y), w: Math.round(navRect.width), h: Math.round(navRect.height) } : null,
        bg: style.backgroundColor,
        fontFamily: style.fontFamily,
        elements
      };
    })()`,
    returnByValue: true
  });
  console.log('=== ' + label + ' ===');
  console.log(JSON.stringify(res.result?.value, null, 2));
  ws.close();
}

async function run() {
  await evalHeader('0CEBF5F820FA8AA89465BD16147DDED9', 'LIVE REPLIT');
  await evalHeader('A7DF9577D21FF635BD6EF295E92FAEC1', 'RECONSTRUCTION');
}
run();

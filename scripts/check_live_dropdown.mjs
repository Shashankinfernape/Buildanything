import WebSocket from 'ws';

async function check() {
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
      const btns = Array.from(document.querySelectorAll("button")).filter(b => (b.innerText || '').includes('Products'));
      const btn = btns[0];
      const panelId = btn ? btn.getAttribute("aria-controls") : null;
      const panel = panelId ? document.getElementById(panelId) : null;
      const panelParent = panel ? panel.parentElement : null;
      return {
        btnFound: !!btn,
        ariaExpanded: btn ? btn.getAttribute("aria-expanded") : null,
        panelParentClasses: panelParent ? panelParent.className : null,
        panelParentVisible: panelParent ? window.getComputedStyle(panelParent).visibility : null,
        panelParentOpacity: panelParent ? window.getComputedStyle(panelParent).opacity : null,
        panelRect: panel ? panel.getBoundingClientRect() : null
      };
    })()`,
    returnByValue: true
  });

  console.log('Live Products State:', res.result?.value);
  ws.close();
}

check();

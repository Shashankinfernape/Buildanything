import WebSocket from 'ws';

async function testReconOpen() {
  const ws = new WebSocket('ws://127.0.0.1:9222/devtools/page/A7DF9577D21FF635BD6EF295E92FAEC1');
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
    expression: `(async () => {
      if (typeof window.__setNavDropdown === 'function') {
        window.__setNavDropdown('Products');
      }
      await new Promise(r => setTimeout(r, 200));

      const panel = document.getElementById('marketing-header-panel-d7e540c5b986');
      const content = panel ? panel.parentElement : null;
      const btn = document.querySelector("button[aria-controls='marketing-header-panel-d7e540c5b986']");

      return {
        btnAria: btn ? btn.getAttribute('aria-expanded') : null,
        panelAriaHidden: panel ? panel.getAttribute('aria-hidden') : null,
        contentVisible: content ? window.getComputedStyle(content).visibility : null,
        contentOpacity: content ? window.getComputedStyle(content).opacity : null,
        panelRect: panel ? panel.getBoundingClientRect() : null
      };
    })()`,
    awaitPromise: true,
    returnByValue: true
  });

  console.log('Recon Products Open:', res.result?.value);
  ws.close();
}

testReconOpen();

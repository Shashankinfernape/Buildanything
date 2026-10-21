import WebSocket from 'ws';

async function checkClasses() {
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
        const h = document.querySelector("header");
        const rightContainer = h.querySelector("[data-cy='header-signup-button']")?.parentElement?.parentElement;
        const middleContainer = h.querySelector("button[id*='react-aria']")?.parentElement?.parentElement?.parentElement;
        return {
          rightContainer: rightContainer ? {
            tag: rightContainer.tagName,
            class: rightContainer.className,
            display: window.getComputedStyle(rightContainer).display,
            rect: rightContainer.getBoundingClientRect()
          } : null,
          middleContainer: middleContainer ? {
            tag: middleContainer.tagName,
            class: middleContainer.className,
            display: window.getComputedStyle(middleContainer).display,
            rect: middleContainer.getBoundingClientRect()
          } : null
        };
      })()`,
      returnByValue: true
    });
    console.log('=== ' + label + ' ===');
    console.log(JSON.stringify(res.result?.value, null, 2));
    ws.close();
  }
}
checkClasses();

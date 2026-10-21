import WebSocket from 'ws';

async function testReactOpen() {
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
    expression: `(async () => {
      const groups = Array.from(document.querySelectorAll("header div[role='group']"));
      const productsGroup = groups[0];
      const propsKey = Object.keys(productsGroup).find(k => k.startsWith('__reactProps'));
      
      console.log('Calling onMouseEnter on Products...');
      productsGroup[propsKey].onMouseEnter();

      // Wait 300ms for React render and CSS transition
      await new Promise(r => setTimeout(r, 300));

      const panel = productsGroup.querySelector("[id*='marketing-header-panel']");
      const content = panel ? panel.parentElement : null;

      return {
        groupState: productsGroup.getAttribute('data-state'),
        buttonAria: productsGroup.querySelector("button")?.getAttribute('aria-expanded'),
        contentState: content ? content.getAttribute('data-state') : null,
        contentClasses: content ? content.className : null,
        contentVisible: content ? window.getComputedStyle(content).visibility : null,
        contentOpacity: content ? window.getComputedStyle(content).opacity : null,
        panelAriaHidden: panel ? panel.getAttribute('aria-hidden') : null
      };
    })()`,
    awaitPromise: true,
    returnByValue: true
  });

  console.log('Result after onMouseEnter:', res.result?.value);
  ws.close();
}

testReactOpen();

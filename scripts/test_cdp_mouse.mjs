import WebSocket from 'ws';

async function testCDPMouse() {
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

  await send('Page.bringToFront');

  // Find exact center coordinates of Products button
  const coords = await send('Runtime.evaluate', {
    expression: `(() => {
      const btns = Array.from(document.querySelectorAll("button")).filter(b => (b.innerText || '').includes('Products'));
      const r = btns[0].getBoundingClientRect();
      return { x: r.x + r.width / 2, y: r.y + r.height / 2 };
    })()`,
    returnByValue: true
  });
  console.log('Button coordinates:', coords.result.value);
  const { x, y } = coords.result.value;

  console.log('Moving mouse to button...');
  await send('Input.dispatchMouseEvent', { type: 'mouseMoved', x, y });
  await new Promise(r => setTimeout(r, 200));

  console.log('Clicking button...');
  await send('Input.dispatchMouseEvent', { type: 'mousePressed', x, y, button: 'left', clickCount: 1 });
  await send('Input.dispatchMouseEvent', { type: 'mouseReleased', x, y, button: 'left', clickCount: 1 });
  await new Promise(r => setTimeout(r, 400));

  const check = await send('Runtime.evaluate', {
    expression: `(() => {
      const btns = Array.from(document.querySelectorAll("button")).filter(b => (b.innerText || '').includes('Products'));
      const btn = btns[0];
      const panelId = btn.getAttribute("aria-controls");
      const panel = panelId ? document.getElementById(panelId) : null;
      const panelParent = panel ? panel.parentElement : null;
      return {
        ariaExpanded: btn.getAttribute("aria-expanded"),
        panelParentVisible: panelParent ? window.getComputedStyle(panelParent).visibility : null,
        panelParentOpacity: panelParent ? window.getComputedStyle(panelParent).opacity : null,
        panelClasses: panelParent ? panelParent.className : null
      };
    })()`,
    returnByValue: true
  });

  console.log('State after CDP click:', check.result.value);
  ws.close();
}

testCDPMouse();

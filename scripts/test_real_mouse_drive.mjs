import WebSocket from 'ws';

function createCdpSender(targetId) {
  return new Promise(async (resolve, reject) => {
    try {
      const ws = new WebSocket(`ws://127.0.0.1:9222/devtools/page/${targetId}`);
      await new Promise(r => ws.onopen = r);
      let cid = 1;
      const send = (method, params = {}) => new Promise((res, rej) => {
        const curId = cid++;
        const timer = setTimeout(() => rej(new Error(`CDP timeout: ${method}`)), 10000);
        const handler = (evt) => {
          const data = JSON.parse(evt.data);
          if (data.id === curId) {
            clearTimeout(timer);
            ws.removeEventListener('message', handler);
            res(data.result);
          }
        };
        ws.addEventListener('message', handler);
        ws.send(JSON.stringify({ id: curId, method, params }));
      });
      resolve({ ws, send });
    } catch (err) {
      reject(err);
    }
  });
}

async function testTarget(targetId, label) {
  const cdp = await createCdpSender(targetId);
  await cdp.send('Page.bringToFront');

  // Find button coords
  const coords = await cdp.send('Runtime.evaluate', {
    expression: `(() => {
      const btns = Array.from(document.querySelectorAll("header button")).filter(b => (b.innerText || '').includes('Products'));
      if (!btns.length) return null;
      const r = btns[0].getBoundingClientRect();
      return { x: r.x + r.width / 2, y: r.y + r.height / 2, r };
    })()`,
    returnByValue: true
  });
  console.log(`${label} Products button coords:`, coords.result.value);
  const { x, y } = coords.result.value;

  // Move mouse to button
  await cdp.send('Input.dispatchMouseEvent', { type: 'mouseMoved', x: 0, y: 0 });
  await new Promise(r => setTimeout(r, 100));
  await cdp.send('Input.dispatchMouseEvent', { type: 'mouseMoved', x, y });
  await new Promise(r => setTimeout(r, 400));

  const stateOpen = await cdp.send('Runtime.evaluate', {
    expression: `(() => {
      const panel = document.getElementById('marketing-header-panel-d7e540c5b986');
      const content = panel ? panel.parentElement : null;
      return {
        visibility: content ? window.getComputedStyle(content).visibility : null,
        opacity: content ? window.getComputedStyle(content).opacity : null
      };
    })()`,
    returnByValue: true
  });
  console.log(`${label} state after mouseMoved to button:`, stateOpen.result.value);

  // Move mouse away
  await cdp.send('Input.dispatchMouseEvent', { type: 'mouseMoved', x: 0, y: 0 });
  await new Promise(r => setTimeout(r, 400));

  const stateClosed = await cdp.send('Runtime.evaluate', {
    expression: `(() => {
      const panel = document.getElementById('marketing-header-panel-d7e540c5b986');
      const content = panel ? panel.parentElement : null;
      return {
        visibility: content ? window.getComputedStyle(content).visibility : null,
        opacity: content ? window.getComputedStyle(content).opacity : null
      };
    })()`,
    returnByValue: true
  });
  console.log(`${label} state after mouseMoved away:`, stateClosed.result.value);

  cdp.ws.close();
}

async function run() {
  await testTarget('A7DF9577D21FF635BD6EF295E92FAEC1', 'RECON');
  await testTarget('0CEBF5F820FA8AA89465BD16147DDED9', 'LIVE');
}

run().catch(console.error);

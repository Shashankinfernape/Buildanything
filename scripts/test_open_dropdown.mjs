import WebSocket from 'ws';

async function testClick() {
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

  console.log('Dispatching click or hover on Products button via CDP...');
  const res = await send('Runtime.evaluate', {
    expression: `(() => {
      const btns = Array.from(document.querySelectorAll("button")).filter(b => (b.innerText || '').includes('Products'));
      const btn = btns[0];
      if (!btn) return { error: "Button not found" };
      
      // Try pointerenter / mouseenter
      btn.dispatchEvent(new PointerEvent('pointerenter', { bubbles: true }));
      btn.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));
      btn.dispatchEvent(new MouseEvent('mouseover', { bubbles: true }));

      // Or click
      btn.click();

      const panelId = btn.getAttribute("aria-controls");
      const panel = panelId ? document.getElementById(panelId) : null;
      const panelParent = panel ? panel.parentElement : null;

      return {
        clicked: true,
        ariaExpanded: btn.getAttribute("aria-expanded"),
        panelParentVisible: panelParent ? window.getComputedStyle(panelParent).visibility : null,
        panelParentOpacity: panelParent ? window.getComputedStyle(panelParent).opacity : null,
        panelParentClasses: panelParent ? panelParent.className : null
      };
    })()`,
    returnByValue: true
  });

  console.log('Result:', res.result?.value);
  ws.close();
}

testClick();

import WebSocket from 'ws';

async function checkParent() {
  const ws = new WebSocket('ws://127.0.0.1:9222/devtools/page/1F77289A2297F8B8A35F03904F821099');
  await new Promise(r => ws.onopen = r);
  let cid = 1;
  const send = (m, p={}) => new Promise(res => {
    const id = cid++;
    const handler = d => {
      const j = JSON.parse(d);
      if (j.id === id) {
        ws.removeListener('message', handler);
        res(j.result);
      }
    };
    ws.on('message', handler);
    ws.send(JSON.stringify({ id, method: m, params: p }));
  });

  const res = await send('Runtime.evaluate', {
    expression: `(() => {
      const el = document.querySelector('._sdz_theme-text-input._sdz_surface._sdz_switch-theme');
      return {
        tag: el.tagName,
        cls: el.className,
        parentTag: el.parentElement?.tagName,
        parentCls: el.parentElement?.className,
        grandTag: el.parentElement?.parentElement?.tagName,
        grandCls: el.parentElement?.parentElement?.className,
        box: el.getBoundingClientRect(),
        display: window.getComputedStyle(el).display,
        position: window.getComputedStyle(el).position,
        top: window.getComputedStyle(el).top,
        parentBox: el.parentElement?.getBoundingClientRect()
      };
    })()`,
    returnByValue: true
  });

  console.log(JSON.stringify(res.result.value, null, 2));
  ws.close();
}

checkParent().catch(console.error);

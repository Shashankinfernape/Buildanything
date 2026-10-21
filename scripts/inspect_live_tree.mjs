import WebSocket from 'ws';

async function inspectLiveTree() {
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
      const r = document.querySelector('[data-agent-input2-root]');
      const c2 = r.children[1];
      function dump(el, depth=0) {
        const b = el.getBoundingClientRect();
        const cs = window.getComputedStyle(el);
        const res = [{
          depth,
          tag: el.tagName,
          cls: el.className,
          h: b.height,
          pt: cs.paddingTop,
          pb: cs.paddingBottom,
          mt: cs.marginTop,
          mb: cs.marginBottom
        }];
        for (const ch of el.children) {
          res.push(...dump(ch, depth + 1));
        }
        return res;
      }
      return dump(c2);
    })()`,
    returnByValue: true
  });

  console.log(JSON.stringify(res.result?.value, null, 2));
  ws.close();
}

inspectLiveTree().catch(console.error);

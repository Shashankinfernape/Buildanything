import WebSocket from 'ws';

async function compareTree() {
  const wsLive = new WebSocket('ws://127.0.0.1:9222/devtools/page/1F77289A2297F8B8A35F03904F821099');
  const wsRecon = new WebSocket('ws://127.0.0.1:9222/devtools/page/D443E8091E8733163C20C86AEEDB5714');
  await Promise.all([new Promise(r => wsLive.onopen = r), new Promise(r => wsRecon.onopen = r)]);

  async function getHeights(ws) {
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

    return (await send('Runtime.evaluate', {
      expression: `(() => {
        const c2 = document.querySelector('[data-agent-input2-root]').children[1];
        const m4 = c2.children[0];
        return {
          c2_h: c2.getBoundingClientRect().height,
          m4_h: m4.getBoundingClientRect().height,
          m4_children: Array.from(m4.children).map(c => ({
            tag: c.tagName,
            cls: c.className.slice(0, 60),
            h: c.getBoundingClientRect().height,
            outer: c.outerHTML.slice(0, 100)
          }))
        };
      })()`,
      returnByValue: true
    })).result.value;
  }

  const live = await getHeights(wsLive);
  const recon = await getHeights(wsRecon);
  console.log('LIVE:', JSON.stringify(live, null, 2));
  console.log('RECON:', JSON.stringify(recon, null, 2));
  wsLive.close();
  wsRecon.close();
}

compareTree().catch(console.error);

import WebSocket from 'ws';

async function inspect(targetId, label) {
  const ws = new WebSocket('ws://127.0.0.1:9222/devtools/page/' + targetId);
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
      if (!r || !r.children[1]) return null;
      const c2 = r.children[1];
      return {
        html: c2.innerHTML,
        cls: c2.className,
        box: c2.getBoundingClientRect(),
        children: Array.from(c2.children).map(c => ({
          tag: c.tagName,
          cls: c.className,
          h: c.offsetHeight,
          box: c.getBoundingClientRect(),
          mt: window.getComputedStyle(c).marginTop,
          mb: window.getComputedStyle(c).marginBottom,
          pt: window.getComputedStyle(c).paddingTop,
          pb: window.getComputedStyle(c).paddingBottom
        }))
      };
    })()`,
    returnByValue: true
  });
  console.log(label, JSON.stringify(res.result?.value, null, 2));
  ws.close();
}

async function main() {
  await inspect('1F77289A2297F8B8A35F03904F821099', 'LIVE:');
  await inspect('D443E8091E8733163C20C86AEEDB5714', 'RECON:');
}
main().catch(console.error);

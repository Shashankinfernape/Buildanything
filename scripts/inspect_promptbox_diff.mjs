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
      if (!r) return null;
      const b = r.getBoundingClientRect();
      const ch = Array.from(r.children).map(c => ({
        tag: c.tagName,
        cls: c.className.toString(),
        rect: { x: c.getBoundingClientRect().x, y: c.getBoundingClientRect().y, w: c.getBoundingClientRect().width, h: c.getBoundingClientRect().height },
        h: c.offsetHeight,
        mt: window.getComputedStyle(c).marginTop,
        mb: window.getComputedStyle(c).marginBottom,
        pt: window.getComputedStyle(c).paddingTop,
        pb: window.getComputedStyle(c).paddingBottom
      }));
      return { rootBox: { x: b.x, y: b.y, w: b.width, h: b.height }, computedH: window.getComputedStyle(r).height, children: ch };
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

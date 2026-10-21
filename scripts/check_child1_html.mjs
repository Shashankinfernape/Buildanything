import WebSocket from 'ws';

async function checkOuterHtml() {
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
      return r.children[1].outerHTML;
    })()`,
    returnByValue: true
  });

  import('fs').then(fs => {
    fs.writeFileSync('work/analysis/live_child1_outer.html', res.result.value, 'utf8');
    console.log('Saved live child 1 outerHTML, length:', res.result.value.length);
  });
  ws.close();
}

checkOuterHtml().catch(console.error);

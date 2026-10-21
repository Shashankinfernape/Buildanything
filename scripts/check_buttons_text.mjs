import WebSocket from 'ws';

async function test(targetId, label) {
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
      const btns = Array.from(document.querySelectorAll('button[data-ruic="Button"]')).map(b => b.textContent.trim());
      const ta = document.querySelector('textarea[data-ruic="MultiLineInput"]');
      return { btns, placeholder: ta?.placeholder, value: ta?.value };
    })()`,
    returnByValue: true
  });
  console.log(label, res.result.value);
  ws.close();
}

async function main() {
  await test('1F77289A2297F8B8A35F03904F821099', 'LIVE:');
  await test('D443E8091E8733163C20C86AEEDB5714', 'RECON:');
}
main().catch(console.error);

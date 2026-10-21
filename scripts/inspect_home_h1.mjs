import WebSocket from 'ws';

const TARGET_ID = '4D5803D83D1C78981FF3E408A2F4B2D5';

async function main() {
  const ws = new WebSocket(`ws://127.0.0.1:9222/devtools/page/${TARGET_ID}`);
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
      const h1 = document.querySelector('h1');
      if (!h1) return 'No h1';
      const parent = h1.parentElement;
      return {
        h1Text: h1.textContent.trim(),
        h1Cls: h1.className,
        parentTag: parent.tagName,
        parentCls: parent.className,
        parentChildren: Array.from(parent.children).map(c => ({
          tag: c.tagName,
          cls: c.className,
          w: Math.round(c.getBoundingClientRect().width),
          h: Math.round(c.getBoundingClientRect().height),
          inputs: Array.from(c.querySelectorAll('input, textarea, [contenteditable]')).map(i => ({
            tag: i.tagName,
            type: i.type,
            placeholder: i.placeholder || i.getAttribute('placeholder'),
            contenteditable: i.getAttribute('contenteditable')
          }))
        }))
      };
    })()`,
    returnByValue: true
  });

  console.log(JSON.stringify(res.result.value, null, 2));
  ws.close();
}

main().catch(console.error);

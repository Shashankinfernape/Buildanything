import WebSocket from 'ws';

async function checkExamplePrompt() {
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
      const all = Array.from(document.querySelectorAll('*'));
      const textNode = all.find(e => e.children.length === 0 && e.textContent.includes('Try an example prompt'));
      if (!textNode) return 'Not found';
      
      const chain = [];
      let cur = textNode;
      while (cur && cur !== document.body) {
        chain.push({
          tag: cur.tagName,
          cls: cur.className,
          h: cur.getBoundingClientRect().height,
          outer: cur.outerHTML.slice(0, 80)
        });
        cur = cur.parentElement;
      }
      return chain;
    })()`,
    returnByValue: true
  });

  for (let i = 0; i < res.result.value.length; i++) {
    const item = res.result.value[i];
    console.log(`[${i}] ${item.tag} (h=${item.h}): ${item.cls}`);
  }
  ws.close();
}

checkExamplePrompt().catch(console.error);

import WebSocket from 'ws';

async function findPromptRow() {
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
      const c2 = document.querySelector('[data-agent-input2-root]').children[1];
      function findText(node, text) {
        if (node.textContent.includes(text)) {
          for (const ch of node.children) {
            const found = findText(ch, text);
            if (found) return found;
          }
          return node;
        }
        return null;
      }
      const target = findText(c2, 'Try an example prompt');
      if (!target) return 'Not found in c2';
      const path = [];
      let cur = target;
      while (cur && cur !== c2) {
        path.unshift({
          tag: cur.tagName,
          cls: cur.className,
          h: cur.getBoundingClientRect().height,
          outer: cur.outerHTML.slice(0, 100)
        });
        cur = cur.parentElement;
      }
      return path;
    })()`,
    returnByValue: true
  });

  for (const item of res.result.value) {
    console.log(`Tag: ${item.tag}, h: ${item.h}, cls: ${item.cls}`);
  }
  ws.close();
}

findPromptRow().catch(console.error);

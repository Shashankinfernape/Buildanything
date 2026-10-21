import WebSocket from 'ws';

const LIVE_ID = '0CEBF5F820FA8AA89465BD16147DDED9';

async function checkLiveSpacing() {
  const ws = new WebSocket(`ws://127.0.0.1:9222/devtools/page/${LIVE_ID}`);
  await new Promise(r => ws.onopen = r);
  let cid = 1;
  const send = (method, params = {}) => new Promise((res) => {
    const curId = cid++;
    const handler = (evt) => {
      const data = JSON.parse(evt.data);
      if (data.id === curId) {
        ws.removeEventListener('message', handler);
        res(data.result);
      }
    };
    ws.addEventListener('message', handler);
    ws.send(JSON.stringify({ id: curId, method, params }));
  });

  const script = `(() => {
    const next = document.getElementById('__next');
    const c1 = next.children[7].children[0].children[1];
    const bannerWrapper = c1.children[0];
    const contentWrapper = c1.children[1];
    const inner = contentWrapper.children[0];
    const cs = window.getComputedStyle(contentWrapper);
    const ics = window.getComputedStyle(inner);
    return {
      c1Classes: c1.className,
      contentWrapperClasses: contentWrapper.className,
      innerClasses: inner.className,
      contentWrapperStyle: {
        paddingTop: cs.paddingTop,
        paddingBottom: cs.paddingBottom,
        marginTop: cs.marginTop
      },
      innerStyle: {
        marginTop: ics.marginTop,
        paddingTop: ics.paddingTop,
        height: ics.height
      }
    };
  })()`;

  const res = await send('Runtime.evaluate', { expression: script, returnByValue: true });
  console.log(JSON.stringify(res.result?.value, null, 2));
  ws.close();
}

checkLiveSpacing().catch(console.error);

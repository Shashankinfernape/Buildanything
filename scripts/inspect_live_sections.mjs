import WebSocket from 'ws';

async function inspectSections() {
  const ws = new WebSocket('ws://127.0.0.1:9222/devtools/page/0CEBF5F820FA8AA89465BD16147DDED9');
  await new Promise(r => ws.onopen = r);
  let id = 1;
  const send = (method, params = {}) => new Promise((resolve) => {
    const curId = id++;
    const handler = (evt) => {
      const data = JSON.parse(evt.data);
      if (data.id === curId) {
        ws.removeEventListener('message', handler);
        resolve(data);
      }
    };
    ws.addEventListener('message', handler);
    ws.send(JSON.stringify({ id: curId, method, params }));
  });

  const res = await send('Runtime.evaluate', {
    expression: `(() => {
      const next = document.getElementById('__next');
      const pageWrapper = next.children[7].children[0];
      const c2 = pageWrapper.children[2];
      const c3 = pageWrapper.children[3];
      return {
        c2: {
          tag: c2.tagName,
          outerHTML: c2.outerHTML.slice(0, 300)
        },
        c3: {
          tag: c3.tagName,
          className: c3.className,
          rect: { y: Math.round(c3.getBoundingClientRect().y + window.scrollY), h: Math.round(c3.getBoundingClientRect().height) },
          firstChildren: Array.from(c3.children).map(c => ({
            tag: c.tagName,
            className: c.className,
            heading: c.querySelector('h1, h2, h3, h4')?.innerText || '',
            snippet: c.innerText ? c.innerText.slice(0, 100).replace(/\\n/g, ' ') : ''
          }))
        }
      };
    })()`,
    returnByValue: true
  });
  console.log('c2 and c3:', JSON.stringify(res.result?.result?.value, null, 2));

  // Also query all section elements in document
  const sectionsRes = await send('Runtime.evaluate', {
    expression: `(() => {
      const sections = Array.from(document.querySelectorAll('section')).map((el, idx) => ({
        index: idx,
        id: el.id,
        className: el.className,
        heading: el.querySelector('h1, h2, h3, h4')?.innerText || '',
        rect: { y: Math.round(el.getBoundingClientRect().y + window.scrollY), h: Math.round(el.getBoundingClientRect().height) },
        snippet: el.innerText ? el.innerText.slice(0, 100).replace(/\\n/g, ' ') : ''
      }));
      return sections;
    })()`,
    returnByValue: true
  });
  console.log('All sections:', JSON.stringify(sectionsRes.result?.result?.value, null, 2));

  ws.close();
}

inspectSections().catch(console.error);

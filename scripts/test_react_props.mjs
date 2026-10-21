import WebSocket from 'ws';

async function testReactProps() {
  const ws = new WebSocket('ws://127.0.0.1:9222/devtools/page/0CEBF5F820FA8AA89465BD16147DDED9');
  await new Promise(r => ws.onopen = r);
  let cid = 1;
  const send = (method, params = {}) => new Promise((resolve) => {
    const curId = cid++;
    const handler = (evt) => {
      const data = JSON.parse(evt.data);
      if (data.id === curId) {
        ws.removeEventListener('message', handler);
        resolve(data.result);
      }
    };
    ws.addEventListener('message', handler);
    ws.send(JSON.stringify({ id: curId, method, params }));
  });

  const res = await send('Runtime.evaluate', {
    expression: `(() => {
      const group = document.querySelector("header div[role='group']");
      if (!group) return { error: "No group found" };
      const keys = Object.keys(group);
      const propsKey = keys.find(k => k.startsWith('__reactProps'));
      const fiberKey = keys.find(k => k.startsWith('__reactFiber'));
      
      let props = null;
      if (propsKey) {
        props = Object.keys(group[propsKey]);
      }

      // Test calling onMouseEnter if present
      let triggered = false;
      if (propsKey && typeof group[propsKey].onMouseEnter === 'function') {
        group[propsKey].onMouseEnter();
        triggered = true;
      }

      return {
        keys,
        propsKey,
        fiberKey,
        props,
        triggered,
        stateAfter: group.getAttribute('data-state')
      };
    })()`,
    returnByValue: true
  });

  console.log('React Fiber/Props check:', res.result?.value);
  ws.close();
}

testReactProps();

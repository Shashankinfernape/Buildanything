import WebSocket from 'ws';

async function setWindow() {
  const ws = new WebSocket('ws://127.0.0.1:9222/devtools/page/0CEBF5F820FA8AA89465BD16147DDED9');
  await new Promise(r => ws.onopen = r);
  let id = 1;
  const send = (method, params = {}) => new Promise((resolve) => {
    const curId = id++;
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

  const win = await send('Browser.getWindowForTarget');
  console.log('Current window bounds:', win);

  const evalDims = await send('Runtime.evaluate', {
    expression: 'JSON.stringify([window.innerWidth, window.innerHeight])',
    returnByValue: true
  });
  const [innerWidth, innerHeight] = JSON.parse(evalDims.result.value);
  console.log('Current innerDims:', innerWidth, innerHeight);

  // Exact window bounds to make innerWidth 1440 and innerHeight 900
  const targetInnerW = 1440;
  const targetInnerH = 900;
  const diffW = targetInnerW - innerWidth;
  const diffH = targetInnerH - innerHeight;
  console.log('Adjusting window size by:', diffW, diffH);

  await send('Browser.setWindowBounds', {
    windowId: win.windowId,
    bounds: {
      width: win.bounds.width + diffW,
      height: win.bounds.height + diffH
    }
  });

  // Short pause for window resize to apply
  await new Promise(r => setTimeout(r, 500));

  const check = await send('Runtime.evaluate', {
    expression: 'JSON.stringify([window.innerWidth, window.innerHeight])',
    returnByValue: true
  });
  console.log('Final innerDims:', check.result.value);

  const finalWin = await send('Browser.getWindowForTarget');
  console.log('Final window bounds:', finalWin);

  ws.close();
}

setWindow().catch(console.error);

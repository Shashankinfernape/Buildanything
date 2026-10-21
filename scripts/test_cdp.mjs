import WebSocket from 'ws';

async function test() {
  const ws = new WebSocket('ws://127.0.0.1:9222/devtools/page/0CEBF5F820FA8AA89465BD16147DDED9');
  await new Promise((resolve, reject) => {
    ws.onopen = resolve;
    ws.onerror = reject;
  });

  let id = 1;
  const send = (method, params = {}) => new Promise((resolve, reject) => {
    const curId = id++;
    const timer = setTimeout(() => reject(new Error('Timeout ' + method)), 8000);
    const handler = (evt) => {
      const data = JSON.parse(evt.data);
      if (data.id === curId) {
        clearTimeout(timer);
        ws.removeEventListener('message', handler);
        resolve(data);
      }
    };
    ws.addEventListener('message', handler);
    ws.send(JSON.stringify({ id: curId, method, params }));
  });

  try {
    console.log('Bringing to front...');
    await send('Page.bringToFront');
    
    console.log('Evaluating document.title and readyState...');
    const res = await send('Runtime.evaluate', { expression: 'document.title + " | " + document.readyState' });
    console.log('Doc info:', JSON.stringify(res.result));

    console.log('Checking window bounds...');
    const bounds = await send('Browser.getWindowForTarget');
    console.log('Window bounds:', JSON.stringify(bounds));

    console.log('Testing Page.captureScreenshot directly via CDP...');
    const t0 = Date.now();
    const snap = await send('Page.captureScreenshot', { format: 'png' });
    console.log('Screenshot taken in', Date.now() - t0, 'ms! Data length:', snap.result?.data?.length);
  } catch (e) {
    console.error('Error:', e);
  } finally {
    ws.close();
  }
}

test();

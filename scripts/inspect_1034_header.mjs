import WebSocket from 'ws';

async function check1034() {
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

  console.log('Setting device metrics override to 1034x900 on Live...');
  await send('Emulation.setDeviceMetricsOverride', {
    width: 1034,
    height: 900,
    deviceScaleFactor: 1,
    mobile: false
  });

  const res = await send('Runtime.evaluate', {
    expression: `(() => {
      const h = document.querySelector("header");
      const nav = h.querySelector("nav");
      const mobileBtn = h.querySelector("button[aria-label='Open mobile navigation']");
      const desktopNav = h.querySelector("nav > div > div > div:nth-child(2)");
      const rightNav = h.querySelector("[data-cy='header-signup-button']")?.parentElement?.parentElement;
      const allVisible = Array.from(h.querySelectorAll("button, a")).map(b => ({
        tag: b.tagName,
        text: (b.innerText || "").split('\\n')[0].trim(),
        rect: {
          x: Math.round(b.getBoundingClientRect().x),
          y: Math.round(b.getBoundingClientRect().y),
          w: Math.round(b.getBoundingClientRect().width),
          h: Math.round(b.getBoundingClientRect().height)
        },
        visible: b.getBoundingClientRect().width > 0 && b.getBoundingClientRect().height > 0
      })).filter(x => x.visible);

      return {
        viewportWidth: window.innerWidth,
        headerHeight: Math.round(h.getBoundingClientRect().height),
        navPadding: window.getComputedStyle(nav).paddingLeft + " / " + window.getComputedStyle(nav).paddingRight,
        mobileButtonVisible: mobileBtn ? (mobileBtn.getBoundingClientRect().width > 0) : false,
        desktopNavDisplay: window.getComputedStyle(desktopNav).display,
        rightNavDisplay: window.getComputedStyle(rightNav).display,
        visibleItemsCount: allVisible.length,
        visibleItems: allVisible
      };
    })()`,
    returnByValue: true
  });

  console.log('=== LIVE HEADER AT 1034px ===');
  console.log(JSON.stringify(res.result?.value, null, 2));

  // Reset device metrics override
  await send('Emulation.clearDeviceMetricsOverride');
  ws.close();
}

check1034();

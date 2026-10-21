async function evalAt(width, height) {
  const res = await fetch('http://127.0.0.1:9222/json');
  const targets = await res.json();
  const target = targets.find(t => t.url && t.url.includes('replit.com') && t.type === 'page');
  
  const ws = new WebSocket(target.webSocketDebuggerUrl);
  await new Promise(r => ws.onopen = r);
  
  let id = 1;
  const send = (method, params) => new Promise(resolve => {
    const curId = id++;
    const handler = (event) => {
      const data = JSON.parse(event.data);
      if (data.id === curId) {
        ws.removeEventListener('message', handler);
        resolve(data.result);
      }
    };
    ws.addEventListener('message', handler);
    ws.send(JSON.stringify({ id: curId, method, params }));
  });

  await send('Emulation.setDeviceMetricsOverride', { width, height, deviceScaleFactor: 1, mobile: false });
  
  const evalRes = await send('Runtime.evaluate', {
    expression: `(() => {
      const header = document.querySelector("header");
      const rect = header.getBoundingClientRect();
      const desktopNav = header.querySelector("nav");
      const navLinks = Array.from(header.querySelectorAll("a, button")).map(el => ({
        text: el.innerText.trim(),
        role: el.getAttribute("role"),
        tag: el.tagName,
        ariaLabel: el.getAttribute("aria-label"),
        dataCy: el.getAttribute("data-cy"),
        visible: el.offsetParent !== null && window.getComputedStyle(el).display !== 'none'
      })).filter(x => x.text || x.ariaLabel);
      
      const hamburger = header.querySelector('[data-mobile-open] button, button[aria-label*="menu"]');
      const hamburgerVisible = hamburger ? (hamburger.offsetParent !== null && window.getComputedStyle(hamburger).display !== 'none') : false;

      return {
        headerHeight: rect.height,
        headerWidth: rect.width,
        hamburgerVisible,
        visibleItems: navLinks.filter(l => l.visible).map(l => l.text || l.ariaLabel)
      };
    })()`,
    returnByValue: true
  });
  ws.close();
  return evalRes.result.value;
}

async function run() {
  const at1440 = await evalAt(1440, 900);
  console.log('--- At 1440px Wide ---');
  console.log(JSON.stringify(at1440, null, 2));

  const at1034 = await evalAt(1034, 681);
  console.log('--- At 1034px Wide ---');
  console.log(JSON.stringify(at1034, null, 2));

  // Reset back to 1440
  await evalAt(1440, 900);
  console.log('Reset back to 1440.');
}

run().catch(console.error);

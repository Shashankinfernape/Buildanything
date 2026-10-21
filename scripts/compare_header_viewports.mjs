import fs from 'fs';

async function getReplitTarget() {
  const res = await fetch('http://127.0.0.1:9222/json');
  const targets = await res.json();
  const target = targets.find(t => t.url && t.url.includes('replit.com') && t.type === 'page');
  if (!target) throw new Error('Could not find replit.com target!');
  return target;
}

async function main() {
  const target = await getReplitTarget();
  console.log('Connecting to target:', target.id);
  const ws = new WebSocket(target.webSocketDebuggerUrl);

  let idCounter = 1;
  const pending = new Map();

  function sendCommand(method, params = {}) {
    return new Promise((resolve, reject) => {
      const id = idCounter++;
      pending.set(id, { resolve, reject });
      ws.send(JSON.stringify({ id, method, params }));
    });
  }

  ws.onmessage = (event) => {
    const data = JSON.parse(event.data);
    if (data.id && pending.has(data.id)) {
      const { resolve, reject } = pending.get(data.id);
      pending.delete(data.id);
      if (data.error) reject(data.error);
      else resolve(data.result);
    }
  };

  await new Promise((resolve) => {
    ws.onopen = resolve;
  });

  // Set viewport to 1440 x 900
  await sendCommand('Emulation.setDeviceMetricsOverride', {
    width: 1440,
    height: 900,
    deviceScaleFactor: 1,
    mobile: false
  });

  // Check header layout at 1440
  const eval1440 = await sendCommand('Runtime.evaluate', {
    expression: `(() => {
      const header = document.querySelector('header');
      const rect = header.getBoundingClientRect();
      const nav = header.querySelector('nav');
      const navLinks = Array.from(header.querySelectorAll('nav a, nav button')).map(el => ({
        text: el.innerText.trim(),
        visible: el.offsetParent !== null,
        box: el.getBoundingClientRect()
      }));
      const mobileToggle = header.querySelector('button[aria-label*="menu"], [data-mobile-open]');
      return {
        headerBox: { width: rect.width, height: rect.height },
        navLinksCount: navLinks.length,
        visibleNavLinks: navLinks.filter(l => l.visible).map(l => l.text),
        mobileToggleVisible: mobileToggle ? mobileToggle.offsetParent !== null : false
      };
    })()`,
    returnByValue: true
  });
  console.log('Header at 1440px:\n', JSON.stringify(eval1440.result.value, null, 2));

  // Test at 1034px
  await sendCommand('Emulation.setDeviceMetricsOverride', {
    width: 1034,
    height: 681,
    deviceScaleFactor: 1,
    mobile: false
  });

  const eval1034 = await sendCommand('Runtime.evaluate', {
    expression: `(() => {
      const header = document.querySelector('header');
      const rect = header.getBoundingClientRect();
      const navLinks = Array.from(header.querySelectorAll('nav a, nav button')).map(el => ({
        text: el.innerText.trim(),
        visible: el.offsetParent !== null,
        box: el.getBoundingClientRect()
      }));
      const mobileToggle = header.querySelector('button[aria-label*="menu"], [data-mobile-open]');
      return {
        headerBox: { width: rect.width, height: rect.height },
        navLinksCount: navLinks.length,
        visibleNavLinks: navLinks.filter(l => l.visible).map(l => l.text),
        mobileToggleVisible: mobileToggle ? mobileToggle.offsetParent !== null : false
      };
    })()`,
    returnByValue: true
  });
  console.log('Header at 1034px:\n', JSON.stringify(eval1034.result.value, null, 2));

  // Reset back to 1440 x 900
  await sendCommand('Emulation.setDeviceMetricsOverride', {
    width: 1440,
    height: 900,
    deviceScaleFactor: 1,
    mobile: false
  });
  console.log('Reset viewport override back to 1440 x 900.');

  ws.close();
}

main().catch(console.error);

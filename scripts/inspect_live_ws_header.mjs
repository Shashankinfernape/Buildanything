import CRI from 'chrome-remote-interface';

async function main() {
  const targets = await CRI.List({ port: 9222 });
  const liveTarget = targets.find(t => t.url.includes('DeficientPlumpMisrac'));
  if (!liveTarget) {
    console.error('No DeficientPlumpMisrac target found');
    return;
  }
  const client = await CRI({ target: liveTarget, port: 9222 });
  const { Runtime } = client;
  const res = await Runtime.evaluate({
    expression: `(() => {
      const el = document.querySelector('header') || document.querySelector('[role="banner"]');
      return el ? { html: el.outerHTML.slice(0, 500), rect: el.getBoundingClientRect() } : null;
    })()`,
    returnByValue: true
  });
  console.log('Header info:', JSON.stringify(res.result.value, null, 2));
  await client.close();
}

main().catch(console.error);

import WebSocket from 'ws';

const TARGET_ID = '4D5803D83D1C78981FF3E408A2F4B2D5';

async function main() {
  const ws = new WebSocket(`ws://127.0.0.1:9222/devtools/page/${TARGET_ID}`);
  await new Promise(r => ws.onopen = r);
  let cid = 1;
  const send = (m, p = {}) => new Promise(res => {
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

  const detailedInfo = await send('Runtime.evaluate', {
    expression: `(() => {
      const getStyles = (el) => {
        if (!el) return null;
        const s = window.getComputedStyle(el);
        const r = el.getBoundingClientRect();
        return {
          tag: el.tagName,
          className: el.className,
          rect: { x: r.x, y: r.y, w: r.width, h: r.height },
          bg: s.backgroundColor,
          color: s.color,
          border: s.border,
          borderRadius: s.borderRadius,
          fontFamily: s.fontFamily,
          fontSize: s.fontSize,
          padding: s.padding,
        };
      };

      const nav = document.querySelector('nav');
      const main = document.querySelector('main');
      const inputCard = document.querySelector('form') || document.querySelector('[role="textbox"]')?.closest('div') || document.querySelector('textarea')?.closest('div');
      const cards = Array.from(document.querySelectorAll('a, button, div')).filter(el => {
        const s = window.getComputedStyle(el);
        return s.borderWidth !== '0px' && el.clientWidth > 100 && el.clientHeight > 50;
      }).slice(0, 5);

      // Extract custom css variables
      const rootStyle = window.getComputedStyle(document.documentElement);
      const vars = {};
      for (let i = 0; i < rootStyle.length; i++) {
        const prop = rootStyle[i];
        if (prop.startsWith('--')) {
          vars[prop] = rootStyle.getPropertyValue(prop).trim();
        }
      }

      return {
        nav: getStyles(nav),
        main: getStyles(main),
        inputCard: getStyles(inputCard),
        sampleCards: cards.map(getStyles),
        cssVars: Object.keys(vars).filter(k => k.includes('color') || k.includes('bg') || k.includes('surface')).slice(0, 30).reduce((acc, k) => { acc[k] = vars[k]; return acc; }, {})
      };
    })()`,
    returnByValue: true
  });

  console.log('Detailed Live Replit Dark Theme inspection:', JSON.stringify(detailedInfo.result?.value, null, 2));
  ws.close();
}

main().catch(console.error);

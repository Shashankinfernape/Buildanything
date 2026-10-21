import WebSocket from 'ws';
import fs from 'fs';

const TARGET_ID = '4D5803D83D1C78981FF3E408A2F4B2D5';

async function main() {
  const ws = new WebSocket(`ws://127.0.0.1:9222/devtools/page/${TARGET_ID}`);
  await new Promise(r => ws.onopen = r);
  let cid = 1;
  const send = (m, p = {}) => new Promise(res => {
    const id = cid++;
    ws.on('message', function h(d) {
      const j = JSON.parse(d);
      if (j.id === id) { ws.removeListener('message', h); res(j.result); }
    });
    ws.send(JSON.stringify({ id, method: m, params: p }));
  });

  const liveData = await send('Runtime.evaluate', {
    expression: `(() => {
      const nav = document.querySelector('nav');
      const main = document.querySelector('main');

      function serializeEl(el, depth = 0) {
        if (!el || depth > 8) return null;
        const r = el.getBoundingClientRect();
        const s = window.getComputedStyle(el);
        return {
          tag: el.tagName,
          id: el.id || undefined,
          role: el.getAttribute('role') || undefined,
          ariaLabel: el.getAttribute('aria-label') || undefined,
          className: el.className || undefined,
          rect: { x: Math.round(r.x), y: Math.round(r.y), w: Math.round(r.width), h: Math.round(r.height) },
          styles: {
            display: s.display,
            flexDirection: s.flexDirection,
            justifyContent: s.justifyContent,
            alignItems: s.alignItems,
            bg: s.backgroundColor,
            color: s.color,
            fontSize: s.fontSize,
            fontWeight: s.fontWeight,
            border: s.border,
            borderRadius: s.borderRadius,
            padding: s.padding,
            margin: s.margin,
            boxShadow: s.boxShadow,
            background: s.background
          },
          text: el.childNodes.length === 1 && el.childNodes[0].nodeType === 3 ? el.textContent.trim() : undefined,
          children: Array.from(el.children).map(c => serializeEl(c, depth + 1))
        };
      }

      // Check bottom glow
      const glowEls = Array.from(document.querySelectorAll('div')).filter(d => {
        const bg = window.getComputedStyle(d).background;
        const bs = window.getComputedStyle(d).boxShadow;
        return (bg && (bg.includes('gradient') || bg.includes('radial') || bg.includes('rgb'))) || (bs && bs !== 'none');
      }).map(d => {
        const r = d.getBoundingClientRect();
        const s = window.getComputedStyle(d);
        return {
          rect: { x: Math.round(r.x), y: Math.round(r.y), w: Math.round(r.width), h: Math.round(r.height) },
          bg: s.background,
          className: d.className
        };
      }).filter(g => g.rect.y > 600);

      return {
        nav: serializeEl(nav),
        main: serializeEl(main),
        glowEls: glowEls.slice(0, 10),
        navOuterHTML: nav ? nav.outerHTML : null,
        mainOuterHTML: main ? main.outerHTML : null
      };
    })()`,
    returnByValue: true
  });

  const val = liveData.result?.value;
  fs.writeFileSync('work/analysis/signed_in/live_home_full_tree.json', JSON.stringify({ nav: val.nav, main: val.main, glow: val.glowEls }, null, 2), 'utf8');
  if (val.navOuterHTML) fs.writeFileSync('work/analysis/signed_in/live_nav_outer.html', val.navOuterHTML, 'utf8');
  if (val.mainOuterHTML) fs.writeFileSync('work/analysis/signed_in/live_main_outer.html', val.mainOuterHTML, 'utf8');

  console.log('Saved live_home_full_tree.json, live_nav_outer.html, live_main_outer.html');
  ws.close();
}

main().catch(console.error);

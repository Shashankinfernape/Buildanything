import WebSocket from 'ws';

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

  const res = await send('Runtime.evaluate', {
    expression: `(() => {
      const h1 = document.querySelector('h1');
      const h1Rect = h1 ? h1.getBoundingClientRect() : null;
      const centeredCol = h1 ? h1.closest('.banner-content-container') || h1.parentElement?.parentElement : null;
      const colRect = centeredCol ? centeredCol.getBoundingClientRect() : null;
      const colStyle = centeredCol ? window.getComputedStyle(centeredCol) : null;

      // Suggestion chips
      const chips = Array.from(document.querySelectorAll('button')).filter(b => {
        const t = b.textContent?.trim();
        return t === 'Help me get things done' || t === 'Find emails needing my reply' || t === 'Turn my notes into a slide deck';
      }).map(b => {
        const r = b.getBoundingClientRect();
        return { text: b.textContent.trim(), rect: { x: Math.round(r.x), y: Math.round(r.y), w: Math.round(r.width), h: Math.round(r.height) } };
      });

      // Prompt form
      const ta = document.querySelector('[role="textbox"]') || document.querySelector('textarea');
      const form = ta?.closest('div[class*="rounded"]');
      const formRect = form ? form.getBoundingClientRect() : null;
      const formStyle = form ? window.getComputedStyle(form) : null;

      return {
        h1Rect: h1Rect ? { x: Math.round(h1Rect.x), y: Math.round(h1Rect.y), w: Math.round(h1Rect.width), h: Math.round(h1Rect.height) } : null,
        colRect: colRect ? { x: Math.round(colRect.x), y: Math.round(colRect.y), w: Math.round(colRect.width), h: Math.round(colRect.height) } : null,
        colMaxWidth: colStyle?.maxWidth,
        colPadding: colStyle?.padding,
        chips,
        formRect: formRect ? { x: Math.round(formRect.x), y: Math.round(formRect.y), w: Math.round(formRect.width), h: Math.round(formRect.height) } : null,
        formBg: formStyle?.backgroundColor,
        formBorder: formStyle?.border,
        formShadow: formStyle?.boxShadow
      };
    })()`,
    returnByValue: true
  });

  console.log('Centered Column & Components Geometry:');
  console.log(JSON.stringify(res.result?.value, null, 2));
  ws.close();
}

main().catch(console.error);

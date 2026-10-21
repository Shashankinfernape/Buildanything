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
      const canvas = document.querySelector('canvas');
      const r = canvas ? canvas.getBoundingClientRect() : null;
      const s = canvas ? window.getComputedStyle(canvas) : null;
      
      // Also check background styling on the glow wrapper
      const glowWrap = canvas ? canvas.parentElement : null;
      const glowStyle = glowWrap ? window.getComputedStyle(glowWrap) : null;

      return {
        hasCanvas: !!canvas,
        canvasRect: r ? { x: Math.round(r.x), y: Math.round(r.y), w: Math.round(r.width), h: Math.round(r.height) } : null,
        canvasClasses: canvas?.className,
        glowWrapClasses: glowWrap?.className,
        glowWrapStyle: glowWrap ? {
          background: glowStyle.background,
          opacity: glowStyle.opacity,
          display: glowStyle.display
        } : null
      };
    })()`,
    returnByValue: true
  });

  console.log('Live Canvas / Glow result:', JSON.stringify(res.result?.value, null, 2));
  ws.close();
}

main().catch(console.error);

import WebSocket from 'ws';
import fs from 'fs';

const ws = new WebSocket('ws://127.0.0.1:9222/devtools/page/4D5803D83D1C78981FF3E408A2F4B2D5');
ws.on('open', () => {
  ws.send(JSON.stringify({
    id: 1,
    method: 'Runtime.evaluate',
    params: {
      expression: `(async () => {
        const styles = [];
        for (const el of document.querySelectorAll('link[rel=stylesheet], style')) {
          if (el.tagName === 'LINK') {
            try {
              const res = await fetch(el.href);
              const text = await res.text();
              styles.push({ type: 'link', href: el.href, css: text });
            } catch(e) {
              styles.push({ type: 'link-err', href: el.href, err: e.message });
            }
          } else {
            styles.push({ type: 'style', id: el.id, css: el.textContent });
          }
        }
        return styles;
      })()`,
      awaitPromise: true,
      returnByValue: true
    }
  }));
});

ws.on('message', data => {
  const msg = JSON.parse(data);
  if (msg.result?.result?.value) {
    const list = msg.result.result.value;
    fs.mkdirSync('work/analysis/signed_in/css', { recursive: true });
    let combinedCss = '';
    list.forEach((item, idx) => {
      console.log(`Extracted style ${idx}: ${item.type} (len: ${item.css?.length || 0})`);
      if (item.css) {
        fs.writeFileSync(`work/analysis/signed_in/css/style_${idx}.css`, item.css);
        combinedCss += `/* --- STYLE ${idx} (${item.type} ${item.href || item.id || ''}) --- */\n` + item.css + '\n\n';
      }
    });
    fs.writeFileSync('work/analysis/signed_in/css/all_live_styles.css', combinedCss);
    console.log(`Saved combined CSS (total length: ${combinedCss.length})`);
    process.exit(0);
  } else {
    console.error('Error or no result:', msg);
    process.exit(1);
  }
});

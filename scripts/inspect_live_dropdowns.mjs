import WebSocket from 'ws';
import fs from 'fs';

async function inspectDropdowns() {
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

  const menus = ['Products', 'Solutions', 'Resources'];
  const results = {};

  for (let i = 0; i < menus.length; i++) {
    const name = menus[i];
    console.log(`\n--- Inspecting ${name} in Live ---`);
    
    // Open dropdown via onMouseEnter
    const openRes = await send('Runtime.evaluate', {
      expression: `(async () => {
        const groups = Array.from(document.querySelectorAll("header div[role='group']"));
        const grp = groups[${i}];
        const propsKey = Object.keys(grp).find(k => k.startsWith('__reactProps'));
        grp[propsKey].onMouseEnter();
        await new Promise(r => setTimeout(r, 400));
        
        const btn = grp.querySelector("button");
        const panel = grp.querySelector("[id*='marketing-header-panel']");
        const content = panel ? panel.parentElement : null;

        return {
          name: "${name}",
          groupDataState: grp.getAttribute('data-state'),
          groupClasses: grp.className,
          buttonAriaExpanded: btn ? btn.getAttribute('aria-expanded') : null,
          contentDataState: content ? content.getAttribute('data-state') : null,
          contentClasses: content ? content.className : null,
          contentStyle: content ? content.getAttribute('style') : null,
          panelAriaHidden: panel ? panel.getAttribute('aria-hidden') : null,
          panelId: panel ? panel.id : null,
          panelOuterHtml: panel ? panel.outerHTML : null,
          contentOuterHtml: content ? content.outerHTML : null
        };
      })()`,
      awaitPromise: true,
      returnByValue: true
    });

    results[name] = openRes.result.value;
    console.log(`${name} open state:`, {
      groupDataState: results[name].groupDataState,
      buttonAriaExpanded: results[name].buttonAriaExpanded,
      contentDataState: results[name].contentDataState,
      contentClasses: results[name].contentClasses,
      panelAriaHidden: results[name].panelAriaHidden
    });

    // Close dropdown via onMouseLeave
    await send('Runtime.evaluate', {
      expression: `(async () => {
        const groups = Array.from(document.querySelectorAll("header div[role='group']"));
        const grp = groups[${i}];
        const propsKey = Object.keys(grp).find(k => k.startsWith('__reactProps'));
        grp[propsKey].onMouseLeave();
        await new Promise(r => setTimeout(r, 300));
      })()`,
      awaitPromise: true
    });
  }

  fs.writeFileSync('work/analysis/live-open-dropdowns-evidence.json', JSON.stringify(results, null, 2), 'utf8');
  console.log('\nSaved all 3 open dropdown DOM snapshots to work/analysis/live-open-dropdowns-evidence.json');
  ws.close();
}

inspectDropdowns();

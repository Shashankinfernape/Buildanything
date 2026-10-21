import WebSocket from 'ws';

async function checkHeight() {
  async function inspect(targetId, label) {
    const ws = new WebSocket(`ws://127.0.0.1:9222/devtools/page/${targetId}`);
    await new Promise(r => ws.onopen = r);
    let id = 1;
    const send = (method, params = {}) => new Promise((resolve) => {
      const curId = id++;
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

    const res = await send('Runtime.evaluate', {
      expression: `(() => {
        const tplSection = document.querySelector('[data-analytics-id="template_filter_chip_list"]')?.closest('.flex.box-border.min-h-0.min-w-0.border-0.border-solid.view-outline-none.flex-col.justify-logical-start.items-stretch.shrink-0.w-full.px-0');
        const gridContainer = tplSection?.querySelector('.relative.w-full.overflow-hidden');
        return {
          sectionRect: tplSection?.getBoundingClientRect(),
          gridContainerRect: gridContainer?.getBoundingClientRect(),
          gridContainerComputed: gridContainer ? {
            maxHeight: getComputedStyle(gridContainer).maxHeight,
            height: getComputedStyle(gridContainer).height
          } : null
        };
      })()`,
      returnByValue: true
    });

    console.log(`${label}:`, JSON.stringify(res.result?.value, null, 2));
    ws.close();
  }

  await inspect('0CEBF5F820FA8AA89465BD16147DDED9', 'LIVE');
  await inspect('A7DF9577D21FF635BD6EF295E92FAEC1', 'RECON');
}

checkHeight().catch(console.error);

import WebSocket from 'ws';
import fs from 'fs';

async function main() {
  const tabs = await fetch('http://127.0.0.1:9222/json').then(r => r.json());
  const liveTab = tabs.find(t => t.id === '4D5803D83D1C78981FF3E408A2F4B2D5');
  const reconTab = tabs.find(t => t.id === '6D4B931B5EC0B7BE74E378FA2E19EDD9');

  const getSidebarNodes = `(() => {
    const nav = document.querySelector('nav');
    const nodes = [];
    const walk = (node, depth = 0) => {
      if (!node || depth > 5) return;
      const r = node.getBoundingClientRect();
      const text = node.innerText?.trim();
      if ((node.tagName === 'BUTTON' || node.tagName === 'A' || node.getAttribute('role') === 'button' || (node.children?.length === 0 && text)) && r.width > 0 && r.height > 0) {
        nodes.push({
          tag: node.tagName,
          text: text?.slice(0, 30),
          rect: { x: Math.round(r.x), y: Math.round(r.y), w: Math.round(r.width), h: Math.round(r.height) },
          bg: window.getComputedStyle(node).backgroundColor,
          color: window.getComputedStyle(node).color
        });
      }
      for (const child of node.children || []) walk(child, depth + 1);
    };
    walk(nav);
    return nodes;
  })()`;

  async function evalTab(tab, expr) {
    return new Promise(res => {
      const ws = new WebSocket(tab.webSocketDebuggerUrl);
      ws.on('open', () => {
        ws.send(JSON.stringify({ id: 1, method: 'Page.bringToFront' }));
        setTimeout(() => ws.send(JSON.stringify({ id: 2, method: 'Runtime.evaluate', params: { expression: expr, returnByValue: true } })), 100);
      });
      ws.on('message', d => {
        const m = JSON.parse(d);
        if (m.id === 2) { ws.close(); res(m.result?.result?.value); }
      });
    });
  }

  console.log('--- LIVE SIDEBAR NODES ---');
  console.log(JSON.stringify(await evalTab(liveTab, getSidebarNodes), null, 2));

  console.log('--- RECON SIDEBAR NODES ---');
  console.log(JSON.stringify(await evalTab(reconTab, getSidebarNodes), null, 2));
}

main();

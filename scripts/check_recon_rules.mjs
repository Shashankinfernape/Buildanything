import WebSocket from 'ws';

async function main() {
  const tabs = await fetch('http://127.0.0.1:9222/json').then(r => r.json());
  const tab = tabs.find(t => t.id === '6D4B931B5EC0B7BE74E378FA2E19EDD9');
  const ws = new WebSocket(tab.webSocketDebuggerUrl);
  ws.on('open', () => {
    ws.send(JSON.stringify({
      id: 1,
      method: 'Runtime.evaluate',
      params: {
        expression: '(() => { const el = document.querySelector(".w-\\\\[752px\\\\]"); return { parentWidth: el.parentElement.clientWidth, hasW: el.offsetWidth, styleWidth: el.style.width, matchedRules: Array.from(document.styleSheets).flatMap(s => { try { return Array.from(s.cssRules).filter(r => r.selectorText && el.matches(r.selectorText)).map(r => r.cssText); } catch(e) { return []; } }) }; })()',
        returnByValue: true
      }
    }));
  });
  ws.on('message', data => {
    console.log(JSON.parse(data).result?.result?.value);
    ws.close();
  });
}
main();

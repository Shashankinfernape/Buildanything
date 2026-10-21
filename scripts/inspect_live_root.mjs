import WebSocket from 'ws';

const ws = new WebSocket('ws://127.0.0.1:9222/devtools/page/4D5803D83D1C78981FF3E408A2F4B2D5');
ws.on('open', () => {
  ws.send(JSON.stringify({
    id: 1,
    method: 'Runtime.evaluate',
    params: {
      expression: `({
        htmlClass: document.documentElement.className,
        htmlStyle: document.documentElement.getAttribute('style'),
        bodyClass: document.body.className,
        bodyStyle: document.body.getAttribute('style'),
        computedRoot: {
          bg: getComputedStyle(document.body).backgroundColor,
          color: getComputedStyle(document.body).color,
          fontFamily: getComputedStyle(document.body).fontFamily
        },
        layoutContainer: (() => {
          const main = document.querySelector('main');
          return {
            mainParentClass: main?.parentElement?.className,
            mainParentStyle: main?.parentElement?.getAttribute('style'),
            mainClass: main?.className,
            mainStyle: main?.getAttribute('style'),
            navParentClass: document.querySelector('nav')?.parentElement?.className
          };
        })()
      })`,
      returnByValue: true
    }
  }));
});

ws.on('message', data => {
  console.log(JSON.stringify(JSON.parse(data).result.result.value, null, 2));
  process.exit(0);
});

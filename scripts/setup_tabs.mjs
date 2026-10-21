import WebSocket from 'ws';
import http from 'http';

function getTargets() {
  return new Promise((resolve, reject) => {
    http.get('http://127.0.0.1:9222/json', (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(JSON.parse(data)));
    }).on('error', reject);
  });
}

function createTab(url) {
  return new Promise((resolve, reject) => {
    const req = http.request(`http://127.0.0.1:9222/json/new?${encodeURIComponent(url)}`, { method: 'PUT' }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(JSON.parse(data)));
    });
    req.on('error', reject);
    req.end();
  });
}

async function run() {
  let targets = await getTargets();
  let reconTab = targets.find(t => t.url.includes('5174'));
  if (!reconTab) {
    console.log('Opening new tab for reconstruction...');
    reconTab = await createTab('http://127.0.0.1:5174/');
  }
  let liveTab = targets.find(t => t.url.includes('replit.com'));
  console.log('Live Tab:', liveTab?.id, liveTab?.url);
  console.log('Recon Tab:', reconTab?.id, reconTab?.url);
}

run().catch(console.error);

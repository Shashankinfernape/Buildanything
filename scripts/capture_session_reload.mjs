import { spawn, execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

function getReplitTargetId() {
  const res = execSync('rea list-browser-targets http://127.0.0.1:9222 --format json', { encoding: 'utf8' });
  const data = JSON.parse(res);
  const targets = data.normalized_result?.targets || [];
  const target = targets.find(t => t.url && t.url.includes('replit.com'));
  if (!target) {
    throw new Error('Could not find replit.com target in Chrome CDP!');
  }
  return target.target_id;
}

const TARGET_ID = getReplitTargetId();
const OUTPUT_FILE = path.resolve('work/target_artifacts/replit/reload-session.json');

console.log(`Starting observe-web-session for target ${TARGET_ID}...`);

const reaCmd = process.platform === 'win32' ? 'rea.cmd' : 'rea';
const reaProc = spawn(reaCmd, [
  'observe-web-session',
  'http://127.0.0.1:9222',
  TARGET_ID,
  '--allowed-origins', 'https://replit.com',
  '--allowed-origins', 'https://cdn.replit.com',
  '--allowed-origins', 'https://cdnimg.replit.com',
  '--allowed-origins', 'https://cdn.sanity.io',
  '--observation-ms', '10000',
  '--format', 'json'
], {
  shell: true
});

let stdoutData = '';
let stderrData = '';

reaProc.stdout.on('data', (d) => {
  stdoutData += d.toString();
});
reaProc.stderr.on('data', (d) => {
  stderrData += d.toString();
});

// Trigger reload after 1.5 seconds via CDP HTTP or WebSocket
setTimeout(async () => {
  console.log('Connecting to WebSocket to reload page...');
  try {
    const ws = new WebSocket(`ws://127.0.0.1:9222/devtools/page/${TARGET_ID}`);
    ws.onopen = () => {
      console.log('WebSocket opened, sending Page.reload...');
      ws.send(JSON.stringify({ id: 101, method: 'Page.reload' }));
      setTimeout(() => ws.close(), 1000);
    };
    ws.onerror = (e) => console.log('WebSocket error:', e.message);
  } catch (e) {
    console.log('Error triggering reload:', e.message);
  }
}, 1500);

reaProc.on('close', (code) => {
  console.log(`observe-web-session exited with code ${code}`);
  if (stdoutData.trim().length > 0) {
    fs.writeFileSync(OUTPUT_FILE, stdoutData, 'utf8');
    console.log(`Saved reload-session.json (${stdoutData.length} bytes)`);
  } else {
    console.error('stderr:', stderrData);
  }
});

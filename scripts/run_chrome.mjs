import { spawn } from 'child_process';

console.log('Spawning Chrome 1440x900 on 9222...');
const proc = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
  '--remote-debugging-port=9222',
  '--remote-debugging-address=127.0.0.1',
  '--user-data-dir=C:\\replit-rea-profile',
  '--window-size=1440,900',
  'https://replit.com/'
]);

proc.stdout.on('data', d => process.stdout.write(d));
proc.stderr.on('data', d => process.stderr.write(d));
proc.on('exit', (code) => console.log('Chrome exited with code:', code));

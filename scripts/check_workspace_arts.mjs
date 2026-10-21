import fs from 'fs';

const live = JSON.parse(fs.readFileSync('work/captures/live_workspace_art.json'));
const recon = JSON.parse(fs.readFileSync('work/captures/recon_workspace_art.json'));

const liveBuf = Buffer.from(live.data_base64, 'base64');
const reconBuf = Buffer.from(recon.data_base64, 'base64');

console.log('Live bytes :', liveBuf.length);
console.log('Recon bytes:', reconBuf.length);

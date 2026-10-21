import fs from 'fs';
import { PNG } from 'pngjs'; // or check via canvas / pixel diff

// Let's check pixel differences between work/analysis/screens/live_workspace_settings.png and work/analysis/screens/recon_workspace_settings.png
const bufLive = fs.readFileSync('work/analysis/screens/live_workspace_settings.png');
const bufRecon = fs.readFileSync('work/analysis/screens/recon_workspace_settings.png');

console.log('Live size:', bufLive.length, 'Recon size:', bufRecon.length);

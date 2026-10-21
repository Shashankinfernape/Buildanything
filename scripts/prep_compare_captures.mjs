import { execSync } from 'child_process';
import fs from 'fs';

const live = JSON.parse(fs.readFileSync('work/target_artifacts/replit/page-capture.json', 'utf8'));
const recon = JSON.parse(fs.readFileSync('work/target_artifacts/replit/recon-page-capture.json', 'utf8'));

// Format expected by compare_web_captures: scenario or normalized_result
fs.writeFileSync('work/target_artifacts/replit/live-normalized.json', JSON.stringify(live.normalized_result || live, null, 2), 'utf8');
fs.writeFileSync('work/target_artifacts/replit/recon-normalized.json', JSON.stringify(recon.normalized_result || recon, null, 2), 'utf8');

console.log('Normalized capture files prepared.');

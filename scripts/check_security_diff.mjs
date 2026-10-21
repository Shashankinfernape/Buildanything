import fs from 'fs';
import { execSync } from 'child_process';

const out = execSync(`rea compare-web-screenshots "work/captures/live_security_art.json" "work/captures/recon_security_art.json" --channel-threshold 5 --format json --filter-output normalized_result`, { encoding: 'utf8' });
console.log('SECURITY REA COMPARISON:');
console.log(JSON.parse(out).normalized_result);

import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

const WORK_DIR = path.resolve('work');
const CSS_DIR = path.join(WORK_DIR, 'target_artifacts', 'replit', 'css');
const ASSETS_DIR = path.join(WORK_DIR, 'target_artifacts', 'replit', 'assets');
const ANALYSIS_DIR = path.join(WORK_DIR, 'analysis');
const LEDGER_PATH = path.join(ANALYSIS_DIR, 'evidence-ledger.md');

fs.mkdirSync(CSS_DIR, { recursive: true });
fs.mkdirSync(ASSETS_DIR, { recursive: true });
fs.mkdirSync(ANALYSIS_DIR, { recursive: true });

const ALLOWED_ORIGINS = [
  'https://replit.com',
  'https://cdn.replit.com',
  'https://cdnimg.replit.com',
  'https://cdn.sanity.io'
];

const urls = new Set();

function extractUrls(filePath) {
  if (!fs.existsSync(filePath)) return;
  console.log(`Scanning ${filePath}...`);
  const content = fs.readFileSync(filePath, 'utf8');
  const regex = /https:\/\/(replit\.com|cdn\.replit\.com|cdnimg\.replit\.com|cdn\.sanity\.io)[^\s"'\`\\]+/g;
  let match;
  while ((match = regex.exec(content)) !== null) {
    let u = match[0];
    // Clean trailing punctuation if any
    u = u.replace(/[,;)]+$/, '');
    urls.add(u);
  }
}

extractUrls(path.join(WORK_DIR, 'target_artifacts', 'replit', 'page-capture.json'));
extractUrls(path.join(WORK_DIR, 'target_artifacts', 'replit', 'reload-session.json'));
extractUrls(path.join(WORK_DIR, 'exported-scripts', 'manifest.json'));

console.log(`Found ${urls.size} unique candidate URLs across all origins.`);

const cssUrls = [];
const mediaUrls = [];

for (const u of urls) {
  const clean = u.split('?')[0];
  if (clean.endsWith('.css')) {
    cssUrls.push(u);
  } else if (/\.(woff2|woff|ttf|png|jpg|jpeg|webp|svg|mp4|webm|riv|gif|ico)$/i.test(clean) || u.includes('/cdn-cgi/image/')) {
    mediaUrls.push(u);
  }
}

console.log(`Identified ${cssUrls.length} CSS stylesheets and ${mediaUrls.length} media assets.`);

async function downloadFile(url, destPath) {
  try {
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });
    if (!res.ok) {
      console.warn(`Failed (${res.status}): ${url}`);
      return null;
    }
    const buf = Buffer.from(await res.arrayBuffer());
    fs.writeFileSync(destPath, buf);
    const hash = crypto.createHash('sha256').update(buf).digest('hex');
    return { url, destPath, hash, size: buf.length };
  } catch (err) {
    console.warn(`Error downloading ${url}:`, err.message);
    return null;
  }
}

async function main() {
  const ledgerEntries = [];
  ledgerEntries.push('# Evidence Ledger — Replit Ground Truth Assets\n\n');
  ledgerEntries.push('| Resource URL | Local File | SHA-256 Digest | Size (Bytes) |\n');
  ledgerEntries.push('| :--- | :--- | :--- | :--- |\n');

  console.log('\n--- Downloading CSS Stylesheets ---');
  for (const url of cssUrls) {
    const fname = path.basename(url.split('?')[0]);
    const dest = path.join(CSS_DIR, fname);
    console.log(`Downloading CSS: ${fname}`);
    const res = await downloadFile(url, dest);
    if (res) {
      ledgerEntries.push(`| \`${res.url}\` | \`css/${fname}\` | \`${res.hash}\` | ${res.size} |\n`);
    }
  }

  console.log('\n--- Downloading Media & Fonts ---');
  for (const url of mediaUrls) {
    const clean = url.split('?')[0];
    const base = path.basename(clean) || 'asset';
    const urlHash = crypto.createHash('sha256').update(url).digest('hex').substring(0, 12);
    const fname = `${urlHash}_${base}`;
    const dest = path.join(ASSETS_DIR, fname);
    console.log(`Downloading Media: ${fname} (${url})`);
    const res = await downloadFile(url, dest);
    if (res) {
      ledgerEntries.push(`| \`${res.url}\` | \`assets/${fname}\` | \`${res.hash}\` | ${res.size} |\n`);
    }
  }

  fs.writeFileSync(LEDGER_PATH, ledgerEntries.join(''), 'utf8');
  console.log(`\n✓ Evidence ledger written to ${LEDGER_PATH}`);
}

main().catch(console.error);

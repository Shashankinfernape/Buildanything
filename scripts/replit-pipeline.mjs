import { execSync, spawn } from 'child_process';
import fs from 'fs';
import path from 'path';

const ROOT_DIR = process.cwd();
const WORK_DIR = path.join(ROOT_DIR, 'work');
const CAPTURES_DIR = path.join(WORK_DIR, 'captures');
const EXPORTED_SCRIPTS_DIR = path.join(WORK_DIR, 'exported-scripts');
const ASSETS_CSS_DIR = path.join(WORK_DIR, 'assets', 'css');
const ASSETS_MEDIA_DIR = path.join(WORK_DIR, 'assets', 'media');
const ANALYSIS_DIR = path.join(WORK_DIR, 'analysis');

const ALLOWED_ORIGINS = [
  'https://replit.com',
  'https://cdn.replit.com',
  'https://cdnimg.replit.com',
  'https://cdn.sanity.io'
];

function ensureDir(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

ensureDir(CAPTURES_DIR);
ensureDir(ASSETS_CSS_DIR);
ensureDir(ASSETS_MEDIA_DIR);
ensureDir(ANALYSIS_DIR);

function runCommandAndSave(cmd, outputPath) {
  console.log(`Running: ${cmd}`);
  const stdout = execSync(cmd, {
    maxBuffer: 200 * 1024 * 1024,
    encoding: 'utf8'
  });
  if (outputPath) {
    fs.writeFileSync(outputPath, stdout, 'utf8');
  }
  return stdout;
}

async function getReplitTarget() {
  const res = execSync('rea list-browser-targets http://127.0.0.1:9222 --format json', { encoding: 'utf8' });
  const data = JSON.parse(res);
  const targets = data.normalized_result?.targets || [];
  const target = targets.find(t => t.url && t.url.includes('replit.com'));
  if (!target) {
    throw new Error('Could not find replit.com target in Chrome CDP!');
  }
  return target;
}

async function phase1() {
  console.log('=== Phase 1: Live CDP Capture & Export ===');
  const target = await getReplitTarget();
  const targetId = target.target_id;
  console.log(`Target ID: ${targetId} (${target.title})`);

  // 1.2 Screenshot capture
  console.log('\n[1.2] Capturing baseline screenshot Evidence...');
  const screenshotEvidencePath = path.join(CAPTURES_DIR, 'live-screenshot-evidence.json');
  const screenshotArtifactPath = path.join(CAPTURES_DIR, 'live-screenshot-artifact.json');
  
  const screenshotOut = runCommandAndSave(
    `rea capture-web-screenshot http://127.0.0.1:9222 ${targetId} --format json`,
    screenshotEvidencePath
  );
  
  const screenshotEvidence = JSON.parse(screenshotOut);
  const artifact = screenshotEvidence.normalized_result?.artifact;
  fs.writeFileSync(screenshotArtifactPath, JSON.stringify(artifact, null, 2), 'utf8');
  console.log(`✓ Screenshot captured. Evidence ID: ${screenshotEvidence.evidence_id}`);
  console.log(`✓ Artifact saved to ${screenshotArtifactPath}`);

  // 1.3 Inspect web page
  console.log('\n[1.3] Inspecting web page (DOM, accessibility, script sources, JSON body shapes)...');
  const livePageCapturePath = path.join(CAPTURES_DIR, 'live-page-capture.json');
  const originArgs = ALLOWED_ORIGINS.map(o => `--allowed-origins ${o}`).join(' ');
  const inspectCmd = `rea inspect-web-page http://127.0.0.1:9222 ${targetId} ${originArgs} --include-accessibility-text --include-json-body-shapes --include-script-sources --format json`;
  
  runCommandAndSave(inspectCmd, livePageCapturePath);
  console.log(`✓ Page inspection saved to ${livePageCapturePath}`);

  // 1.3 Export scripts
  console.log('\n[1.3] Exporting web scripts to disk...');
  if (fs.existsSync(EXPORTED_SCRIPTS_DIR)) {
    fs.rmSync(EXPORTED_SCRIPTS_DIR, { recursive: true, force: true });
  }
  const exportReportPath = path.join(CAPTURES_DIR, 'export-scripts-report.json');
  const exportCmd = `rea export-web-scripts "${livePageCapturePath}" "${EXPORTED_SCRIPTS_DIR}" --format json`;
  runCommandAndSave(exportCmd, exportReportPath);
  console.log(`✓ Web scripts exported to ${EXPORTED_SCRIPTS_DIR}`);

  // 1.3 Analyze web bundle
  console.log('\n[1.3] Analyzing web bundle...');
  const bundleSummaryPath = path.join(CAPTURES_DIR, 'web-bundle-summary.json');
  const bundleCmd = `rea analyze-web-bundle http://127.0.0.1:9222 ${targetId} --allowed-origins https://replit.com --allowed-origins https://cdn.replit.com --fetch-source-maps --format json`;
  runCommandAndSave(bundleCmd, bundleSummaryPath);
  console.log(`✓ Web bundle summary saved to ${bundleSummaryPath}`);
}

phase1().catch(err => {
  console.error('Error during Phase 1:', err);
  process.exit(1);
});

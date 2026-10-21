import { execSync } from 'child_process';
import path from 'path';
import fs from 'fs';

const ROOT_DIR = process.cwd();
const TARGET_ID = '4D5803D83D1C78981FF3E408A2F4B2D5';

const CAPTURES_DIR = path.join(ROOT_DIR, 'work', 'captures');
const EXPORTED_DIR = path.join(ROOT_DIR, 'work', 'exported-scripts-signed-in');

if (!fs.existsSync(CAPTURES_DIR)) fs.mkdirSync(CAPTURES_DIR, { recursive: true });
if (fs.existsSync(EXPORTED_DIR)) fs.rmSync(EXPORTED_DIR, { recursive: true, force: true });
// Do not create EXPORTED_DIR - REA requires absent directory

async function main() {
  console.log('=== Step 1: Running rea inspect-web-page via REA CLI ===');
  const inspectOutPath = path.join(CAPTURES_DIR, 'signed_in_page_capture.json');
  const inspectCmd = `rea inspect-web-page http://127.0.0.1:9222 ${TARGET_ID} --allowed-origins https://replit.com --allowed-origins https://cdn.replit.com --include-accessibility-text --include-json-body-shapes --include-script-sources --format json`;
  
  console.log(`Executing: ${inspectCmd}`);
  const inspectStdout = execSync(inspectCmd, {
    maxBuffer: 200 * 1024 * 1024,
    encoding: 'utf8'
  });
  fs.writeFileSync(inspectOutPath, inspectStdout, 'utf8');
  console.log(`✓ Saved ${inspectOutPath} (bytes: ${inspectStdout.length})`);

  console.log('\n=== Step 2: Running rea export-web-scripts via REA CLI ===');
  const exportReportPath = path.join(CAPTURES_DIR, 'export_signed_in_scripts_report.json');
  const exportCmd = `rea export-web-scripts "${inspectOutPath}" "${EXPORTED_DIR}" --format json`;
  
  console.log(`Executing: ${exportCmd}`);
  const exportStdout = execSync(exportCmd, {
    maxBuffer: 200 * 1024 * 1024,
    encoding: 'utf8'
  });
  fs.writeFileSync(exportReportPath, exportStdout, 'utf8');
  console.log(`✓ Scripts exported to ${EXPORTED_DIR}`);

  const exportParsed = JSON.parse(exportStdout);
  console.log('Export summary:', {
    scripts_exported: exportParsed.normalized_result?.exported_count || exportParsed.normalized_result?.scripts?.length,
    manifest: exportParsed.normalized_result?.manifest_path
  });

  console.log('\n=== Step 3: Running rea analyze-web-bundle via REA CLI ===');
  const bundleSummaryPath = path.join(CAPTURES_DIR, 'signed_in_web_bundle_summary.json');
  const bundleCmd = `rea analyze-web-bundle http://127.0.0.1:9222 ${TARGET_ID} --allowed-origins https://replit.com --allowed-origins https://cdn.replit.com --format json`;
  
  console.log(`Executing: ${bundleCmd}`);
  try {
    const bundleStdout = execSync(bundleCmd, {
      maxBuffer: 200 * 1024 * 1024,
      encoding: 'utf8'
    });
    fs.writeFileSync(bundleSummaryPath, bundleStdout, 'utf8');
    console.log(`✓ Web bundle summary saved to ${bundleSummaryPath}`);
  } catch (err) {
    console.warn('Bundle analysis notice:', err.message);
  }
}

main().catch(console.error);

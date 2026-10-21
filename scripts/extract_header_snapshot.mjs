import fs from 'fs';

const html = fs.readFileSync('work/target_artifacts/replit/live-rendered-snapshot.html', 'utf8');

// Look for <header or <nav
const headerMatch = html.match(/<header[\s\S]*?<\/header>/i);
if (headerMatch) {
  console.log('Found <header> tag! Length:', headerMatch[0].length);
  fs.writeFileSync('work/analysis/section1-header-snapshot.html', headerMatch[0], 'utf8');
} else {
  console.log('No <header> tag found directly, searching for nav or topbar...');
  const navMatch = html.match(/<nav[\s\S]*?<\/nav>/i);
  if (navMatch) {
    console.log('Found <nav> tag! Length:', navMatch[0].length);
    fs.writeFileSync('work/analysis/section1-header-snapshot.html', navMatch[0], 'utf8');
  }
}

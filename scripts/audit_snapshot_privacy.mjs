import fs from 'fs';

const html = fs.readFileSync('work/target_artifacts/replit/live-rendered-snapshot.html', 'utf8');

console.log('Auditing live-rendered-snapshot.html for sensitive data...');

const checks = [
  { name: 'Bearer Token', regex: /bearer\s+[a-zA-Z0-9_\-\.]{15,}/i },
  { name: 'JWT Token', regex: /eyJ[a-zA-Z0-9_\-]{10,}\.eyJ[a-zA-Z0-9_\-]{10,}\.[a-zA-Z0-9_\-]{10,}/ },
  { name: 'API Key', regex: /api[_-]?key["'\s:=]+[a-zA-Z0-9_\-]{16,}/i },
  { name: 'Private Key', regex: /-----BEGIN [A-Z ]+ PRIVATE KEY-----/ },
  { name: 'Cookie string', regex: /connect\.sid|session_id|remember_token/i },
  { name: 'Personal User ID', regex: /"userId":\s*"\d+"|user_id=\d+/i },
  { name: 'Client ID / App Key', regex: /client[_-]?id["'\s:=]+[a-zA-Z0-9_\-]{16,}/i }
];

let foundFindings = [];
for (const check of checks) {
  const match = html.match(check.regex);
  if (match) {
    foundFindings.push({ name: check.name, match: match[0].slice(0, 40) + '...' });
  }
}

console.log('Findings:', foundFindings);

// Check if gitignore excludes work/target_artifacts
const gitignore = fs.existsSync('.gitignore') ? fs.readFileSync('.gitignore', 'utf8') : '';
console.log('.gitignore exists:', fs.existsSync('.gitignore'));
console.log('work/ in .gitignore?:', gitignore.includes('work') || gitignore.includes('target_artifacts'));

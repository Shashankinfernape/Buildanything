import fs from 'fs';

const ev = JSON.parse(fs.readFileSync('work/captures/page_workspace_settings_evidence.json', 'utf8'));
const nodes = ev.normalized_result?.accessibility?.nodes || [];

const interesting = nodes.filter(n => n.name?.includes('Workspace') || n.name?.includes('Back') || n.name?.includes('Export'));
interesting.forEach(n => {
  console.log(`Role: ${n.role}, Name: "${n.name}"`);
});

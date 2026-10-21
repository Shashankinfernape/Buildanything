import fs from 'fs';

const ev = JSON.parse(fs.readFileSync('work/captures/page_workspace_settings_evidence.json', 'utf8'));

// Look for elements in evidence or tree
console.log('Title in evidence:', ev.normalized_result?.title);
console.log('URL in evidence:', ev.normalized_result?.url);

// Check if accessibility tree has bounds
const axNodes = ev.normalized_result?.accessibility_tree?.nodes || [];
console.log('Total ax nodes:', axNodes.length);
const mainNode = axNodes.find(n => n.role === 'main' || n.name === 'Settings' || n.name === 'Workspace overview');
console.log('Main node:', mainNode);

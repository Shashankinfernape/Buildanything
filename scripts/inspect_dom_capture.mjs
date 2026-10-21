import fs from 'fs';
import path from 'path';

const CAPTURE_FILE = path.resolve('work/target_artifacts/replit/page-capture.json');
const cap = JSON.parse(fs.readFileSync(CAPTURE_FILE, 'utf8'));

console.log('DOM total nodes:', cap.normalized_result?.dom?.total_nodes);
const nodes = cap.normalized_result?.dom?.nodes || [];

// Look for svg nodes or specific texts
let svgCount = 0;
for (const n of nodes) {
  if (n.node_name === 'svg' || n.node_name === 'SVG') {
    svgCount++;
  }
}
console.log('SVG nodes in DOM capture:', svgCount);

// Look for sections or headings
const textNodes = nodes.filter(n => n.node_type === 3 && n.node_value_length > 0);
console.log('Text nodes count:', textNodes.length);

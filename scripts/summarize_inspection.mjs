import fs from 'fs';

let raw = fs.readFileSync('work/analysis/signed_in/home_page_inspection.json');
let text = raw.toString('utf16le');
if (!text.trim().startsWith('{')) {
  text = raw.toString('utf8');
}
if (text.charCodeAt(0) === 0xFEFF) {
  text = text.slice(1);
}
const data = JSON.parse(text);
const res = data.normalized_result || {};

console.log('URL:', res.url);
console.log('Title:', res.title);
console.log('Document title:', res.document_title);
console.log('Scripts count:', (res.scripts || []).length);
console.log('Stylesheets count:', (res.stylesheets || []).length);
console.log('Accessibility nodes count:', (res.accessibility_nodes || []).length);
console.log('JSON body shapes count:', (res.json_body_shapes || []).length);
if (res.json_body_shapes && res.json_body_shapes.length > 0) {
  console.log('Sample JSON body shapes:', JSON.stringify(res.json_body_shapes.slice(0, 3), null, 2));
}

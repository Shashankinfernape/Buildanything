const fs = require('fs');
const cap = JSON.parse(fs.readFileSync('work/target_artifacts/replit/page-capture.json', 'utf8'));
console.log('Capture completeness:', cap.normalized_result?.completeness?.status);
const res = cap.normalized_result?.resources || [];
console.log('Resources count in page-capture:', res.length);

const urls = new Set();
function findUrls(obj) {
  if (!obj) return;
  if (typeof obj === 'string') {
    if (obj.startsWith('http://') || obj.startsWith('https://')) {
      urls.add(obj);
    }
    return;
  }
  if (Array.isArray(obj)) {
    for (const item of obj) findUrls(item);
  } else if (typeof obj === 'object') {
    for (const key of Object.keys(obj)) {
      findUrls(obj[key]);
    }
  }
}
findUrls(cap);
console.log('Total URLs found in page-capture.json:', urls.size);

const cssUrls = Array.from(urls).filter(u => u.includes('.css'));
console.log('CSS URLs found:', cssUrls.length);
cssUrls.forEach(u => console.log(' CSS:', u));

const mediaUrls = Array.from(urls).filter(u => /\.(woff2|png|jpg|jpeg|webp|svg|mp4|webm|riv|json)($|\?)/i.test(u));
console.log('Media URLs found:', mediaUrls.length);

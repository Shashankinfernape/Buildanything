import fs from 'fs';

const liveHtml = fs.readFileSync('work/analysis/section3-bento-live-dom.html', 'utf8');

// Let's check images in liveHtml
const imgTags = liveHtml.matchAll(/<img[^>]+>/g);
for (const tag of imgTags) {
  console.log('Live img tag:', tag[0].slice(0, 200));
}

// Let's check SVG tags in liveHtml
const svgTags = liveHtml.matchAll(/<svg[^>]+>/g);
for (const tag of svgTags) {
  console.log('Live svg tag:', tag[0].slice(0, 200));
}

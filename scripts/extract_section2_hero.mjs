import fs from 'fs';

const html = fs.readFileSync('work/target_artifacts/replit/live-rendered-snapshot.html', 'utf8');

// Find the hero wrapper
// It starts right after </header> and before DiscoverTemplates (<section id="templates" or similar)
const headerEnd = html.indexOf('</header>');
const afterHeader = html.slice(headerEnd + 9);

// Let's find where the hero container ends
// In module-127388:
// <x.View clsx={es.tw("pt-900", es.tw.designSystemDeviation("h-[calc(100vh-67px)]"), es.tw.onCustom("[@media_screen_and_(width<=768px)]")("pt-0"))}><EvComponent/>{<ERComponent/>}</x.View>
// <DiscoverTemplates/>
const heroStartIdx = afterHeader.indexOf('<div class="flex box-border min-h-0 min-w-0 border-0 border-solid view-outline-none flex-col justify-logical-start items-stretch shrink-0 pt-900 h-[calc(100vh-67px)]');

// Find the end of this hero container
let depth = 0;
let heroEndIdx = -1;
let inTag = false;
let tagStart = -1;

for (let i = heroStartIdx; i < afterHeader.length; i++) {
  if (afterHeader[i] === '<') {
    tagStart = i;
    inTag = true;
  } else if (afterHeader[i] === '>' && inTag) {
    inTag = false;
    const tag = afterHeader.slice(tagStart, i + 1);
    if (tag.startsWith('<div') && !tag.endsWith('/>')) {
      depth++;
    } else if (tag.startsWith('</div')) {
      depth--;
      if (depth === 0) {
        heroEndIdx = i + 1;
        break;
      }
    }
  }
}

console.log('Hero start:', heroStartIdx, 'Hero end:', heroEndIdx, 'Length:', heroEndIdx - heroStartIdx);
const heroHtml = afterHeader.slice(heroStartIdx, heroEndIdx);
fs.writeFileSync('work/analysis/section2-hero-snapshot.html', heroHtml, 'utf8');
console.log('Saved section2-hero-snapshot.html! Bytes:', Buffer.byteLength(heroHtml));

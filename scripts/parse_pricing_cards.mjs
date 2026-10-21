import fs from 'fs';

const html = fs.readFileSync('work/analysis/section7-pricing-live-dom.html', 'utf8');

// Find all 4 card containers
const cardMatches = [...html.matchAll(/<div class="flex box-border min-h-0 min-w-0 border-solid view-outline-none flex-col justify-logical-start items-stretch shrink-0 gap-400 h-full rounded-24 border px-600 py-700([\s\S]*?)<\/div><\/div><\/div>/g)];

console.log('Cards count:', cardMatches.length);
for (let i = 0; i < cardMatches.length; i++) {
  console.log(`\n================ CARD ${i + 1} ================`);
  const cHtml = cardMatches[i][0];
  // extract plan name
  const nameMatch = cHtml.match(/<span class="text-\[#6f6c6a\] text-\[14px\]">([^<]+)<\/span>/);
  console.log('Plan name:', nameMatch ? nameMatch[1] : 'unknown');

  // extract price
  const priceMatch = cHtml.match(/<span class="text-\[#191818\] text-\[40px\] leading-\[1\.1\] \[letter-spacing:-?\.03em\]">([^<]+)<\/span>/);
  console.log('Price:', priceMatch ? priceMatch[1] : 'unknown');

  // extract original price / strike
  const strikeMatch = cHtml.match(/<s[^>]*>([^<]+)<\/s>/);
  if (strikeMatch) console.log('Original price:', strikeMatch[1]);

  // extract badge
  const badgeMatch = cHtml.match(/<span class="rounded-8 px-250 py-100 whitespace-nowrap bg-\[#ffe1d6\] text-\[#ff3c00\] text-\[13px\]">([^<]+)<\/span>/);
  if (badgeMatch) console.log('Badge:', badgeMatch[1]);

  // extract description
  const descMatch = cHtml.match(/<span class="text-\[#6f6c6a\] text-\[14px\] leading-\[1\.5\]">([^<]+)<\/span>/);
  console.log('Description:', descMatch ? descMatch[1] : 'unknown');

  // extract benefits
  const benefitMatches = [...cHtml.matchAll(/<span class="text-\[#312e2e\] text-\[14px\] leading-\[1\.4\]">([^<]+)<\/span>/g)];
  console.log('Benefits:', benefitMatches.map(m => m[1]));

  // extract CTA
  const ctaMatch = cHtml.match(/<a[^>]*data-analytics-id="([^"]+)"[^>]*>([\s\S]*?)<\/a>/);
  if (ctaMatch) {
    const ctaText = ctaMatch[2].replace(/<[^>]+>/g, '').trim();
    console.log('CTA:', ctaMatch[1], 'text:', ctaText);
  }
}

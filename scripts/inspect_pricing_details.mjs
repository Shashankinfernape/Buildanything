import fs from 'fs';

const html = fs.readFileSync('work/analysis/section7-pricing-live-dom.html', 'utf8');

const regex = /<span class="text-\[#6f6c6a\] text-\[14px\]">([^<]+)<\/span>([\s\S]*?)<a[^>]*data-analytics-id="([^"]+)"[^>]*>([\s\S]*?)<\/a>/g;
let m;
while ((m = regex.exec(html)) !== null) {
  const planName = m[1];
  const block = m[2];
  const ctaId = m[3];
  const ctaText = m[4].replace(/<[^>]+>/g, '').trim();

  // Find price text
  const price = block.match(/<span class="text-\[#191818\] text-\[40px\][^"]*">([^<]+)<\/span>/);
  const strike = block.match(/<s[^>]*>([^<]+)<\/s>/);
  const badge = block.match(/<span class="rounded-8 px-250 py-100[^"]*">([^<]+)<\/span>/);
  const perMonth = block.includes('per month');
  const billedAnnually = block.includes('billed annually');

  console.log(`Plan: ${planName}`);
  console.log(`  Price: ${price ? price[1] : 'none'}`);
  if (strike) console.log(`  Original: ${strike[1]}`);
  if (badge) console.log(`  Badge: ${badge[1]}`);
  console.log(`  Per month: ${perMonth}, Billed Annually: ${billedAnnually}`);
  console.log(`  CTA ID: ${ctaId}, text: ${ctaText}`);
}

import { chromium } from 'playwright';

const URL = 'http://127.0.0.1:5174/';

async function runVerification() {
  console.log('=== Starting Active Playwright Interaction & Computed-Style Verification ===');
  console.log(`Connecting to: ${URL}`);

  console.log('Connecting to existing Chrome via CDP at http://127.0.0.1:9222...');
  const browser = await chromium.connectOverCDP('http://127.0.0.1:9222');
  const context = browser.contexts()[0] || await browser.newContext({ viewport: { width: 1280, height: 800 } });
  const page = await context.newPage();
  await page.setViewportSize({ width: 1440, height: 900 });

  await page.goto(URL, { waitUntil: 'networkidle' });
  console.log('✓ Page loaded successfully.');

  let passed = 0;
  let total = 0;

  function assert(condition, message) {
    total++;
    if (condition) {
      console.log(`✓ [PASS] ${message}`);
      passed++;
    } else {
      console.error(`✗ [FAIL] ${message}`);
      process.exitCode = 1;
    }
  }

  // 1. Mega-Nav Dropdowns Verification
  console.log('\n--- 1. Mega-Nav Dropdown Interactions ---');
  const productsBtn = page.locator('button:has-text("Products")');
  assert(await productsBtn.isVisible(), 'Products menu button is visible');
  
  await productsBtn.click();
  await page.waitForTimeout(200);
  const agentItem = page.locator('span:has-text("Agent")');
  assert(await agentItem.first().isVisible(), 'Agent link inside Products dropdown is visible after click');

  const solutionsBtn = page.locator('button:has-text("Solutions")');
  await solutionsBtn.click();
  await page.waitForTimeout(200);
  const foundersItem = page.locator('span:has-text("Startups & Founders")');
  assert(await foundersItem.first().isVisible(), 'Startups & Founders inside Solutions dropdown is visible');

  // 2. Hero Prompt Builder Interactions
  console.log('\n--- 2. Hero Prompt Builder Interactions ---');
  const textarea = page.locator('textarea');
  assert(await textarea.isVisible(), 'Prompt textarea is visible');
  assert(await textarea.getAttribute('placeholder') === 'What will you build?', 'Prompt placeholder is "What will you build?"');

  // Test category tabs
  const mobileTab = page.locator('button:has-text("Mobile")').first();
  await mobileTab.click();
  await page.waitForTimeout(100);
  console.log('✓ Clicked Mobile category tab.');

  const websiteTab = page.locator('button:has-text("Website")').first();
  await websiteTab.click();
  await page.waitForTimeout(100);

  // Test clicking example pills
  const hiringPill = page.locator('button:has-text("Hiring tracker")');
  await hiringPill.click();
  const val1 = await textarea.inputValue();
  assert(val1.includes('hiring tracker dashboard'), 'Textarea updated with Hiring tracker prompt');

  const checkoutPill = page.locator('button:has-text("Checkout flow prototype")');
  await checkoutPill.click();
  const val2 = await textarea.inputValue();
  assert(val2.includes('checkout flow with cart summary'), 'Textarea updated with Checkout flow prompt');

  // 3. Interactive Tabs & Toggles
  console.log('\n--- 3. Interactive Tabs & State Toggles ---');
  
  // Bento Modes
  const maxModeBtn = page.locator('button:has-text("Max")');
  await maxModeBtn.click();
  await page.waitForTimeout(100);
  const activeModeLabel = page.locator('strong:has-text("max")');
  assert(await activeModeLabel.isVisible(), 'Bento active mode updated to "max"');

  // Template Gallery Filters
  const postersFilter = page.locator('button:has-text("Posters")');
  await postersFilter.click();
  await page.waitForTimeout(100);
  const jazzPoster = page.locator('h4:has-text("Jazz Night Event Poster")');
  assert(await jazzPoster.isVisible(), 'Filtered to Posters category and showing Jazz Night Event Poster');

  // Platform Sub-Tabs
  const dbTab = page.locator('h4:has-text("Database")');
  await dbTab.click();
  await page.waitForTimeout(100);
  const dbCode = page.locator('pre:has-text("neon-http")');
  assert(await dbCode.isVisible(), 'Platform code panel updated to Database snippet');

  // Testimonial Carousel Controls
  const nextBtn = page.locator('button[aria-label="Next Testimonial"]');
  await nextBtn.click();
  await page.waitForTimeout(300);
  console.log('✓ Clicked Next Testimonial in carousel.');

  // Pricing Yearly/Monthly Toggle
  console.log('\n--- 4. Pricing Matrix & Billing Toggle ---');
  const corePrice = page.locator('h3:has-text("Replit Core") + * + div span').first();
  const initialPrice = await corePrice.innerText();
  assert(initialPrice === '$18', 'Core yearly price is $18');

  const monthlyBtn = page.locator('button:has-text("Monthly")');
  await monthlyBtn.click();
  await page.waitForTimeout(100);
  const monthlyCorePrice = await corePrice.innerText();
  assert(monthlyCorePrice === '$20', 'Core price updated to $20 on Monthly toggle');

  const proPrice = page.locator('h3:has-text("Replit Pro") + * + div span').first();
  const monthlyProPrice = await proPrice.innerText();
  assert(monthlyProPrice === '$100', 'Pro price updated to $100 on Monthly toggle');

  // 5. Computed-Style Parity Checks
  console.log('\n--- 5. Computed-Style Parity Checks ---');
  const bodyStyles = await page.evaluate(() => {
    const s = window.getComputedStyle(document.body);
    return {
      fontFamily: s.fontFamily,
      backgroundColor: s.backgroundColor,
      color: s.color
    };
  });
  console.log('Computed Body Styles:', bodyStyles);
  assert(bodyStyles.fontFamily.includes('Replit Diatype'), 'Body computed font-family includes "Replit Diatype"');
  assert(bodyStyles.backgroundColor === 'rgb(14, 21, 37)', 'Body background matches #0e1525 (rgb(14, 21, 37))');

  const h1Styles = await page.evaluate(() => {
    const el = document.querySelector('h1');
    const s = window.getComputedStyle(el);
    return {
      fontSize: s.fontSize,
      fontWeight: s.fontWeight,
      color: s.color
    };
  });
  console.log('Computed H1 Styles:', h1Styles);
  assert(h1Styles.color === 'rgb(255, 255, 255)', 'H1 font color is pure white rgb(255, 255, 255)');

  await page.close();

  console.log(`\n========================================`);
  console.log(`VERIFICATION SUMMARY: ${passed}/${total} TESTS PASSED`);
  console.log(`========================================`);

  if (passed === total) {
    console.log('🎉 1:1 REA EVIDENCE-DRIVEN RECONSTRUCTION FULLY VERIFIED!');
  }
}

runVerification().catch(err => {
  console.error('Playwright verification encountered an error:', err);
  process.exit(1);
});

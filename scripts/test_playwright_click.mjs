import pw from 'file:///C:/Users/user/Desktop/El projecto/Git-repos/rea/node_modules/playwright-core/index.mjs';

async function main() {
  const browser = await pw.chromium.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: true
  });
  const page = await browser.newPage();
  await page.goto('http://127.0.0.1:5174/~');
  await page.waitForTimeout(1000);
  await page.click("button[aria-label='Security']");
  await page.waitForTimeout(1000);
  await page.click("button[aria-label='Severity level']");
  await page.waitForTimeout(500);

  console.log('getByRole option count:', await page.getByRole('option').count());
  console.log('getByRole option High count:', await page.getByRole('option', { name: 'High', exact: true }).count());
  console.log('getByRole option High visible:', await page.getByRole('option', { name: 'High', exact: true }).isVisible());

  const box = await page.getByRole('option', { name: 'High', exact: true }).boundingBox();
  console.log('High option boundingBox:', box);

  if (box) {
    const elAtPoint = await page.evaluate(({ x, y }) => {
      const el = document.elementFromPoint(x, y);
      return {
        tag: el?.tagName,
        text: el?.textContent?.slice(0, 50),
        class: el?.className,
        zIndex: window.getComputedStyle(el).zIndex
      };
    }, { x: box.x + box.width / 2, y: box.y + box.height / 2 });
    console.log('Element at point (x, y):', elAtPoint);
  }
  try {
    await page.getByRole('option', { name: 'High', exact: true }).click({ timeout: 2000 });
    console.log('Clicked successfully!');
  } catch (e) {
    console.log('Click error:', e.message);
  }
  await browser.close();
}

main().catch(console.error);

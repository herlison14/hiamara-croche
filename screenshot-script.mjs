import { chromium } from 'playwright';
import { mkdirSync } from 'fs';

const BASE_URL = 'http://localhost:3000';
const DIR = './screenshots';
mkdirSync(DIR, { recursive: true });

const SHOTS = [
  { name: '01-home-hero',       url: '/',                fullPage: false },
  { name: '02-home-full',       url: '/',                fullPage: true  },
  { name: '03-produtos',        url: '/produtos',        fullPage: false },
  { name: '04-carrinho',        url: '/carrinho',        fullPage: false },
  { name: '05-checkout',        url: '/checkout',        fullPage: false },
  { name: '06-admin-login',     url: '/admin/login',     fullPage: false },
];

const browser = await chromium.launch();
const ctx = await browser.newContext({
  viewport: { width: 1440, height: 900 },
  deviceScaleFactor: 2,
});
const page = await ctx.newPage();

for (const shot of SHOTS) {
  console.log(`→ ${shot.name}`);
  await page.goto(`${BASE_URL}${shot.url}`, { waitUntil: 'networkidle', timeout: 30000 }).catch(() =>
    page.goto(`${BASE_URL}${shot.url}`, { waitUntil: 'domcontentloaded' })
  );
  await page.waitForTimeout(1500);
  await page.screenshot({ path: `${DIR}/${shot.name}.png`, fullPage: shot.fullPage });
  console.log(`  ✓ salvo`);
}

await browser.close();
console.log('\nPronto!');

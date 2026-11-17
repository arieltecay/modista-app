import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const readProjectFile = (path) =>
  readFile(new URL(`../../${path}`, import.meta.url), 'utf8');

test('paid Camisas landing discovers its responsive hero before the SPA boots', async () => {
  const html = await readProjectFile('index.html');

  assert.match(html, /\/lp\/curso-online-de-camisas/);
  assert.match(html, /imagesrcset/);
  assert.match(html, /imagesizes/);
  assert.match(html, /fetchpriority/);
  assert.match(html, /w_320,h_400/);
  assert.match(html, /w_480,h_600/);
  assert.match(html, /w_560,h_700/);
  assert.ok(
    html.indexOf('imagesrcset') < html.indexOf('preload.href'),
    'responsive preload attributes must be assigned before the fallback href',
  );
});

test('landing content reads avoid tracking headers and their CORS preflight', async () => {
  const service = await readProjectFile('src/services/landing/landingService.ts');

  assert.match(service, /import \{ publicClient \}/);
  assert.match(service, /publicClient\.get\(`\/landings\/slug\/\$\{slug\}\/full`\)/);
  assert.doesNotMatch(service, /hasMarketingConsent/);
});

test('Cloudflare analytics remains dashboard-managed, not embedded in source', async () => {
  const html = await readProjectFile('index.html');
  assert.doesNotMatch(html, /cloudflareinsights|data-cf-beacon/);
});

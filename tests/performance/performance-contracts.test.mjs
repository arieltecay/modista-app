import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const readProjectFile = (path) =>
  readFile(new URL(`../../${path}`, import.meta.url), 'utf8');

test('oversized phone dependency is replaced with the lightweight alternative', async () => {
  const packageJson = JSON.parse(await readProjectFile('package.json'));
  assert.equal(packageJson.dependencies['google-libphonenumber'], undefined);
  assert.ok(packageJson.dependencies['libphonenumber-js']);
});

test('Cloudflare Pages keeps safe cache semantics for SPA and hashed assets', async () => {
  const headers = await readProjectFile('public/_headers');
  assert.match(headers, /\/assets\/\*[\s\S]*max-age=31536000, immutable/);
  assert.match(headers, /\/index\.html[\s\S]*max-age=0, must-revalidate/);
  assert.match(headers, /\/sw\.js[\s\S]*no-cache, no-store, must-revalidate/);
});

test('RUM-identified surfaces reserve stable layout space', async () => {
  const [courses, consent, paymentSuccess] = await Promise.all([
    readProjectFile('src/pages/CoursesV2/index.tsx'),
    readProjectFile('src/components/PrivacyConsentBanner/index.tsx'),
    readProjectFile('src/pages/Payment/PaymentSuccess.tsx'),
  ]);

  assert.match(courses, /grid-cols-3/);
  assert.match(consent, /h-\[min\(21rem,calc\(100dvh-7rem-env\(safe-area-inset-bottom\)\)\)\]/);
  assert.match(paymentSuccess, /min-h-\[/);
});

test('paid landing uses truthful trust copy and responsive instructor imagery', async () => {
  const [security, instructor] = await Promise.all([
    readProjectFile('src/pages/LandingV2/sections/SecuritySection/index.tsx'),
    readProjectFile('src/pages/LandingV2/sections/InstructorSection/index.tsx'),
  ]);

  assert.doesNotMatch(security, /Garantía de satisfacción/);
  assert.match(security, /Confirmación por email y WhatsApp/);
  assert.match(instructor, /srcSet=/);
  assert.match(instructor, /sizes="80px"/);
});

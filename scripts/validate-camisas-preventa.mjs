import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const read = (path) => readFile(new URL(`../${path}`, import.meta.url), 'utf8');

const [main, landing, hero, security, formSection, form, styles] = await Promise.all([
  read('src/main.jsx'),
  read('src/pages/LandingV2/index.tsx'),
  read('src/pages/LandingV2/sections/HeroSection/index.tsx'),
  read('src/pages/LandingV2/sections/SecuritySection/index.tsx'),
  read('src/pages/LandingV2/sections/FormSection/index.tsx'),
  read('src/pages/LandingV2/form/LandingForm/index.tsx'),
  read('src/index.css'),
]);

assert.match(main, /import \{[\s\S]*hasMarketingConsent[\s\S]*initializePrivacyConsent[\s\S]*\} from '\.\/utils\/privacy-consent';/);
assert.match(landing, /landing\.slug === 'curso-online-de-camisas'/);
assert.match(landing, /Acceso completo desde el 23\/11/);
assert.match(hero, /accessLabel/);
assert.match(security, /accessLabel/);
assert.match(formSection, /accessLabel/);
assert.match(form, /accessLabel/);
assert.doesNotMatch(`${hero}${security}${formSection}${form}`, /Acceso inmediato|acceso inmediato/);
assert.doesNotMatch(security, /Garantía de satisfacción/);
assert.match(security, /Confirmación por email y WhatsApp/);
assert.match(styles, /--color-atelier-pop: #C74432;/);
assert.match(styles, /--color-atelier-pop-dark: #B83D2E;/);
assert.match(styles, /--color-atelier-gold: #8A6818;/);
assert.match(styles, /--color-atelier-muted-text: #686C67;/);

console.log('Camisas preventa: contrato de copy, medición y contraste validado.');

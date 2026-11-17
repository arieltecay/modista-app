import assert from 'node:assert/strict';
import test from 'node:test';

import {
  LANDING_HERO_IMAGE,
  LANDING_HERO_SIZES,
  LANDING_HERO_WIDTHS,
  getLandingHeroSrcSet,
  getLandingHeroUrl,
} from '../../src/utils/image-utils.ts';

const CLOUDINARY_IMAGE =
  'https://res.cloudinary.com/demo/image/upload/v1/course.jpg';

test('landing hero offers responsive Cloudinary candidates', () => {
  assert.deepEqual(LANDING_HERO_WIDTHS, [320, 480, 560]);
  assert.equal(LANDING_HERO_IMAGE.width, 560);
  assert.equal(LANDING_HERO_IMAGE.height, 700);
  assert.equal(
    LANDING_HERO_SIZES,
    '(max-width: 380px) calc(100vw - 40px), 340px',
  );

  const srcSet = getLandingHeroSrcSet(CLOUDINARY_IMAGE);
  for (const width of LANDING_HERO_WIDTHS) {
    assert.match(srcSet, new RegExp(`w_${width},h_${width * 1.25}.* ${width}w`));
  }
});

test('landing hero fallback keeps the largest responsive candidate', () => {
  assert.match(getLandingHeroUrl(CLOUDINARY_IMAGE), /w_560,h_700/);
});


import assert from 'node:assert/strict';
import test from 'node:test';

import {
  validateApellido,
  validateCelular,
  validateEmail,
  validateNombre,
} from '../../src/utils/formValidations.ts';
import { validatePhone, validatePhoneStrict } from '../../src/utils/validators.ts';

test('legacy inscription fields preserve their validation contract', () => {
  assert.equal(validateNombre('Micaela'), null);
  assert.equal(validateApellido('Guevara'), null);
  assert.equal(validateEmail('mica@example.com'), null);
  assert.equal(validateCelular('+54 9 381 573-4249'), null);
});

test('phone validation rejects malformed, fake and unsupported numbers', async () => {
  assert.match(validateCelular('123'), /número.*válido/i);
  assert.match(validateCelular('00000000'), /número.*válido/i);
  assert.match(validateCelular('+44 20 7946 0958'), /países americanos/i);
  assert.match(validatePhone('00000000'), /número válido/i);
  assert.match(await validatePhoneStrict('+44 20 7946 0958'), /número válido/i);
  assert.equal(await validatePhoneStrict('+54 9 381 573-4249'), null);
});


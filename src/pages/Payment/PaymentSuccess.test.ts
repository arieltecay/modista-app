import { describe, expect, it } from 'vitest';
import { getSuccessCopy } from './PaymentSuccess';

describe('payment success copy', () => {
  it('only says both channels were sent after both providers accepted', () => {
    expect(getSuccessCopy('paid', { email: 'accepted', whatsapp: 'accepted' }).details).toMatch(/Te enviamos/);
    expect(getSuccessCopy('paid', { email: 'pending', whatsapp: 'accepted' }).details).toMatch(/enviando/);
    expect(getSuccessCopy('paid', { email: 'failed', whatsapp: 'accepted' }).details).not.toMatch(/te enviamos/i);
    expect(getSuccessCopy('paid', { email: 'failed', whatsapp: 'pending' }).details).not.toMatch(/enviando/i);
    expect(getSuccessCopy('paid', { email: 'pending', whatsapp: 'pending' }, 'timeout').details).not.toMatch(/enviando/i);
    expect(getSuccessCopy('paid', { email: 'unknown', whatsapp: 'unknown' }).details).not.toMatch(/te enviamos/i);
    expect(getSuccessCopy('paid', { email: 'unknown', whatsapp: 'pending' }).details).not.toMatch(/enviando/i);
    expect(getSuccessCopy('paid', { email: 'accepted', whatsapp: 'disabled' }).details).toMatch(/solo.*correo/i);
    expect(getSuccessCopy('paid', { email: 'pending', whatsapp: 'disabled' }).details).toMatch(/enviando.*correo/i);
    expect(getSuccessCopy('paid', { email: 'pending', whatsapp: 'disabled' }, 'timeout').details).not.toMatch(/enviando/i);
  });

  it('does not promise course access after a partial payment', () => {
    const copy = getSuccessCopy('partial', { email: 'unknown', whatsapp: 'unknown' });
    expect(copy.heading).toMatch(/parcial/);
    expect(copy.details).not.toMatch(/enlace de acceso/);
  });
});

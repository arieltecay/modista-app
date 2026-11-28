import type { ReactElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import PaymentFailure from './PaymentFailure';
import PaymentPending from './PaymentPending';
import PaymentSuccess from './PaymentSuccess';

const render = (page: ReactElement, url: string) =>
  renderToStaticMarkup(<MemoryRouter initialEntries={[url]}>{page}</MemoryRouter>);

describe('payment return pages', () => {
  it.each([
    ['success', <PaymentSuccess />, '/payment/success?inscription_id=abc'],
    ['success without inscription', <PaymentSuccess />, '/payment/success'],
    ['failure', <PaymentFailure />, '/payment/failure?inscription_id=abc'],
    ['pending', <PaymentPending />, '/payment/pending?inscription_id=abc'],
  ])('%s lets visitors reopen privacy preferences', (_name, page, url) => {
    expect(render(page, url)).toContain('Preferencias de privacidad');
  });
});

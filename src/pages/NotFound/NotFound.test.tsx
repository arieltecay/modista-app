import { renderToStaticMarkup } from 'react-dom/server';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import NotFoundPage from './index';

describe('NotFoundPage', () => {
  it('lets visitors reopen privacy preferences', () => {
    const html = renderToStaticMarkup(<MemoryRouter><NotFoundPage /></MemoryRouter>);

    expect(html).toContain('Preferencias de privacidad');
  });
});

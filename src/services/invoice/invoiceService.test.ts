import { afterEach, describe, expect, it, vi } from 'vitest';
import { getPublicInvoice } from './invoiceService';

const TOKEN = 'a'.repeat(64);

const respond = (status: number, body: unknown = {}) =>
  vi.fn().mockResolvedValue({ status, ok: status >= 200 && status < 300, json: async () => body });

afterEach(() => vi.unstubAllGlobals());

describe('getPublicInvoice', () => {
  it('asks for the invoice without credentials, cookies, referrer or caching', async () => {
    const fetchMock = respond(200, { number: 3 });
    vi.stubGlobal('fetch', fetchMock);

    await getPublicInvoice(TOKEN);

    const [url, options] = fetchMock.mock.calls[0];
    expect(String(url)).toMatch(new RegExp(`/api/invoices/public/${TOKEN}$`));
    expect(options).toMatchObject({ credentials: 'omit', cache: 'no-store', referrerPolicy: 'no-referrer' });
    expect(options.headers).toBeUndefined();
  });

  it('returns the invoice on 200', async () => {
    vi.stubGlobal('fetch', respond(200, { number: 3, total: 20900 }));

    expect(await getPublicInvoice(TOKEN)).toEqual({ number: 3, total: 20900 });
  });

  it('returns null on 404, so the page can say the invoice does not exist', async () => {
    vi.stubGlobal('fetch', respond(404));

    expect(await getPublicInvoice(TOKEN)).toBeNull();
  });

  it('throws on any other failure, so the page can offer to retry', async () => {
    vi.stubGlobal('fetch', respond(500));
    await expect(getPublicInvoice(TOKEN)).rejects.toThrow(/500/);

    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new TypeError('network down')));
    await expect(getPublicInvoice(TOKEN)).rejects.toThrow(/network down/);
  });

  it('never calls the API for something that is not a token', async () => {
    const fetchMock = respond(200);
    vi.stubGlobal('fetch', fetchMock);

    expect(await getPublicInvoice('../../admin')).toBeNull();
    expect(fetchMock).not.toHaveBeenCalled();
  });
});

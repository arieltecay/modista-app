import { describe, expect, it } from 'vitest';
import { isPrivateDocumentPath } from './privateRoutes';

describe('isPrivateDocumentPath', () => {
  it('flags invoice pages, whose url carries a secret token', () => {
    expect(isPrivateDocumentPath('/factura/' + 'a'.repeat(64))).toBe(true);
    expect(isPrivateDocumentPath('/factura/abc/')).toBe(true);
  });

  it('leaves the public site alone', () => {
    for (const path of ['/', '/cursos', '/cursos/corte-y-confeccion', '/payment/success', '/lp/camisas', '/facturacion', '/factura']) {
      expect(isPrivateDocumentPath(path), path).toBe(false);
    }
  });

  it('is not fooled by the prefix appearing later in the path', () => {
    expect(isPrivateDocumentPath('/cursos/factura/abc')).toBe(false);
  });
});

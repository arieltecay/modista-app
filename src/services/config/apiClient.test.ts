import { afterEach, expect, it, vi } from 'vitest';
import { apiClient } from './apiClient';

afterEach(() => vi.unstubAllGlobals());

it('sends an enrollment request when optional browser storage is blocked', async () => {
  const blocked = { getItem: () => { throw new Error('storage blocked'); } };
  vi.stubGlobal('localStorage', blocked);
  vi.stubGlobal('sessionStorage', blocked);
  const adapter = vi.fn(async (config) => ({
    data: { success: true }, status: 201, statusText: 'Created', headers: {}, config,
  }));

  await expect(apiClient.post('/inscriptions', { courseId: 'course-1' }, { adapter })).resolves.toEqual({ success: true });
  expect(adapter).toHaveBeenCalledOnce();
});

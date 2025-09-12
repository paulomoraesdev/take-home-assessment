import { describe, it, expect, beforeEach, vi } from 'vitest';

vi.stubEnv('VITE_API_TOKEN', 'token');
vi.stubEnv('VITE_API_BASE_URL', 'http://api');

let httpClient: any;

beforeEach(async () => {
  httpClient = (await import('@/lib/http-client')).httpClient;
});

describe('httpClient', () => {
  it('performs GET with query params and headers', async () => {
    const fetchMock = vi.fn(async () => new Response(JSON.stringify({ ok: true }), { status: 200 }));
    vi.stubGlobal('fetch', fetchMock);
    await httpClient.get('/test', { a: 1 });
    expect(fetchMock).toHaveBeenCalledWith('http://api/test?a=1', expect.objectContaining({
      method: 'GET',
      headers: expect.objectContaining({ Authorization: 'Bearer token' })
    }));
  });

  it('throws on error response', async () => {
    vi.stubGlobal('fetch', async () => new Response(JSON.stringify({ message: 'fail' }), { status: 400 }));
    await expect(httpClient.get('/bad')).rejects.toThrow('fail');
  });
});

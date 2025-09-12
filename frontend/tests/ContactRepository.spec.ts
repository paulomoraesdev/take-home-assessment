import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('@/lib/http-client', () => ({
  httpClient: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
  }
}));

import { ContactRepository } from '@/repositories/ContactRepository';
import { httpClient } from '@/lib/http-client';

let repository: ContactRepository;

beforeEach(() => {
  repository = new ContactRepository();
});

describe('ContactRepository', () => {
  it('calls getAll with params', async () => {
    (httpClient.get as any).mockResolvedValue({});
    await repository.getAll({ page: 2 });
    expect(httpClient.get).toHaveBeenCalledWith('/contacts', { page: 2 });
  });

  it('creates contact transforming date', async () => {
    (httpClient.post as any).mockResolvedValue({});
    await repository.create({ name: 'a', profilePicture: 'img', lastContactAt: new Date('2024-01-01') } as any);
    expect(httpClient.post).toHaveBeenCalled();
  });

  it('archive calls update', async () => {
    (httpClient.put as any).mockResolvedValue({});
    await repository.archive('1');
    expect(httpClient.put).toHaveBeenCalledWith('/contacts/1', { archived: true });
  });
});

import { test, beforeEach, mock } from 'node:test';
import assert from 'node:assert/strict';
import { ContactService } from '../src/services/ContactService.ts';
import * as storage from '../src/libs/storage.ts';

let repoMock: any;
let service: ContactService;

beforeEach(() => {
  repoMock = {
    getAll: mock.fn(() => Promise.resolve([[], 0])),
    count: mock.fn(() => Promise.resolve(0)),
    getById: mock.fn(() => Promise.resolve(null)),
    create: mock.fn((data: any) => Promise.resolve({ id: '1', ...data })),
    update: mock.fn((id: string, data: any) => Promise.resolve({ id, ...data })),
    delete: mock.fn((id: string) => Promise.resolve({ id })),
  };
  service = new ContactService(repoMock);
});

test('getAll fetches data and meta', async () => {
  repoMock.getAll.mock.mockImplementation(() => Promise.resolve([]));
  repoMock.count.mock.mockImplementation(() => Promise.resolve(20));
  const result = await service.getAll(1, 10, false, 'a', 'name', 'asc', true);
  assert.equal(result.meta.total, 20);
  assert.equal(repoMock.getAll.mock.callCount(), 3);
});

test('getById returns data', async () => {
  repoMock.getById.mock.mockImplementation(() => Promise.resolve({ id: '1' }));
  const result = await service.getById('1');
  assert.deepEqual(result, { data: { id: '1' } });
});

test('update without new picture calls repository', async () => {
  await service.update('1', { name: 'Test' });
  assert.equal(repoMock.update.mock.callCount(), 1);
});

test('delete forwards to repository', async () => {
  await service.delete('1');
  assert.equal(repoMock.delete.mock.callCount(), 1);
});

import { test, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import { ContactRepository } from '../src/repositories/ContactRepository.ts';

let prismaMock: any;
let repository: ContactRepository;

beforeEach(() => {
  prismaMock = {
    contact: {
      findMany: ({ where, skip, take, orderBy }: any) => {
        prismaMock.contact.findMany.called = { where, skip, take, orderBy };
        return [];
      },
      findUnique: ({ where }: any) => {
        prismaMock.contact.findUnique.called = { where };
        return null;
      },
      count: ({ where }: any) => {
        prismaMock.contact.count.called = { where };
        return 0;
      },
      create: ({ data }: any) => {
        prismaMock.contact.create.called = { data };
        return data;
      },
      update: ({ where, data }: any) => {
        prismaMock.contact.update.called = { where, data };
        return { id: where.id, ...data };
      },
    },
  };
  repository = new ContactRepository(prismaMock);
});

test('getAll uses prisma with pagination and sorting', async () => {
  await repository.getAll(2, 5, { name: 'A' } as any, { createdAt: 'asc' } as any);
  assert.deepEqual(prismaMock.contact.findMany.called, {
    where: { name: 'A' },
    skip: 5,
    take: 5,
    orderBy: { createdAt: 'asc' },
  });
});

test('getById calls prisma.findUnique', async () => {
  await repository.getById('123');
  assert.deepEqual(prismaMock.contact.findUnique.called, { where: { id: '123' } });
});

test('count calls prisma.count', async () => {
  await repository.count({ archivedAt: null } as any);
  assert.deepEqual(prismaMock.contact.count.called, { where: { archivedAt: null } });
});

test('create calls prisma.create', async () => {
  const data: any = { name: 'John' };
  const result = await repository.create(data);
  assert.deepEqual(result, data);
  assert.deepEqual(prismaMock.contact.create.called, { data });
});

test('update maps fields correctly', async () => {
  await repository.update('1', { name: 'Jane', archived: true, profilePicture: 'pic' } as any);
  const { where, data } = prismaMock.contact.update.called;
  assert.deepEqual(where, { id: '1' });
  assert.equal(data.name, 'Jane');
  assert.equal(data.profilePicture, 'pic');
  assert.ok(data.archivedAt instanceof Date);
});

test('delete sets deletedAt', async () => {
  await repository.delete('1');
  assert.equal(prismaMock.contact.update.called.where.id, '1');
  assert.ok(prismaMock.contact.update.called.data.deletedAt instanceof Date);
});

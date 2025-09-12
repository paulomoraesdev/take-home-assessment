import { test, mock } from 'node:test';
import assert from 'node:assert/strict';
import { ContactController } from '../src/controllers/ContactController.ts';

function createReply() {
  return {
    statusCode: 200,
    send: mock.fn((payload: any) => payload),
    status: mock.fn(function (code: number) {
      this.statusCode = code;
      return this;
    }),
  };
}

test('index parses query and delegates to service', async () => {
  const service = { getAll: mock.fn(() => Promise.resolve('ok')) } as any;
  const controller = new ContactController(service);
  const reply = createReply();
  const request: any = { query: { page: '2', limit: '5', archived: 'true', s: 'abc', sortBy: 'name', sortOrder: 'asc', includeStats: 'true' } };
  await controller.index(request, reply as any);
  assert.deepEqual(service.getAll.mock.calls[0].arguments, [2,5,true,'abc','name','asc',true]);
  assert.equal(reply.send.mock.callCount(), 1);
});

test('show returns result', async () => {
  const service = { getById: mock.fn(() => Promise.resolve({ data: { id: '1' } })) } as any;
  const controller = new ContactController(service);
  const reply = createReply();
  await controller.show({ params: { id: '1' } } as any, reply as any);
  assert.equal(reply.send.mock.callCount(), 1);
});

test('show throws when not found', async () => {
  const service = { getById: mock.fn(() => Promise.resolve({ data: { deletedAt: new Date() } })) } as any;
  const controller = new ContactController(service);
  const reply = createReply();
  await assert.rejects(() => controller.show({ params: { id: '1' } } as any, reply as any));
});

test('store validates and creates', async () => {
  const service = { create: mock.fn(() => Promise.resolve({ id: '1' })) } as any;
  const controller = new ContactController(service);
  const reply = createReply();
  const base64 = 'data:image/png;base64,aGVsbG8=';
  await controller.store({ body: { name: 'John', profilePicture: base64, lastContactAt: new Date().toISOString() } } as any, reply as any);
  assert.equal(reply.status.mock.calls[0].arguments[0], 201);
});

test('update delegates to service', async () => {
  const service = { update: mock.fn(() => Promise.resolve({ id: '1' })) } as any;
  const controller = new ContactController(service);
  const reply = createReply();
  const base64 = 'data:image/png;base64,aGVsbG8=';
  await controller.update({ params: { id: '1' }, body: { name: 'A', profilePicture: base64 } } as any, reply as any);
  assert.equal(reply.send.mock.callCount(), 1);
});

test('destroy calls delete', async () => {
  const service = { delete: mock.fn(() => Promise.resolve({ id: '1' })) } as any;
  const controller = new ContactController(service);
  const reply = createReply();
  await controller.destroy({ params: { id: '1' } } as any, reply as any);
  assert.equal(reply.status.mock.calls[0].arguments[0], 200);
});

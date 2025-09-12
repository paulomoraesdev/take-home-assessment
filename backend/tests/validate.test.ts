import { test } from 'node:test';
import assert from 'node:assert/strict';
import { z } from 'zod';
import { validate } from '../src/utils/validate.ts';

test('validate returns parsed data', () => {
  const schema = z.object({ name: z.string() });
  const data = { name: 'John' };
  const result = validate(schema, data);
  assert.deepEqual(result, data);
});

test('validate throws on invalid data', () => {
  const schema = z.object({ name: z.string() });
  try {
    validate(schema, {});
    assert.fail('should throw');
  } catch (err) {
    const e: any = err;
    assert.equal(e.message, 'ValidationError');
    assert.equal(e.statusCode, 422);
    assert.ok(Array.isArray(e.details));
  }
});

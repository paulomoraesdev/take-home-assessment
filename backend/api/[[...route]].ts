import type { VercelRequest, VercelResponse } from '@vercel/node';
import { buildApp } from '../src/app.js';

// Cache Fastify instance across invocations to reduce cold starts
let fastifyAppPromise: ReturnType<typeof buildApp> | null = null;

export const config = {
  // Let Fastify handle the body parsing (JSON/multipart/etc.)
  api: { bodyParser: false },
  runtime: 'nodejs20.x'
} as const;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    if (!fastifyAppPromise) {
      fastifyAppPromise = buildApp();
    }

    const app = await fastifyAppPromise;
    await app.ready();

    // Delegate the HTTP request to Fastify
    app.server.emit('request', req, res);
  } catch (err) {
    // Fallback error response if Fastify fails to handle the request
    console.error('Vercel handler error:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}


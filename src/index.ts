import { Hono } from 'hono';
import { cors } from 'hono/cors';

type Bindings = {
  DIFY_API_KEY: string;
};

const app = new Hono<{ Bindings: Bindings }>();

app.use('*', cors());

app.get('/', (c) => {
  return c.json({ ok: true });
});

app.post('/', async (c) => {
  const difyApiKey = c.env.DIFY_API_KEY;

  if (!difyApiKey) {
    return c.json({ error: 'DIFY_API_KEY is not set' }, 500);
  }

  const difyUrl = 'https://api.dify.ai/v1/workflows/run';

  try {
    const requestBody = await c.req.json();

    const difyResponse = await fetch(difyUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${difyApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...requestBody,
        response_mode: 'streaming',
      }),
    });

    if (!difyResponse.body) {
      return c.json({ error: 'Dify API response has no body' }, 500);
    }

    return new Response(difyResponse.body, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });
  } catch (error) {
    console.error('Error forwarding request to Dify API:', error);
    return c.json({ error: 'Failed to forward request to Dify API' }, 500);
  }
});

export default app;
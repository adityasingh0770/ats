function normalizeOrigin(s) {
  if (!s || !String(s).trim()) return '';
  let o = String(s).trim().replace(/\/$/, '');
  if (o.toLowerCase().endsWith('/api')) o = o.slice(0, -4);
  return o;
}

export const config = { maxDuration: 60 };

/**
 * Same-origin BFF: forward /api/* to Render using RENDER_API_URL (server env on Vercel).
 * Use: unset VITE_API_URL on Vercel, set RENDER_API_URL=https://your-service.onrender.com
 */
export default {
  async fetch(request) {
    const origin = normalizeOrigin(process.env.RENDER_API_URL);
    if (!origin) {
      return Response.json(
        {
          message:
            'Set RENDER_API_URL in Vercel (no /api suffix). Unset VITE_API_URL so the browser calls same-origin /api.',
        },
        { status: 503 }
      );
    }

    const reqUrl = new URL(request.url);
    const sub = reqUrl.pathname.replace(/^\/api\/?/, '').replace(/\/$/, '');
    const apiPath = sub ? `/api/${sub}` : '/api';
    const targetUrl = `${origin}${apiPath}${reqUrl.search}`;

    const hop = new Set(['connection', 'content-length', 'host', 'transfer-encoding', 'keep-alive', 'upgrade']);

    const outHeaders = new Headers();
    request.headers.forEach((value, key) => {
      if (hop.has(key.toLowerCase())) return;
      outHeaders.set(key, value);
    });
    outHeaders.set('host', new URL(origin).host);

    const body =
      request.method === 'GET' || request.method === 'HEAD' ? undefined : await request.arrayBuffer();

    try {
      const r = await fetch(targetUrl, {
        method: request.method,
        headers: outHeaders,
        body: body && body.byteLength ? body : undefined,
        redirect: 'manual',
      });

      const resHeaders = new Headers();
      r.headers.forEach((value, key) => {
        if (key.toLowerCase() === 'transfer-encoding') return;
        resHeaders.append(key, value);
      });

      return new Response(r.body, { status: r.status, headers: resHeaders });
    } catch (e) {
      return Response.json(
        { message: 'API proxy failed', detail: String(e && e.message ? e.message : e) },
        { status: 502 }
      );
    }
  },
};

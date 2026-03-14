/**
 * Vercel serverless proxy for AMap Web Service API.
 * Forwards requests to restapi.amap.com and appends jscode (security key).
 * Do NOT expose AMAP_SECURITY_CODE to the client.
 */
export const config = {
  runtime: 'nodejs',
};

export default async function handler(req, res) {
  const path = req.query.path;
  const pathStr = Array.isArray(path) ? path.join('/') : path || '';
  const jscode = process.env.AMAP_SECURITY_CODE;

  if (!jscode) {
    res.status(500).json({ error: 'AMAP_SECURITY_CODE not configured' });
    return;
  }

  const searchParams = new URLSearchParams();
  Object.entries(req.query || {}).forEach(([k, v]) => {
    if (k !== 'path' && v != null) searchParams.set(k, Array.isArray(v) ? v[0] : v);
  });
  searchParams.set('jscode', jscode);

  const url = `https://restapi.amap.com/${pathStr}?${searchParams.toString()}`;

  try {
    const fetchOptions = {
      method: req.method || 'GET',
      headers: {
        'Content-Type': req.headers['content-type'] || 'application/json',
      },
    };
    if (req.method === 'POST' && req.body) {
      fetchOptions.body = typeof req.body === 'string' ? req.body : JSON.stringify(req.body);
    }

    const response = await fetch(url, fetchOptions);
    const data = await response.text();
    const contentType = response.headers.get('content-type') || 'application/json';

    res.setHeader('Content-Type', contentType);
    res.status(response.status).send(data);
  } catch (err) {
    res.status(502).json({ error: 'Proxy request failed', message: err.message });
  }
}

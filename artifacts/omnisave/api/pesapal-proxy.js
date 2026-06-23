export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')

  if (req.method === 'OPTIONS') {
    return res.status(204).end()
  }

  const path = Array.isArray(req.query.path) ? req.query.path.join('/') : (req.query.path || '')
  const extra = { ...req.query }
  delete extra.path
  const qs = new URLSearchParams(extra).toString()
  const targetUrl = `https://pay.pesapal.com/v3/${path}${qs ? '?' + qs : ''}`

  const forwardHeaders = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  }
  if (req.headers['authorization']) {
    forwardHeaders['Authorization'] = req.headers['authorization']
  }

  const body =
    req.method !== 'GET' && req.method !== 'HEAD'
      ? typeof req.body === 'string' ? req.body : JSON.stringify(req.body)
      : undefined

  try {
    const upstream = await fetch(targetUrl, {
      method: req.method,
      headers: forwardHeaders,
      body,
    })

    const contentType = upstream.headers.get('content-type') || 'application/json'
    const text = await upstream.text()
    res.setHeader('Content-Type', contentType)
    res.status(upstream.status).send(text)
  } catch (err) {
    res.status(502).json({ error: 'Proxy error', detail: String(err) })
  }
}

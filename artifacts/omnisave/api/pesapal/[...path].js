export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')

  if (req.method === 'OPTIONS') {
    res.status(204).end()
    return
  }

  const segments = req.query.path
  const targetPath = Array.isArray(segments) ? segments.join('/') : (segments || '')

  const qs = { ...req.query }
  delete qs.path
  const queryString = new URLSearchParams(qs).toString()
  const targetUrl = `https://pay.pesapal.com/v3/${targetPath}${queryString ? '?' + queryString : ''}`

  const forwardHeaders = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  }
  if (req.headers['authorization']) {
    forwardHeaders['Authorization'] = req.headers['authorization']
  }

  let body
  if (req.method !== 'GET' && req.method !== 'HEAD') {
    body = typeof req.body === 'string' ? req.body : JSON.stringify(req.body)
  }

  try {
    const upstream = await fetch(targetUrl, {
      method: req.method,
      headers: forwardHeaders,
      body,
    })

    const contentType = upstream.headers.get('content-type') || ''
    const text = await upstream.text()

    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS')
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')
    res.setHeader('Content-Type', contentType || 'application/json')
    res.status(upstream.status).send(text)
  } catch (err) {
    res.status(502).json({ error: 'Proxy error', detail: err.message })
  }
}

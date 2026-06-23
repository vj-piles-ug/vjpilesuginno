export const config = { runtime: 'edge' }

export default async function handler(request) {
  if (request.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
    })
  }

  const url = new URL(request.url)
  const segments = url.pathname.replace(/^\/api\/pesapal\/?/, '')
  const targetUrl = `https://pay.pesapal.com/v3/${segments}${url.search}`

  const forwardHeaders = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  }
  const auth = request.headers.get('Authorization')
  if (auth) forwardHeaders['Authorization'] = auth

  const body =
    request.method !== 'GET' && request.method !== 'HEAD'
      ? await request.text()
      : undefined

  let upstream
  try {
    upstream = await fetch(targetUrl, {
      method: request.method,
      headers: forwardHeaders,
      body,
    })
  } catch (err) {
    return new Response(JSON.stringify({ error: 'Proxy fetch failed', detail: String(err) }), {
      status: 502,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
    })
  }

  const contentType = upstream.headers.get('content-type') || 'application/json'
  const responseBody = await upstream.text()

  return new Response(responseBody, {
    status: upstream.status,
    headers: {
      'Content-Type': contentType,
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  })
}

import type { Plugin } from 'vite'
import https from 'https'
import http from 'http'
import { URL } from 'url'

const PESAPAL_BASE = 'https://pay.pesapal.com/v3'
const PREFIX = '/pesapal-proxy'

export function pesapalMiddlewarePlugin(): Plugin {
  return {
    name: 'pesapal-middleware',
    configureServer(server) {
      server.middlewares.use(PREFIX, (req, res) => {
        forwardToPesapal(req, res)
      })
    },
    configurePreviewServer(server) {
      server.middlewares.use(PREFIX, (req, res) => {
        forwardToPesapal(req, res)
      })
    },
  }
}

function forwardToPesapal(req: http.IncomingMessage, res: http.ServerResponse) {
  const targetUrl = new URL(PESAPAL_BASE + (req.url || ''))

  const options = {
    hostname: targetUrl.hostname,
    port: 443,
    path: targetUrl.pathname + targetUrl.search,
    method: req.method,
    headers: {
      ...req.headers,
      host: targetUrl.hostname,
      'accept-encoding': 'identity',
    },
  }

  // Remove hop-by-hop headers
  delete options.headers['transfer-encoding']
  delete options.headers['connection']

  const proxyReq = https.request(options, (proxyRes) => {
    res.writeHead(proxyRes.statusCode || 200, {
      ...proxyRes.headers,
      'access-control-allow-origin': '*',
      'access-control-allow-headers': 'Content-Type, Accept, Authorization',
      'access-control-allow-methods': 'GET, POST, OPTIONS',
    })
    proxyRes.pipe(res)
  })

  proxyReq.on('error', (err) => {
    console.error('[pesapal-middleware] proxy error:', err.message)
    res.writeHead(502)
    res.end(JSON.stringify({ error: 'Proxy error: ' + err.message }))
  })

  req.pipe(proxyReq)
}

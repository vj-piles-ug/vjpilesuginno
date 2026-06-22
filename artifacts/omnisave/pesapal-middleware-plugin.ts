import type { Plugin } from 'vite'
import https from 'https'
import http from 'http'
import { URL } from 'url'

const PESAPAL_BASE = 'https://pay.pesapal.com/v3'
const PREFIX = '/pesapal-proxy'

export function pesapalMiddlewarePlugin(): Plugin {
  function addMiddleware(middlewares: { use: Function }) {
    // Insert at the very front with no path prefix so it runs before Vite's own handlers
    middlewares.use(function pesapalProxy(
      req: http.IncomingMessage,
      res: http.ServerResponse,
      next: Function
    ) {
      const url = req.url || ''
      if (!url.startsWith(PREFIX)) {
        return next()
      }

      console.log(`[pesapal] ${req.method} ${url}`)

      // Strip the prefix so PesaPal sees the real path
      const pesapalPath = url.slice(PREFIX.length) || '/'

      if (req.method === 'OPTIONS') {
        res.writeHead(200, corsHeaders())
        res.end()
        return
      }

      // Buffer the whole body first — avoids stream issues in Vite's connect stack
      const chunks: Buffer[] = []
      req.on('data', (c: Buffer) => chunks.push(c))
      req.on('error', (err) => {
        console.error('[pesapal] body read error:', err.message)
        res.writeHead(500)
        res.end(JSON.stringify({ error: err.message }))
      })
      req.on('end', () => {
        const body = Buffer.concat(chunks)

        const targetUrl = new URL(PESAPAL_BASE + pesapalPath)
        const outHeaders: http.OutgoingHttpHeaders = {}
        for (const [k, v] of Object.entries(req.headers)) {
          // Strip hop-by-hop + encoding headers so PesaPal returns plain JSON
          if (['host', 'connection', 'transfer-encoding', 'accept-encoding'].includes(k)) continue
          outHeaders[k] = v as string
        }
        outHeaders['host'] = targetUrl.hostname
        outHeaders['content-length'] = String(body.length)

        const proxyReq = https.request(
          {
            hostname: targetUrl.hostname,
            port: 443,
            path: targetUrl.pathname + targetUrl.search,
            method: req.method,
            headers: outHeaders,
          },
          (proxyRes) => {
            const parts: Buffer[] = []
            proxyRes.on('data', (c: Buffer) => parts.push(c))
            proxyRes.on('end', () => {
              const responseBody = Buffer.concat(parts)
              console.log(`[pesapal] → ${proxyRes.statusCode} (${responseBody.length}b)`)
              res.writeHead(proxyRes.statusCode || 200, {
                'content-type': proxyRes.headers['content-type'] || 'application/json',
                ...corsHeaders(),
              })
              res.end(responseBody)
            })
          }
        )

        proxyReq.on('error', (err) => {
          console.error('[pesapal] upstream error:', err.message)
          res.writeHead(502)
          res.end(JSON.stringify({ error: err.message }))
        })

        if (body.length > 0) proxyReq.write(body)
        proxyReq.end()
      })
    })
  }

  return {
    name: 'pesapal-middleware',
    configureServer(server) {
      addMiddleware(server.middlewares)
    },
    configurePreviewServer(server) {
      addMiddleware(server.middlewares)
    },
  }
}

function corsHeaders() {
  return {
    'access-control-allow-origin': '*',
    'access-control-allow-headers': 'Content-Type, Accept, Authorization',
    'access-control-allow-methods': 'GET, POST, OPTIONS',
  }
}

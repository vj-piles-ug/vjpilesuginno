---
name: PesaPal proxy header stripping
description: PesaPal returns 405 when browser-specific headers (Origin, Referer, Sec-Fetch-*) are forwarded to it — must be stripped by the proxy.
---

## Rule
The Vite proxy for `/pesapal-proxy` MUST strip these headers before forwarding to PesaPal:
- `accept-encoding` — PesaPal returns gzip; browser can't decode without Content-Encoding header
- `origin` — PesaPal returns 405 Method Not Allowed when it sees an unrecognised Origin
- `referer`
- `sec-fetch-site`, `sec-fetch-mode`, `sec-fetch-dest`, `sec-fetch-user`

**Why:** curl tests pass (no Origin header) but browser fetches fail (Origin always included). PesaPal API rejects requests with unrecognised Origin headers with HTTP 405.

**How to apply:** In `vite.config.ts` `server.proxy["/pesapal-proxy"].configure`, strip headers in the `proxyReq` event. All six removals must be present.

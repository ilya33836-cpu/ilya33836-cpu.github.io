import { createServer } from 'node:http'
import { createReadStream, existsSync, readFileSync, statSync } from 'node:fs'
import { extname, join, normalize, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { sendLead } from './lead.mjs'

const here = fileURLToPath(new URL('.', import.meta.url))
const root = resolve(here, '..')
const distDir = join(root, 'dist')
const port = Number(process.env.PORT ?? 3000)

const mimeTypes = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.txt': 'text/plain; charset=utf-8',
  '.webmanifest': 'application/manifest+json',
}

function loadEnv() {
  const file = join(root, '.env')
  if (!existsSync(file)) return
  for (const line of readFileSync(file, 'utf8').split('\n')) {
    const match = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/)
    if (!match) continue
    const [, key, raw] = match
    if (!process.env[key]) process.env[key] = raw.replace(/^["']|["']$/g, '')
  }
}

function readBody(request) {
  return new Promise((done) => {
    let data = ''
    request.on('data', (chunk) => {
      data += chunk
      if (data.length > 20_000) request.destroy()
    })
    request.on('end', () => done(data))
  })
}

function json(response, code, payload) {
  const body = JSON.stringify(payload)
  response.writeHead(code, {
    'Content-Type': 'application/json; charset=utf-8',
    'Content-Length': Buffer.byteLength(body),
  })
  response.end(body)
}

function sendFile(response, file, cacheControl) {
  const type = mimeTypes[extname(file)] ?? 'application/octet-stream'
  response.writeHead(200, { 'Content-Type': type, 'Cache-Control': cacheControl })
  createReadStream(file).pipe(response)
}

loadEnv()

const server = createServer(async (request, response) => {
  const url = new URL(request.url ?? '/', `http://${request.headers.host ?? 'localhost'}`)

  if (url.pathname === '/api/lead') {
    if (request.method !== 'POST') {
      json(response, 405, { ok: false, error: 'method_not_allowed' })
      return
    }

    let lead = {}
    try {
      lead = JSON.parse((await readBody(request)) || '{}')
    } catch {
      lead = {}
    }

    const result = await sendLead(lead, process.env)
    if (!result.ok) {
      console.error('[lead] не отправлена:', result.error)
    } else {
      console.log('[lead] заявка отправлена в Telegram')
    }

    json(response, 200, result)
    return
  }

  if (request.method !== 'GET' && request.method !== 'HEAD') {
    response.writeHead(405).end()
    return
  }

  // Не выпускаем запрос за пределы dist.
  const relative = normalize(decodeURIComponent(url.pathname)).replace(/^(\.\.[/\\])+/, '')
  const target = join(distDir, relative)
  const safe = target.startsWith(distDir)

  if (safe && relative !== '/' && existsSync(target) && statSync(target).isFile()) {
    const immutable = relative.startsWith('/assets/')
    sendFile(response, target, immutable ? 'public, max-age=31536000, immutable' : 'public, max-age=3600')
    return
  }

  // SPA: все неизвестные пути отдаём index.html.
  sendFile(response, join(distDir, 'index.html'), 'no-cache')
})

server.listen(port, '0.0.0.0', () => {
  console.log(`ILYA portfolio: http://0.0.0.0:${port} (${distDir})`)
})

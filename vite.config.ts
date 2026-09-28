import { defineConfig, loadEnv } from 'vite'
import type { Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { sendLead } from './server/lead'
import type { Lead, LeadEnv } from './server/lead'
type DevRequest = {
  method?: string
  url?: string
  on: (event: 'data' | 'end', callback: (chunk?: unknown) => void) => void
}

/** Локальный аналог serverless-функции: /api/lead работает и на npm run dev. */
function leadApi(env: LeadEnv): Plugin {
  return {
    name: 'lead-api-dev',
    apply: 'serve',
    configureServer(server) {
      server.middlewares.use(async (incoming, res, next) => {
        const req = incoming as unknown as DevRequest
        if (!req.url?.startsWith('/api/lead')) {
          next()
          return
        }

        const respond = (code: number, payload: unknown) => {
          res.statusCode = code
          res.setHeader('Content-Type', 'application/json')
          res.end(JSON.stringify(payload))
        }

        if (req.method === 'OPTIONS') {
          respond(204, {})
          return
        }
        if (req.method !== 'POST') {
          respond(405, { ok: false, error: 'method_not_allowed' })
          return
        }

        const body = await new Promise<string>((resolve) => {
          let data = ''
          req.on('data', (chunk) => {
            data += String(chunk)
          })
          req.on('end', () => resolve(data))
        })

        let lead: Lead = {}
        try {
          lead = JSON.parse(body) as Lead
        } catch {
          lead = {}
        }

        const result = await sendLead(lead, env)
        if (!result.ok) {
          server.config.logger.info(
            `  ➜  заявка не отправлена в Telegram: ${result.error} (проверьте .env)`,
          )
        }
        respond(200, result)
      })
    },
  }
}

export default defineConfig(({ mode }) => {
  const cwd = (globalThis as { process?: { cwd?: () => string } }).process?.cwd?.() ?? '.'
  const env = loadEnv(mode, cwd, '')

  return {
    plugins: [react(), tailwindcss(), leadApi(env)],
    build: {
      target: 'es2020',
      rollupOptions: {
        output: {
          manualChunks: {
            motion: ['framer-motion'],
          },
        },
      },
    },
  }
})

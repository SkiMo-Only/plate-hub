import fs from 'node:fs'
import path from 'node:path'
import type { IncomingMessage, ServerResponse } from 'node:http'
import type { Plugin } from 'vite'
import { writeGeneratedCatalog } from './write-catalog.ts'
import { scanPlates } from './scan-plates.ts'

const MIME: Record<string, string> = {
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.dxf': 'application/dxf',
  '.step': 'application/step',
  '.stp': 'application/step',
  '.md': 'text/markdown; charset=utf-8',
}

function isSafePlatePath(repoRoot: string, absolute: string): boolean {
  const resolved = path.resolve(absolute)
  const mx = path.resolve(repoRoot, 'MX') + path.sep
  const ec = path.resolve(repoRoot, 'EC') + path.sep
  return resolved.startsWith(mx) || resolved.startsWith(ec)
}

function sendFile(repoRoot: string, req: IncomingMessage, res: ServerResponse, next: () => void) {
  const url = req.url?.split('?')[0] ?? ''
  const match = url.match(/^\/files\/((?:MX|EC)\/.+)$/)
  if (!match) {
    next()
    return
  }

  const relative = decodeURIComponent(match[1])
  const absolute = path.resolve(repoRoot, relative)

  if (!isSafePlatePath(repoRoot, absolute) || !fs.existsSync(absolute) || !fs.statSync(absolute).isFile()) {
    next()
    return
  }

  res.setHeader('Content-Type', MIME[path.extname(absolute).toLowerCase()] ?? 'application/octet-stream')
  fs.createReadStream(absolute).pipe(res)
}

export function plateHubPlugin(repoRoot: string, webRoot: string): Plugin {
  return {
    name: 'plate-hub',
    configResolved() {
      writeGeneratedCatalog(repoRoot, webRoot)
    },
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        sendFile(repoRoot, req, res, next)
      })
    },
    configurePreviewServer(server) {
      server.middlewares.use((req, res, next) => {
        sendFile(repoRoot, req, res, next)
      })
    },
    generateBundle() {
      this.emitFile({
        type: 'asset',
        fileName: 'catalog.json',
        source: `${JSON.stringify(scanPlates(repoRoot), null, 2)}\n`,
      })
    },
    writeBundle(options) {
      const dist = options.dir ?? path.join(repoRoot, 'web', 'dist')
      for (const family of ['MX', 'EC'] as const) {
        fs.cpSync(path.join(repoRoot, family), path.join(dist, 'files', family), { recursive: true })
      }
    },
  }
}

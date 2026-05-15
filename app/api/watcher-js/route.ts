import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const uid = request.nextUrl.searchParams.get('uid') ?? 'UNKNOWN'

  const js = `const USER_ID = '${uid}'
const SECRET   = '9xHvhnwMFaoBlSTEuejtQmsU6PCbVgWy'
const API_URL  = 'https://simhub-a2ye.vercel.app/api/import-ibt'
const fs       = require('fs')
const path     = require('path')
const os       = require('os')
const DIR      = path.join(os.homedir(), 'Documents', 'iRacing', 'telemetry')
const PF       = path.join(os.homedir(), 'simhub-processed.json')

function log(m) { console.log('[' + new Date().toLocaleTimeString('fr-FR') + '] ' + m) }
function load() { try { return new Set(JSON.parse(fs.readFileSync(PF, 'utf8'))) } catch { return new Set() } }
function save(s) { fs.writeFileSync(PF, JSON.stringify([...s])) }

async function upload(fp) {
  const form = new FormData()
  form.append('ibt', new Blob([fs.readFileSync(fp)]), path.basename(fp))
  const r = await fetch(API_URL, {
    method: 'POST',
    headers: { 'x-secret': SECRET, 'x-user-id': USER_ID },
    body: form,
  })
  if (!r.ok) throw new Error('HTTP ' + r.status)
  return r.json()
}

function getFiles(dir) {
  if (!fs.existsSync(dir)) return []
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap(e =>
    e.isDirectory() ? getFiles(path.join(dir, e.name))
    : e.name.endsWith('.ibt') ? [path.join(dir, e.name)] : []
  )
}

async function scan() {
  const p = load()
  for (const fp of getFiles(DIR)) {
    const k = path.relative(DIR, fp)
    if (p.has(k)) continue
    log('Nouvelle session: ' + path.basename(fp))
    try {
      const d = await upload(fp)
      p.add(k); save(p)
      log('OK - ' + d.circuit)
    } catch (e) { log('Erreur: ' + e.message) }
  }
}

log('SimHub Watcher demarre')
log('Dossier: ' + DIR)
log('En attente de sessions iRacing...')
scan()
setInterval(scan, 30000)
`

  return new NextResponse(js, {
    headers: {
      'Content-Type': 'text/plain',
      'Cache-Control': 'no-store',
    },
  })
}

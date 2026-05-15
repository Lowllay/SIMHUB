import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return NextResponse.json({ error: 'Non connecté' }, { status: 401 })

  const script = `// SimHub Watcher — import automatique iRacing
// Double-clique sur ce fichier pour le lancer, ou ajoute-le au démarrage Windows
const USER_ID       = '${user.id}'
const SECRET        = '9xHvhnwMFaoBlSTEuejtQmsU6PCbVgWy'
const TELEMETRY_DIR = require('path').join(require('os').homedir(), 'Documents', 'iRacing', 'telemetry')
const PROCESSED_FILE = require('path').join(__dirname, '.simhub-processed.json')
const API_URL       = 'https://simhub-a2ye.vercel.app/api/import-ibt'

const fs   = require('fs')
const path = require('path')

function log(msg) {
  const time = new Date().toLocaleTimeString('fr-FR')
  console.log('[' + time + '] ' + msg)
}

function loadProcessed() {
  try { return new Set(JSON.parse(fs.readFileSync(PROCESSED_FILE, 'utf8'))) }
  catch { return new Set() }
}

function saveProcessed(set) {
  fs.writeFileSync(PROCESSED_FILE, JSON.stringify([...set]))
}

async function uploadFile(filePath) {
  const fileName   = path.basename(filePath)
  const fileBuffer = fs.readFileSync(filePath)
  const blob       = new Blob([fileBuffer])
  const form       = new FormData()
  form.append('ibt', blob, fileName)

  const res = await fetch(API_URL, {
    method:  'POST',
    headers: { 'x-secret': SECRET, 'x-user-id': USER_ID },
    body:    form,
  })
  if (!res.ok) throw new Error('HTTP ' + res.status + ': ' + await res.text())
  return await res.json()
}

function getAllIbtFiles(dir) {
  if (!fs.existsSync(dir)) return []
  const files = []
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) files.push(...getAllIbtFiles(full))
    else if (entry.name.endsWith('.ibt')) files.push(full)
  }
  return files
}

async function scan() {
  const processed = loadProcessed()
  const files     = getAllIbtFiles(TELEMETRY_DIR)
  for (const filePath of files) {
    const key = path.relative(TELEMETRY_DIR, filePath)
    if (processed.has(key)) continue
    log('Nouvelle session : ' + path.basename(filePath))
    try {
      const data = await uploadFile(filePath)
      processed.add(key)
      saveProcessed(processed)
      log('OK -- ' + (data.circuit || ''))
    } catch (err) {
      log('Erreur : ' + err.message)
    }
  }
}

log('SimHub Watcher demarre')
log('Dossier : ' + TELEMETRY_DIR)
log('En attente de sessions iRacing...')
scan()
setInterval(scan, 30000)
`

  return new NextResponse(script, {
    headers: {
      'Content-Type': 'application/octet-stream',
      'Content-Disposition': 'attachment; filename="SimHub-Watcher.js"',
    },
  })
}

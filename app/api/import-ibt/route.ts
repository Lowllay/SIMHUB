import { NextRequest, NextResponse } from 'next/server'
import { createClient as createSupabaseClient } from '@supabase/supabase-js'

const SECRET = process.env.IBT_WATCHER_SECRET

function secToLaptime(sec: number): string {
  const m = Math.floor(sec / 60)
  const s = sec % 60
  const ms = Math.round((s % 1) * 1000)
  return `${m}:${String(Math.floor(s)).padStart(2, '0')}.${String(ms).padStart(3, '0')}`
}

function parseIbt(buffer: Buffer): {
  circuit: string; car: string; category: string
  sessionType: string; bestLapSec: number | null; laps: number
} | null {
  if (buffer.length < 32) return null
  const sessionInfoLen    = buffer.readInt32LE(16)
  const sessionInfoOffset = buffer.readInt32LE(20)
  if (sessionInfoOffset <= 0 || sessionInfoOffset + sessionInfoLen > buffer.length) return null

  const yaml = buffer.toString('utf8', sessionInfoOffset, sessionInfoOffset + sessionInfoLen)
  const get = (key: string) => {
    const m = yaml.match(new RegExp(`${key}:\\s*([^\\n]+)`))
    return m ? m[1].trim() : ''
  }

  const circuit     = get('TrackDisplayName') || get('TrackName') || 'Inconnu'
  const car         = get('CarScreenName') || get('CarPath') || 'Inconnu'
  const sessionName = get('SessionName') || 'PRACTICE'
  const ftMatch     = yaml.match(/FastestTime:\s*([\d.]+)/)
  const bestLapSec  = ftMatch && parseFloat(ftMatch[1]) > 0 ? parseFloat(ftMatch[1]) : null
  const lapMatch    = yaml.match(/ResultsNumLaps:\s*(\d+)/)
  const laps        = lapMatch ? parseInt(lapMatch[1]) : 0
  const carClass    = get('CarClassShortName') || ''
  const category    = carClass.toUpperCase().includes('GT4') ? 'GT4'
    : carClass.toUpperCase().includes('LMH') ? 'LMH'
    : carClass.toUpperCase().includes('LMDH') ? 'LMDh' : 'GT3'

  const typeMap: Record<string, string> = {
    QUALIFY: 'Qualif', QUALIFYING: 'Qualif',
    RACE: 'Course',
    PRACTICE: 'Essais', 'OPEN PRACTICE': 'Essais',
  }
  const sessionType = typeMap[sessionName.toUpperCase()] ?? 'Essais'
  return { circuit, car, category, sessionType, bestLapSec, laps }
}

export async function POST(request: NextRequest) {
  if (request.headers.get('x-secret') !== SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const formData = await request.formData()
  const file = formData.get('ibt') as File | null
  if (!file) return NextResponse.json({ error: 'No file' }, { status: 400 })

  const buffer = Buffer.from(await file.arrayBuffer())
  const info   = parseIbt(buffer)
  if (!info) return NextResponse.json({ error: 'Invalid .ibt' }, { status: 400 })

  const supabase = createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  // Récupère le user_id envoyé par le watcher
  const userId = request.headers.get('x-user-id') ?? null

  const { error } = await supabase.from('sessions').insert({
    circuit:  info.circuit,
    car:      info.car,
    category: info.category,
    type:     info.sessionType,
    sim:      'iRacing',
    laptime:  info.bestLapSec ? secToLaptime(info.bestLapSec) : null,
    laps:     info.laps || null,
    user_id:  userId,
  })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true, circuit: info.circuit, laptime: info.bestLapSec })
}

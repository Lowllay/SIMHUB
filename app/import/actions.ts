'use server'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

function secToLaptime(sec: number): string {
  const m = Math.floor(sec / 60)
  const s = sec % 60
  const ms = Math.round((s % 1) * 1000)
  return `${m}:${String(Math.floor(s)).padStart(2, '0')}.${String(ms).padStart(3, '0')}`
}

function parseIbt(buffer: Buffer): {
  circuit: string
  car: string
  category: string
  sessionType: string
  bestLapSec: number | null
  laps: number
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

  // Best lap time (seconds)
  const ftMatch   = yaml.match(/FastestTime:\s*([\d.]+)/)
  const bestLapSec = ftMatch && parseFloat(ftMatch[1]) > 0 ? parseFloat(ftMatch[1]) : null

  // Number of laps
  const lapMatch = yaml.match(/ResultsNumLaps:\s*(\d+)/)
  const laps     = lapMatch ? parseInt(lapMatch[1]) : 0

  // Car category
  const carClass = get('CarClassShortName') || get('CarClassName') || ''
  const category = carClass.toUpperCase().includes('GT4') ? 'GT4'
    : carClass.toUpperCase().includes('LMH') ? 'LMH'
    : carClass.toUpperCase().includes('LMDh') ? 'LMDh'
    : 'GT3'

  const typeMap: Record<string, string> = {
    QUALIFY: 'Qualif', QUALIFYING: 'Qualif',
    RACE: 'Course',
    PRACTICE: 'Essais', 'OPEN PRACTICE': 'Essais',
  }
  const sessionType = typeMap[sessionName.toUpperCase()] ?? 'Essais'

  return { circuit, car, category, sessionType, bestLapSec, laps }
}

export async function importIbt(formData: FormData): Promise<{ error: string } | void> {
  const file = formData.get('ibt') as File | null
  if (!file || !file.name.endsWith('.ibt')) return { error: 'Sélectionne un fichier .ibt' }

  const buffer = Buffer.from(await file.arrayBuffer())
  const info   = parseIbt(buffer)
  if (!info) return { error: 'Fichier .ibt invalide ou incomplet' }

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  await supabase.from('sessions').insert({
    circuit:  info.circuit,
    car:      info.car,
    category: info.category,
    type:     info.sessionType,
    sim:      'iRacing',
    laptime:  info.bestLapSec ? secToLaptime(info.bestLapSec) : null,
    laps:     info.laps || null,
    user_id:  user?.id ?? null,
  })

  redirect('/sessions')
}

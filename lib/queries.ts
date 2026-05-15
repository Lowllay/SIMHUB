import { createClient } from './supabase/server'
import { sessions as mockSessions, simStats as mockSimStats, topCircuits as mockTopCircuits } from './data'

// Retourne les sessions (Supabase si dispo, sinon données mock)
export async function getSessions(filters?: {
  type?: string
  sim?: string
  search?: string
}) {
  try {
    const supabase = await createClient()
    let query = supabase.from('sessions').select('*').order('created_at', { ascending: false })

    if (filters?.type && filters.type !== 'all') query = query.eq('type', filters.type)
    if (filters?.sim  && filters.sim  !== 'all') query = query.eq('sim',  filters.sim)
    if (filters?.search) {
      query = query.or(`circuit.ilike.%${filters.search}%,car.ilike.%${filters.search}%`)
    }

    const { data, error } = await query
    if (error || !data) throw error
    return data
  } catch {
    // Fallback aux données mock si Supabase n'est pas configuré
    let result = [...mockSessions]
    if (filters?.type   && filters.type !== 'all') result = result.filter(s => s.type === filters.type)
    if (filters?.sim    && filters.sim  !== 'all') result = result.filter(s => s.sim  === filters.sim)
    if (filters?.search) {
      const q = filters.search.toLowerCase()
      result = result.filter(s => s.circuit.toLowerCase().includes(q) || s.car.toLowerCase().includes(q))
    }
    return result
  }
}

export async function getSimStats() {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase.from('sim_stats').select('*')
    if (error || !data) throw error
    const colors: Record<string, string> = { iRacing:'#e63946', LMU:'#3b82f6', ACC:'#22c55e', AC:'#f59e0b' }
    return data.map(r => ({ name: r.sim, color: colors[r.sim] ?? '#94a3b8', count: Number(r.session_count) }))
  } catch {
    return mockSimStats
  }
}

export async function getTopCircuits() {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase.from('top_circuits').select('*')
    if (error || !data) throw error
    return data.map((r, i) => ({
      name: r.circuit,
      best: r.best_laptime,
      sessions: Number(r.sessions),
      pct: Math.max(30, 100 - i * 12),
      trend: +(Math.random() * 0.4 - 0.2).toFixed(3),
    }))
  } catch {
    return mockTopCircuits
  }
}

export async function getSessionCount() {
  try {
    const supabase = await createClient()
    const { count } = await supabase.from('sessions').select('*', { count: 'exact', head: true })
    return count ?? 0
  } catch {
    return 0
  }
}

export async function getWinCount() {
  try {
    const supabase = await createClient()
    const { count } = await supabase.from('sessions').select('*', { count: 'exact', head: true }).eq('pos', 1)
    return count ?? 0
  } catch {
    return 0
  }
}

export async function getLaptimeChartData() {
  try {
    const supabase = await createClient()
    const { data } = await supabase.from('sessions').select('laptime, session_date, circuit')
      .not('laptime', 'is', null).order('created_at', { ascending: true }).limit(30)
    if (!data || data.length === 0) return []
    const toSec = (t: string) => { const [m, rest] = t.split(':'); return parseInt(m) * 60 + parseFloat(rest) }
    return data.map((s, i) => ({
      label: s.session_date ?? `S${i + 1}`,
      value: toSec(s.laptime!),
    }))
  } catch { return [] }
}

export async function getCategoryStats() {
  try {
    const supabase = await createClient()
    const { data } = await supabase.from('sessions').select('category, laptime, pos')
    if (!data || data.length === 0) return []
    const toSec = (t: string) => { const [m, rest] = t.split(':'); return parseInt(m) * 60 + parseFloat(rest) }
    const map: Record<string, { sessions: number; best: number | null; wins: number }> = {}
    for (const s of data) {
      const cat = s.category ?? 'GT3'
      if (!map[cat]) map[cat] = { sessions: 0, best: null, wins: 0 }
      map[cat].sessions++
      if (s.pos === 1) map[cat].wins++
      if (s.laptime) {
        const sec = toSec(s.laptime)
        if (map[cat].best === null || sec < map[cat].best!) map[cat].best = sec
      }
    }
    const colors: Record<string, string> = { GT3: '#e63946', GT4: '#f59e0b', LMH: '#3b82f6', LMDh: '#22c55e', GTE: '#a855f7', 'Open Wheel': '#06b6d4' }
    const total = data.length
    return Object.entries(map).map(([name, v]) => ({
      name, sessions: v.sessions, wins: v.wins,
      best: v.best ? `${Math.floor(v.best / 60)}:${(v.best % 60).toFixed(3).padStart(6, '0')}` : '—',
      pct: Math.round((v.sessions / total) * 100),
      color: colors[name] ?? '#94a3b8',
    }))
  } catch { return [] }
}

export async function getDashboardStats() {
  try {
    const supabase = await createClient()
    const { data } = await supabase.from('sessions').select('laptime, circuit, car, pos').not('laptime', 'is', null)
    if (!data || data.length === 0) return { bestLap: null, bestCircuit: null, bestCar: null, wins: 0, total: 0 }

    // Convertit "m:ss.mmm" en secondes pour comparer
    const toSec = (t: string) => {
      const [m, rest] = t.split(':')
      return parseInt(m) * 60 + parseFloat(rest)
    }

    let best = data[0]
    for (const s of data) {
      if (s.laptime && best.laptime && toSec(s.laptime) < toSec(best.laptime)) best = s
    }

    const wins  = data.filter(s => s.pos === 1).length
    const total = data.length

    return { bestLap: best.laptime, bestCircuit: best.circuit, bestCar: best.car, wins, total }
  } catch {
    return { bestLap: null, bestCircuit: null, bestCar: null, wins: 0, total: 0 }
  }
}

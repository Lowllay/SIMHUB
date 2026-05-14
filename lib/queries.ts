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
    return count ?? mockSessions.length
  } catch {
    return mockSessions.length
  }
}

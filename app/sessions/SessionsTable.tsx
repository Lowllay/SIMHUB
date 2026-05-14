'use client'
import { useState, useMemo } from 'react'
import { type Session, type SessionType, type SimName } from '@/lib/data'

const TYPE_FILTERS = ['all', 'Course', 'Qualif', 'Essais'] as const
const SIM_FILTERS  = ['all', 'iRacing', 'LMU', 'ACC', 'AC'] as const

export default function SessionsTable({ sessions }: { sessions: Session[] }) {
  const [q, setQ]       = useState('')
  const [type, setType] = useState<'all' | SessionType>('all')
  const [sim, setSim]   = useState<'all' | SimName>('all')

  const filtered = useMemo(() =>
    sessions.filter(s => {
      const mq = !q || s.circuit.toLowerCase().includes(q.toLowerCase()) || s.car.toLowerCase().includes(q.toLowerCase())
      const mt = type === 'all' || s.type === type
      const ms = sim  === 'all' || s.sim  === sim
      return mq && mt && ms
    }),
    [sessions, q, type, sim]
  )

  return (
    <>
      {/* Toolbar */}
      <div className="flex items-center gap-3 mb-4 flex-wrap">
        <div className="relative">
          <svg className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--muted)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
          </svg>
          <input value={q} onChange={e => setQ(e.target.value)} type="text" placeholder="Circuit, voiture…" className="inp pl-8 w-52" />
        </div>
        <div className="flex gap-1 p-1 rounded-lg" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
          {TYPE_FILTERS.map(f => (
            <button key={f} onClick={() => setType(f as 'all' | SessionType)} className={`tab ${type===f?'on':'off'} text-xs`}>
              {f === 'all' ? 'Toutes' : f}
            </button>
          ))}
        </div>
        <select value={sim} onChange={e => setSim(e.target.value as 'all' | SimName)} className="inp">
          {SIM_FILTERS.map(f => <option key={f} value={f}>{f === 'all' ? 'Tous les sims' : f}</option>)}
        </select>
        <span className="ml-auto text-xs" style={{ color: 'var(--muted)' }}>{filtered.length} sessions</span>
      </div>

      {/* Table */}
      <div className="card p-0 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr style={{ background: 'var(--surface)', borderBottom: '1px solid var(--border)' }}>
              {['Circuit','Voiture','Cat.','Type','Sim','Météo','Meilleur Tour','Tours','Pos.','Setup','Date'].map((h, i) => (
                <th key={h} className={`px-4 py-3 text-xs font-semibold uppercase tracking-wide ${i<6?'text-left':'text-right'}`} style={{ color: 'var(--dim)' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map(s => (
              <tr key={s.id} className="trow cursor-pointer">
                <td className="px-4 py-2.5">
                  <div className="text-sm font-medium text-white">{s.circuit}</div>
                  <div className="text-xs" style={{ color: 'var(--dim)' }}>{s.country}</div>
                </td>
                <td className="px-4 py-2.5 text-xs text-white">{s.car}</td>
                <td className="px-4 py-2.5"><span className="badge b-blue">{s.category}</span></td>
                <td className="px-4 py-2.5">
                  <span className={`badge ${s.type==='Course'?'b-red':s.type==='Qualif'?'b-yellow':'b-gray'}`}>{s.type}</span>
                </td>
                <td className="px-4 py-2.5 text-xs text-white">{s.sim}</td>
                <td className="px-4 py-2.5 text-base">{s.weather}</td>
                <td className="px-4 py-2.5 text-right font-mono text-sm text-white font-semibold">{s.laptime}</td>
                <td className="px-4 py-2.5 text-right text-sm text-white">{s.laps}</td>
                <td className="px-4 py-2.5 text-right">
                  {s.pos > 0
                    ? <span className={`font-bold text-sm ${s.pos===1?'text-yellow-400':s.pos<=3?'text-green-400':'text-white'}`}>P{s.pos}</span>
                    : <span style={{ color: 'var(--dim)' }}>—</span>}
                </td>
                <td className="px-4 py-2.5 text-right">
                  {s.setup ? <span className="badge b-green">{s.setup}</span> : <span style={{ color: 'var(--dim)' }}>—</span>}
                </td>
                <td className="px-4 py-2.5 text-right text-xs" style={{ color: 'var(--muted)' }}>{s.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16">
            <svg className="w-10 h-10 mb-3" style={{ color: 'var(--border)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
            <p className="text-sm" style={{ color: 'var(--dim)' }}>Aucune session trouvée</p>
          </div>
        )}
      </div>
    </>
  )
}

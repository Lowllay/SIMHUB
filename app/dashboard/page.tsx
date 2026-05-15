import Header from '@/components/Header'
import { getSessions, getSimStats, getTopCircuits, getDashboardStats } from '@/lib/queries'
import LaptimeChart from './LaptimeChart'
import SimChart from './SimChart'
import Link from 'next/link'

export default async function Dashboard() {
  const [allSessions, simStats, topCircuits, stats] = await Promise.all([
    getSessions(),
    getSimStats(),
    getTopCircuits(),
    getDashboardStats(),
  ])
  const recent = allSessions.slice(0, 7)

  return (
    <>
      <Header title="Dashboard" subtitle="Vue d'ensemble de tes performances" />
      <div className="flex-1 overflow-y-auto p-5">

        {/* KPIs */}
        <div className="grid grid-cols-4 gap-4 mb-5">
          {[
            {
              label: 'Meilleur Tour',
              value: stats.bestLap ?? '—',
              sub: stats.bestLap ? `${stats.bestCircuit} · ${stats.bestCar}` : 'Aucune session',
              trend: stats.bestLap ? '↑ meilleur chrono' : '—', trendSub: '', trendCls: 'pos',
              iconColor: 'rgba(230,57,70,.1)', iconStroke: 'var(--accent)',
              icon: <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>,
            },
            {
              label: 'Simulateurs',
              value: String(simStats.length > 0 ? simStats.reduce((a, s) => a + s.count, 0) : 0),
              sub: simStats.length > 0 ? simStats.map(s => s.name).join(' · ') : 'Aucune session',
              trend: simStats.length > 0 ? `${simStats.length} sims` : '—', trendSub: '', trendCls: '',
              iconColor: 'rgba(34,197,94,.1)', iconStroke: 'var(--green)',
              icon: <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>,
            },
            {
              label: 'Victoires',
              value: String(stats.wins),
              sub: stats.total > 0 ? `Sur ${stats.total} courses · ${((stats.wins / stats.total) * 100).toFixed(1)}%` : 'Aucune session',
              trend: stats.wins > 0 ? `↑ ${stats.wins}` : '—', trendSub: 'total', trendCls: '',
              iconColor: 'rgba(245,158,11,.1)', iconStroke: 'var(--yellow)',
              icon: <path strokeLinecap="round" strokeLinejoin="round" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"/>,
            },
            {
              label: 'Sessions',
              value: String(stats.total),
              sub: topCircuits.length > 0 ? `${topCircuits.length} circuits` : 'Aucune session',
              trend: stats.total > 0 ? `↑ ${stats.total}` : '—', trendSub: 'total', trendCls: '',
              iconColor: 'rgba(59,130,246,.1)', iconStroke: 'var(--blue2)',
              icon: <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 10h16M4 14h16M4 18h16"/>,
            },
          ].map(k => (
            <div key={k.label} className="kpi-card">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold uppercase tracking-wide" style={{ color: 'var(--dim)' }}>{k.label}</span>
                <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: k.iconColor }}>
                  <svg className="w-3.5 h-3.5" style={{ color: k.iconStroke }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>{k.icon}</svg>
                </div>
              </div>
              <div className="text-2xl font-bold text-white">{k.value}</div>
              <div className="text-xs mt-0.5 mb-2" style={{ color: 'var(--dim)' }}>{k.sub}</div>
              <div className={`text-xs ${k.trendCls}`} style={!k.trendCls ? { color: 'var(--blue2)' } : {}}>
                {k.trend} <span style={{ color: 'var(--dim)' }}>{k.trendSub}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Charts */}
        <div className="grid grid-cols-3 gap-4 mb-5">
          <div className="card col-span-2">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-semibold text-white">Évolution des chronos</h3>
                <p className="text-xs mt-0.5" style={{ color: 'var(--dim)' }}>30 derniers jours · Spa-Francorchamps</p>
              </div>
              <div className="flex gap-1 p-1 rounded-lg" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
                {['30j','3M','1A'].map((t,i) => (
                  <button key={t} className={`tab ${i===0?'on':'off'} text-xs py-1`}>{t}</button>
                ))}
              </div>
            </div>
            <div style={{ height: 190 }}><LaptimeChart /></div>
          </div>

          <div className="card">
            <h3 className="text-sm font-semibold text-white mb-1">Simulateurs</h3>
            <p className="text-xs mb-3" style={{ color: 'var(--dim)' }}>Répartition des sessions</p>
            <div style={{ height: 130, marginBottom: 12 }}><SimChart /></div>
            <div className="space-y-2">
              {simStats.map(s => (
                <div key={s.name} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full" style={{ background: s.color }} />
                    <span style={{ color: 'var(--muted)' }}>{s.name}</span>
                  </div>
                  <span className="font-semibold text-white">{s.count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="grid grid-cols-3 gap-4">
          {/* Top circuits */}
          <div className="card">
            <h3 className="text-sm font-semibold text-white mb-4">Top Circuits</h3>
            <div className="space-y-4">
              {topCircuits.map(c => (
                <div key={c.name}>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-medium text-white">{c.name}</span>
                    <span className="text-xs font-mono" style={{ color: 'var(--muted)' }}>{c.best}</span>
                  </div>
                  <div className="ptrack h-1.5 mb-1">
                    <div className="pfill h-1.5" style={{ width: `${c.pct}%`, background: 'var(--accent)' }} />
                  </div>
                  <div className="flex justify-between">
                    <span className="text-xs" style={{ color: 'var(--dim)' }}>{c.sessions} sessions</span>
                    <span className={`text-xs ${c.trend < 0 ? 'pos' : 'neg'}`}>{c.trend > 0 ? '+' : ''}{c.trend}s</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent sessions */}
          <div className="card col-span-2 p-0 overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4">
              <h3 className="text-sm font-semibold text-white">Sessions Récentes</h3>
              <Link href="/sessions" className="text-xs" style={{ color: 'var(--accent)' }}>Voir tout →</Link>
            </div>
            <table className="w-full">
              <thead>
                <tr style={{ borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)', background: 'var(--surface)' }}>
                  {['Circuit','Type','Meilleur Tour','Pos.','Delta'].map(h => (
                    <th key={h} className={`px-4 py-2.5 text-xs font-semibold uppercase tracking-wide ${h==='Circuit'?'text-left':'text-right'}`} style={{ color: 'var(--dim)' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {recent.map(s => (
                  <tr key={s.id} className="trow cursor-pointer">
                    <td className="px-4 py-2.5">
                      <div className="text-sm font-medium text-white">{s.circuit}</div>
                      <div className="text-xs" style={{ color: 'var(--dim)' }}>{s.sim} · {s.weather}</div>
                    </td>
                    <td className="px-4 py-2.5 text-right">
                      <span className={`badge ${s.type==='Course'?'b-red':s.type==='Qualif'?'b-yellow':'b-gray'}`}>{s.type}</span>
                    </td>
                    <td className="px-4 py-2.5 text-right font-mono text-sm text-white font-semibold">{s.laptime}</td>
                    <td className="px-4 py-2.5 text-right">
                      {s.pos > 0
                        ? <span className={`text-sm font-bold ${s.pos===1?'text-yellow-400':s.pos<=3?'text-green-400':'text-white'}`}>P{s.pos}</span>
                        : <span style={{ color: 'var(--dim)' }}>—</span>}
                    </td>
                    <td className="px-4 py-2.5 text-right font-mono text-sm">
                      {s.delta
                        ? <span className={s.delta.startsWith('+')?'neg':'pos'}>{s.delta}</span>
                        : <span style={{ color: 'var(--dim)' }}>—</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </>
  )
}

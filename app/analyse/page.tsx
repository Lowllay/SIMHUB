import Header from '@/components/Header'
import { getSessions } from '@/lib/queries'

export default async function Analyse() {
  const sessions = await getSessions()
  const hasSessions = sessions.length > 0

  return (
    <>
      <Header title="Analyse" subtitle="Analyse détaillée de tes données de roulage" />
      <div className="flex-1 overflow-y-auto p-5">
        {!hasSessions ? (
          <div className="card flex flex-col items-center justify-center py-20 text-center">
            <svg className="w-16 h-16 mb-4" style={{ color: 'var(--border)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
            </svg>
            <h3 className="text-lg font-semibold text-white mb-2">Aucune donnée à analyser</h3>
            <p className="text-sm max-w-sm" style={{ color: 'var(--dim)' }}>
              Joue des sessions iRacing avec le Watcher actif — tes chronos et statistiques apparaîtront ici automatiquement.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {/* Sessions récentes avec chronos */}
            <div className="card">
              <h3 className="text-sm font-semibold text-white mb-4">Chronos par session</h3>
              <div className="space-y-2">
                {sessions.slice(0, 15).map(s => (
                  <div key={s.id} className="flex items-center justify-between p-3 rounded-lg"
                    style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-white">{s.circuit}</div>
                      <div className="text-xs" style={{ color: 'var(--dim)' }}>{s.car} · {s.type} · {s.sim}</div>
                    </div>
                    <div className="text-right ml-4">
                      <div className="text-sm font-mono font-bold text-white">{s.laptime ?? '—'}</div>
                      {s.laps ? <div className="text-xs" style={{ color: 'var(--dim)' }}>{s.laps} tours</div> : null}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  )
}

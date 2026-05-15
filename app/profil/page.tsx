import Header from '@/components/Header'
import DownloadWatcher from './DownloadWatcher'
import { createClient } from '@/lib/supabase/server'
import { getDashboardStats, getCategoryStats } from '@/lib/queries'

export default async function Profil() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const [stats, categories] = await Promise.all([getDashboardStats(), getCategoryStats()])

  const email    = user?.email ?? '—'
  const initials = email.slice(0, 2).toUpperCase()
  const winRate  = stats.total > 0 ? ((stats.wins / stats.total) * 100).toFixed(1) + '%' : '—'

  return (
    <>
      <Header title="Profil" subtitle="Ton profil pilote et statistiques globales" />
      <div className="flex-1 overflow-y-auto p-5">
        <div className="grid grid-cols-3 gap-4">

          {/* Driver card */}
          <div className="card text-center">
            <div className="w-20 h-20 rounded-full mx-auto mb-3 flex items-center justify-center text-2xl font-bold text-white"
              style={{ background: 'linear-gradient(135deg,#e63946,#ff7b86)' }}>{initials}</div>
            <h2 className="text-lg font-bold text-white mb-0.5">{email}</h2>
            <p className="text-xs mb-4" style={{ color: 'var(--dim)' }}>iRacing · SimHub</p>
            <div className="grid grid-cols-3 gap-2 text-center mb-4">
              {[
                [String(stats.total), 'Sessions'],
                [String(stats.wins), 'Victoires'],
                [winRate, 'Win rate'],
              ].map(([v, l]) => (
                <div key={l}>
                  <div className="text-base font-bold text-white">{v}</div>
                  <div className="text-xs" style={{ color: 'var(--dim)' }}>{l}</div>
                </div>
              ))}
            </div>
            {stats.bestLap && (
              <div className="rounded-lg p-3 mb-4 text-left" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
                <div className="text-xs mb-1" style={{ color: 'var(--dim)' }}>Meilleur tour</div>
                <div className="text-lg font-bold font-mono text-white">{stats.bestLap}</div>
                <div className="text-xs" style={{ color: 'var(--dim)' }}>{stats.bestCircuit} · {stats.bestCar}</div>
              </div>
            )}
            <div className="mt-2">
              <DownloadWatcher />
            </div>
          </div>

          {/* Stats globales */}
          <div className="col-span-2 space-y-4">
            <div className="card">
              <h3 className="text-sm font-semibold text-white mb-4">Statistiques globales</h3>
              {stats.total === 0 ? (
                <p className="text-sm" style={{ color: 'var(--dim)' }}>Aucune session enregistrée. Lance le Watcher et joue une session iRacing.</p>
              ) : (
                <div className="grid grid-cols-3 gap-4">
                  {[
                    ['Sessions totales', String(stats.total)],
                    ['Victoires', String(stats.wins)],
                    ['Win rate', winRate],
                    ['Meilleur tour', stats.bestLap ?? '—'],
                    ['Circuit', stats.bestCircuit ?? '—'],
                    ['Voiture', stats.bestCar ?? '—'],
                  ].map(([k, v]) => (
                    <div key={k} className="rounded-lg p-3" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
                      <div className="text-xs mb-1" style={{ color: 'var(--dim)' }}>{k}</div>
                      <div className="text-sm font-bold text-white font-mono">{v}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Catégories */}
          {categories.length > 0 && (
            <div className="card col-span-3">
              <h3 className="text-sm font-semibold text-white mb-4">Répartition par Catégorie</h3>
              <div className="grid grid-cols-5 gap-3 text-center">
                {categories.map(cat => (
                  <div key={cat.name} className="rounded-xl p-4" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
                    <div className="text-2xl font-bold text-white mb-0.5">{cat.sessions}</div>
                    <div className="text-sm font-semibold text-white mb-1">{cat.name}</div>
                    <div className="text-xs mb-2" style={{ color: 'var(--dim)' }}>{cat.best}</div>
                    <div className="ptrack h-1.5">
                      <div className="pfill h-1.5" style={{ width: `${cat.pct}%`, background: cat.color }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  )
}

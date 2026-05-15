import Header from '@/components/Header'
import { goals, licences, categories } from '@/lib/data'
import DownloadWatcher from './DownloadWatcher'
import { createClient } from '@/lib/supabase/server'
import { getDashboardStats } from '@/lib/queries'

export default async function Profil() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const stats = await getDashboardStats()

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

          {/* Right col */}
          <div className="col-span-2 space-y-4">

            {/* Licences */}
            <div className="card">
              <h3 className="text-sm font-semibold text-white mb-4">Licences & Niveaux</h3>
              <div className="grid grid-cols-2 gap-3">
                {licences.map(lic => (
                  <div key={lic.name} className="rounded-xl p-4" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-9 h-9 rounded-lg flex items-center justify-center text-xs font-bold"
                        style={{ background: `${lic.color}18`, border: `1px solid ${lic.color}44`, color: lic.color }}>{lic.short}</div>
                      <div>
                        <div className="text-sm font-semibold text-white">{lic.name}</div>
                        <div className="text-xs" style={{ color: 'var(--dim)' }}>{lic.sub}</div>
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      {lic.stats.map(s => (
                        <div key={s.k} className="flex justify-between text-xs">
                          <span style={{ color: 'var(--muted)' }}>{s.k}</span>
                          <span className="font-mono text-white font-semibold">{s.v}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Goals */}
            <div className="card">
              <h3 className="text-sm font-semibold text-white mb-4">Objectifs de Progression</h3>
              <div className="space-y-4">
                {goals.map(g => (
                  <div key={g.id}>
                    <div className="flex justify-between mb-1.5">
                      <span className="text-sm text-white font-medium">{g.name}</span>
                      <span className="text-xs font-mono" style={{ color: 'var(--muted)' }}>{g.current} / {g.target} {g.unit}</span>
                    </div>
                    <div className="ptrack h-2">
                      <div className="pfill h-2" style={{ width: `${Math.min(100, g.current / g.target * 100).toFixed(1)}%`, background: g.color }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Categories */}
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
        </div>
      </div>
    </>
  )
}

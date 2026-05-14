import Header from '@/components/Header'
import { sectors, recommendations } from '@/lib/data'
import RegularityChart from './RegularityChart'
import ComparatorChart from './ComparatorChart'

export default function Analyse() {
  return (
    <>
      <Header title="Analyse" subtitle="Analyse détaillée de tes données de roulage" />
      <div className="flex-1 overflow-y-auto p-5">

        {/* Top row */}
        <div className="grid grid-cols-3 gap-4 mb-4">

          {/* Regularity ring */}
          <div className="card flex flex-col items-center justify-center text-center py-6">
            <div className="relative mb-4" style={{ width: 120, height: 120 }}>
              <RegularityChart />
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <div className="text-3xl font-bold text-white">94</div>
                <div className="text-xs" style={{ color: 'var(--dim)' }}>/ 100</div>
              </div>
            </div>
            <h3 className="text-sm font-semibold text-white mb-1">Score de Régularité</h3>
            <p className="text-xs mb-3" style={{ color: 'var(--dim)' }}>30 dernières sessions</p>
            <span className="badge b-green">Excellent</span>
            <div className="mt-4 w-full space-y-2">
              {[['Écart type','±0.412s'],['Meilleur tour','2:01.234'],['Médiane','2:01.789']].map(([k,v]) => (
                <div key={k} className="flex justify-between text-xs">
                  <span style={{ color: 'var(--dim)' }}>{k}</span>
                  <span className="text-white font-mono">{v}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Sectors */}
          <div className="card col-span-2">
            <h3 className="text-sm font-semibold text-white mb-1">Comparaison Secteurs</h3>
            <p className="text-xs mb-4" style={{ color: 'var(--dim)' }}>Spa-Francorchamps · vs référence pilote A</p>
            <div className="space-y-5">
              {sectors.map(sec => (
                <div key={sec.name}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 rounded flex items-center justify-center text-xs font-bold"
                        style={{ background: sec.delta<=0?'rgba(34,197,94,.2)':'rgba(230,57,70,.2)', color: sec.delta<=0?'#22c55e':'#e63946' }}>
                        {sec.name.slice(-1)}
                      </div>
                      <span className="text-sm font-semibold text-white">{sec.name}</span>
                      <span className="text-xs font-mono" style={{ color: 'var(--muted)' }}>{sec.time}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`text-sm font-mono font-bold ${sec.delta<=0?'pos':'neg'}`}>
                        {sec.delta>0?'+':''}{sec.delta}s
                      </span>
                      <span className="text-xs" style={{ color: 'var(--dim)' }}>vs réf.</span>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span style={{ color: 'var(--dim)' }}>Mon temps</span>
                        <span className={sec.delta<=0?'pos':'neg'}>{sec.time}</span>
                      </div>
                      <div className="ptrack h-2">
                        <div className="pfill h-2" style={{ width:`${sec.myPct}%`, background: sec.delta<=0?'#22c55e':'#e63946' }} />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span style={{ color: 'var(--dim)' }}>Référence</span>
                        <span style={{ color: 'var(--blue2)' }}>{sec.refTime}</span>
                      </div>
                      <div className="ptrack h-2">
                        <div className="pfill h-2" style={{ width:'100%', background:'#3b82f6' }} />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Comparator */}
        <div className="card mb-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-semibold text-white">Comparateur de Sessions</h3>
              <p className="text-xs mt-0.5" style={{ color: 'var(--dim)' }}>Évolution des temps au tour · Spa-Francorchamps</p>
            </div>
            <div className="flex gap-4">
              {[['#e63946','Spa 12/04/26'],['#3b82f6','Spa 24/03/26']].map(([c,l]) => (
                <div key={l} className="flex items-center gap-2">
                  <span className="inline-block w-4 h-0.5 rounded" style={{ background: c }} />
                  <span className="text-xs" style={{ color: 'var(--muted)' }}>{l}</span>
                </div>
              ))}
            </div>
          </div>
          <div style={{ height: 170 }}><ComparatorChart /></div>
        </div>

        {/* AI Recs */}
        <div className="card">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-6 h-6 rounded flex items-center justify-center" style={{ background: 'rgba(230,57,70,.12)' }}>
              <svg className="w-3.5 h-3.5" style={{ color: 'var(--accent)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.347.346a2 2 0 00-.537 1.43v.048a2 2 0 01-2 2H9.5a2 2 0 01-2-2v-.048a2 2 0 00-.537-1.43L6.343 16.9z"/>
              </svg>
            </div>
            <h3 className="text-sm font-semibold text-white">Recommandations IA</h3>
            <span className="badge b-blue ml-auto">4 points</span>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {recommendations.map(rec => (
              <div key={rec.id} className="rec-card">
                <div className="w-1 rounded-full flex-shrink-0 self-stretch" style={{ background: rec.color }} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="text-sm font-semibold text-white">{rec.title}</span>
                    <span className={`badge ml-auto ${rec.priority==='Critique'?'b-red':rec.priority==='Important'?'b-yellow':'b-gray'}`}>{rec.priority}</span>
                  </div>
                  <p className="text-xs leading-relaxed mb-2" style={{ color: 'var(--muted)' }}>{rec.desc}</p>
                  <span className="text-xs font-bold" style={{ color: rec.color }}>{rec.gain}</span>
                  <span className="text-xs ml-1" style={{ color: 'var(--dim)' }}>gain estimé</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}

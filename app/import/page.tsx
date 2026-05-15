'use client'
import Header from '@/components/Header'
import { simulators, importHistory } from '@/lib/data'
import { useRef, useState, useTransition } from 'react'
import { importIbt } from './actions'

export default function Import() {
  const inputRef  = useRef<HTMLInputElement>(null)
  const [dragging, setDragging] = useState(false)
  const [fileName, setFileName] = useState<string | null>(null)
  const [error,    setError]    = useState<string | null>(null)
  const [pending,  startTransition] = useTransition()

  function submit(file: File) {
    setFileName(file.name)
    setError(null)
    const fd = new FormData()
    fd.append('ibt', file)
    startTransition(async () => {
      const result = await importIbt(fd)
      if (result?.error) setError(result.error)
    })
  }

  function onFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (file) submit(file)
  }

  function onDrop(e: React.DragEvent) {
    e.preventDefault()
    setDragging(false)
    const file = e.dataTransfer.files?.[0]
    if (file) submit(file)
  }

  return (
    <>
      <Header title="Import & Sync" subtitle="Synchronisation avec tes simulateurs" />
      <div className="flex-1 overflow-y-auto p-5">

        {/* Simulator cards */}
        <div className="grid grid-cols-4 gap-4 mb-5">
          {simulators.map(sim => (
            <div key={sim.name} className="card">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-9 h-9 rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0"
                    style={{ background: `${sim.color}18`, border: `1px solid ${sim.color}30`, color: sim.color }}>{sim.short}</div>
                  <div className="min-w-0">
                    <div className="text-sm font-semibold text-white truncate">{sim.name}</div>
                    <div className="text-xs truncate" style={{ color: 'var(--dim)' }}>{sim.path}</div>
                  </div>
                </div>
                <div className={`dot ${sim.connected ? 'dot-g' : 'dot-r'} flex-shrink-0`} />
              </div>
              <div className="space-y-1.5 mb-4">
                {[
                  ['Statut',        sim.connected ? 'Connecté' : 'Déconnecté', sim.connected ? 'var(--green)' : 'var(--accent)'],
                  ['Dernière sync', sim.lastSync, 'var(--text)'],
                  ['Sessions',      String(sim.sessions), 'var(--text)'],
                ].map(([k, v, c]) => (
                  <div key={k} className="flex justify-between text-xs">
                    <span style={{ color: 'var(--muted)' }}>{k}</span>
                    <span style={{ color: c, fontWeight: 600 }}>{v}</span>
                  </div>
                ))}
              </div>
              <button className={`btn w-full text-xs ${sim.connected ? 'btn-p' : 'btn-g'}`}>
                {sim.connected ? '↺ Synchroniser' : 'Connecter'}
              </button>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-4">
          {/* Drop zone */}
          <div className="card">
            <h3 className="text-sm font-semibold text-white mb-4">Import Manuel (.ibt iRacing)</h3>
            <div
              className="drop-zone"
              style={{ borderColor: dragging ? 'var(--accent)' : undefined, cursor: 'pointer' }}
              onClick={() => inputRef.current?.click()}
              onDragOver={e => { e.preventDefault(); setDragging(true) }}
              onDragLeave={() => setDragging(false)}
              onDrop={onDrop}
            >
              <input ref={inputRef} type="file" accept=".ibt" className="hidden" onChange={onFileChange} />

              {pending ? (
                <>
                  <div className="w-10 h-10 mx-auto mb-3 rounded-full border-2 border-t-transparent animate-spin"
                    style={{ borderColor: 'var(--accent)', borderTopColor: 'transparent' }} />
                  <p className="text-sm font-medium text-white mb-1">Import en cours…</p>
                  <p className="text-xs" style={{ color: 'var(--dim)' }}>{fileName}</p>
                </>
              ) : error ? (
                <>
                  <svg className="w-10 h-10 mx-auto mb-3" style={{ color: 'var(--accent)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>
                  </svg>
                  <p className="text-sm font-medium mb-1" style={{ color: 'var(--accent)' }}>{error}</p>
                  <button className="btn btn-g text-xs mt-2" onClick={e => { e.stopPropagation(); setError(null) }}>Réessayer</button>
                </>
              ) : (
                <>
                  <svg className="w-10 h-10 mx-auto mb-3" style={{ color: 'var(--border)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"/>
                  </svg>
                  <p className="text-sm font-medium text-white mb-1">Glisser-déposer un fichier .ibt</p>
                  <p className="text-xs mb-4" style={{ color: 'var(--dim)' }}>ou cliquer pour choisir</p>
                  <button className="btn btn-g text-xs" onClick={e => { e.stopPropagation(); inputRef.current?.click() }}>Parcourir les fichiers</button>
                </>
              )}
            </div>
            <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
              {[['Format supporté', '.ibt iRacing'], ['Données extraites', 'Circuit · Voiture · Chrono']].map(([k, v]) => (
                <div key={k} className="rounded-lg p-3" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
                  <div style={{ color: 'var(--dim)' }} className="mb-1">{k}</div>
                  <div className="text-white font-semibold">{v}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Import history */}
          <div className="card">
            <h3 className="text-sm font-semibold text-white mb-4">Historique des Imports</h3>
            <div className="space-y-2">
              {importHistory.map(imp => (
                <div key={imp.id} className="flex items-center gap-3 p-3 rounded-lg"
                  style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
                  <div className={`dot ${imp.status === 'success' ? 'dot-g' : imp.status === 'error' ? 'dot-r' : 'dot-y'}`} />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm text-white truncate">{imp.file}</div>
                    <div className="text-xs" style={{ color: 'var(--dim)' }}>{imp.date} · {imp.sessions} sessions</div>
                  </div>
                  <span className={`badge ${imp.status === 'success' ? 'b-green' : imp.status === 'error' ? 'b-red' : 'b-yellow'}`}>
                    {imp.status === 'success' ? '✓ Importé' : imp.status === 'error' ? '✕ Erreur' : '⋯ En cours'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </>
  )
}

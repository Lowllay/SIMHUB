'use client'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'

export default function Register() {
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [name, setName]         = useState('')
  const [done, setDone]         = useState(false)
  const [error, setError]       = useState('')
  const [loading, setLoading]   = useState(false)

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    const supabase = createClient()
    const { error } = await supabase.auth.signUp({
      email, password,
      options: { data: { full_name: name } },
    })
    if (error) { setError(error.message); setLoading(false) }
    else setDone(true)
  }

  if (done) return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ background: 'var(--bg)' }}>
      <div className="card w-full max-w-sm text-center">
        <div className="w-14 h-14 rounded-full mx-auto mb-4 flex items-center justify-center" style={{ background: 'rgba(34,197,94,.15)' }}>
          <svg className="w-7 h-7" style={{ color: 'var(--green)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/>
          </svg>
        </div>
        <h2 className="text-lg font-bold text-white mb-2">Vérifie ton email</h2>
        <p className="text-sm mb-4" style={{ color: 'var(--dim)' }}>
          Un lien de confirmation a été envoyé à <span className="text-white font-medium">{email}</span>.
          Clique dessus pour activer ton compte.
        </p>
        <Link href="/login" className="btn btn-p w-full justify-center">Aller à la connexion</Link>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ background: 'var(--bg)' }}>
      <div className="w-full max-w-sm">

        <div className="flex items-center justify-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'var(--accent)' }}>
            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z"/>
            </svg>
          </div>
          <div>
            <div className="text-white font-bold text-lg">SimHub</div>
            <div className="text-xs" style={{ color: 'var(--dim)' }}>Simracing Platform</div>
          </div>
        </div>

        <div className="card">
          <h1 className="text-lg font-bold text-white mb-1">Créer un compte</h1>
          <p className="text-sm mb-6" style={{ color: 'var(--dim)' }}>Commence à tracker tes performances</p>

          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <label className="text-xs font-medium mb-1.5 block" style={{ color: 'var(--muted)' }}>Nom de pilote</label>
              <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Lilian C." required className="inp w-full" />
            </div>
            <div>
              <label className="text-xs font-medium mb-1.5 block" style={{ color: 'var(--muted)' }}>Email</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="ton@email.com" required className="inp w-full" />
            </div>
            <div>
              <label className="text-xs font-medium mb-1.5 block" style={{ color: 'var(--muted)' }}>Mot de passe</label>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="8 caractères minimum" minLength={8} required className="inp w-full" />
            </div>

            {error && (
              <div className="text-xs p-3 rounded-lg" style={{ background: 'rgba(230,57,70,.1)', color: 'var(--accent)', border: '1px solid rgba(230,57,70,.2)' }}>
                {error}
              </div>
            )}

            <button type="submit" disabled={loading} className="btn btn-p w-full justify-center py-2.5 text-sm font-semibold">
              {loading ? 'Création…' : 'Créer mon compte'}
            </button>
          </form>

          <p className="text-center text-xs mt-4" style={{ color: 'var(--dim)' }}>
            Déjà un compte ?{' '}
            <Link href="/login" style={{ color: 'var(--accent)' }}>Se connecter</Link>
          </p>
        </div>
      </div>
    </div>
  )
}

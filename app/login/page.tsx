'use client'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function Login() {
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [error, setError]       = useState('')
  const [loading, setLoading]   = useState(false)
  const router = useRouter()

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    const supabase = createClient()
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) { setError(error.message); setLoading(false) }
    else router.push('/dashboard')
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ background: 'var(--bg)' }}>
      <div className="w-full max-w-sm">

        {/* Logo */}
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

        {/* Card */}
        <div className="card">
          <h1 className="text-lg font-bold text-white mb-1">Connexion</h1>
          <p className="text-sm mb-6" style={{ color: 'var(--dim)' }}>Accède à tes données de roulage</p>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="text-xs font-medium mb-1.5 block" style={{ color: 'var(--muted)' }}>Email</label>
              <input
                type="email" value={email} onChange={e => setEmail(e.target.value)}
                placeholder="ton@email.com" required
                className="inp w-full"
              />
            </div>
            <div>
              <label className="text-xs font-medium mb-1.5 block" style={{ color: 'var(--muted)' }}>Mot de passe</label>
              <input
                type="password" value={password} onChange={e => setPassword(e.target.value)}
                placeholder="••••••••" required
                className="inp w-full"
              />
            </div>

            {error && (
              <div className="text-xs p-3 rounded-lg" style={{ background: 'rgba(230,57,70,.1)', color: 'var(--accent)', border: '1px solid rgba(230,57,70,.2)' }}>
                {error}
              </div>
            )}

            <button type="submit" disabled={loading} className="btn btn-p w-full justify-center py-2.5 text-sm font-semibold">
              {loading ? 'Connexion…' : 'Se connecter'}
            </button>
          </form>

          <p className="text-center text-xs mt-4" style={{ color: 'var(--dim)' }}>
            Pas encore de compte ?{' '}
            <Link href="/register" style={{ color: 'var(--accent)' }}>S&apos;inscrire</Link>
          </p>
        </div>
      </div>
    </div>
  )
}

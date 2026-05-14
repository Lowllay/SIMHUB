'use client'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

const nav = [
  { href: '/dashboard', label: 'Dashboard',
    icon: <path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"/> },
  { href: '/sessions',  label: 'Sessions',
    icon: <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/> },
  { href: '/analyse',   label: 'Analyse',
    icon: <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/> },
  { href: '/profil',    label: 'Profil',
    icon: <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/> },
  { href: '/import',    label: 'Import',
    icon: <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"/> },
]

export default function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()

  async function logout() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/login')
  }
  return (
    <aside className="flex flex-col h-full overflow-y-auto" style={{ width: 220, background: 'var(--surface)', borderRight: '1px solid var(--border)', flexShrink: 0 }}>
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 py-5" style={{ borderBottom: '1px solid var(--border)' }}>
        <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'var(--accent)' }}>
          <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </div>
        <div>
          <div className="font-bold text-white text-sm tracking-wide">SimHub</div>
          <div className="text-xs" style={{ color: 'var(--dim)' }}>Simracing Platform</div>
        </div>
      </div>

      {/* Nav */}
      <nav className="p-2.5 flex-1">
        <div className="text-xs font-semibold px-2 mb-2 mt-1 tracking-widest" style={{ color: '#3a3b48' }}>MENU</div>
        {nav.map(item => (
          <Link key={item.href} href={item.href} className={`nav-link mb-0.5${pathname.startsWith(item.href) ? ' active' : ''}`}>
            <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
              {item.icon}
            </svg>
            {item.label}
          </Link>
        ))}
      </nav>

      {/* User */}
      <div className="p-2.5" style={{ borderTop: '1px solid var(--border)' }}>
        <div className="flex items-center gap-2 p-2 rounded-lg"
          style={{ transition: 'background .15s' }}>
          <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
            style={{ background: 'linear-gradient(135deg,#e63946,#ff7b86)' }}>LC</div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-semibold text-white">Lilian C.</div>
            <div className="text-xs" style={{ color: 'var(--dim)' }}>iR 4 247 · A 3.45</div>
          </div>
          <button onClick={logout} title="Se déconnecter"
            className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
            style={{ background: 'var(--hover)' }}
            onMouseEnter={e => (e.currentTarget.style.background = 'rgba(230,57,70,.15)')}
            onMouseLeave={e => (e.currentTarget.style.background = 'var(--hover)')}>
            <svg className="w-3.5 h-3.5" style={{ color: 'var(--muted)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
            </svg>
          </button>
        </div>
      </div>
    </aside>
  )
}

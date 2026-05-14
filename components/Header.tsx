export default function Header({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <header className="flex items-center justify-between px-6 py-3.5 flex-shrink-0"
      style={{ background: 'linear-gradient(135deg,var(--surface),var(--card))', borderBottom: '1px solid var(--border)' }}>
      <div>
        <h1 className="text-base font-bold text-white">{title}</h1>
        <p className="text-xs mt-0.5" style={{ color: 'var(--dim)' }}>{subtitle}</p>
      </div>
      <div className="flex items-center gap-2.5">
        <button className="w-8 h-8 rounded-lg flex items-center justify-center relative"
          style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
          <svg className="w-4 h-4" style={{ color: 'var(--muted)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/>
          </svg>
          <span className="absolute top-1 right-1 w-2 h-2 rounded-full" style={{ background: 'var(--accent)' }} />
        </button>
        <div className="text-xs px-2.5 py-1 rounded-lg font-mono" style={{ background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--muted)' }}>
          14/05/2026
        </div>
      </div>
    </header>
  )
}

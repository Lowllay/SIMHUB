import Header from '@/components/Header'
import { getSessions } from '@/lib/queries'
import SessionsTable from './SessionsTable'
import Link from 'next/link'

export default async function Sessions() {
  const sessions = await getSessions()
  return (
    <>
      <Header title="Sessions" subtitle={`Historique complet · ${sessions.length} sessions`} />
      <div className="flex-1 overflow-y-auto p-5">
        <div className="flex justify-end mb-4">
          <Link href="/sessions/new" className="btn btn-p text-sm font-semibold">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4"/>
            </svg>
            Nouvelle session
          </Link>
        </div>
        <SessionsTable sessions={sessions as Parameters<typeof SessionsTable>[0]['sessions']} />
      </div>
    </>
  )
}

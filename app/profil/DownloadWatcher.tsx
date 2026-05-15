'use client'
export default function DownloadWatcher() {
  return (
    <a
      href="/api/download-watcher"
      download="SimHub-Watcher.js"
      className="btn btn-p w-full text-sm font-semibold"
    >
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5 5 5-5M12 15V3"/>
      </svg>
      Télécharger mon Watcher iRacing
    </a>
  )
}

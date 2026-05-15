import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return NextResponse.json({ error: 'Non connecté' }, { status: 401 })

  const bat = `@echo off
title SimHub Watcher
set URL=https://simhub-a2ye.vercel.app/api/watcher-js?uid=${user.id}
set TMP=%USERPROFILE%\\simhub-watcher.js
echo Telechargement du watcher...
if exist "%TMP%" del "%TMP%"
powershell -NoProfile -Command "Invoke-WebRequest -Uri '%URL%' -OutFile '%TMP%'"
echo Demarrage...
"C:\\Program Files\\nodejs\\node.exe" "%TMP%"
pause
`

  return new NextResponse(bat, {
    headers: {
      'Content-Type': 'application/octet-stream',
      'Content-Disposition': 'attachment; filename="SimHub-Watcher.bat"',
    },
  })
}

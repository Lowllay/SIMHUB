import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

function toEncodedCommand(script: string): string {
  // PowerShell -EncodedCommand attend du UTF-16LE en base64
  const buf = Buffer.alloc(script.length * 2)
  for (let i = 0; i < script.length; i++) buf.writeUInt16LE(script.charCodeAt(i), i * 2)
  return buf.toString('base64')
}

export async function GET() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Non connecté' }, { status: 401 })

  const uid    = user.id
  const secret = '9xHvhnwMFaoBlSTEuejtQmsU6PCbVgWy'
  const api    = 'https://simhub-a2ye.vercel.app/api/import-ibt'

  const ps = `
$USER_ID = '${uid}'
$SECRET  = '${secret}'
$API_URL = '${api}'
$docs    = [Environment]::GetFolderPath('MyDocuments')
$DIR     = [System.IO.Path]::Combine($docs, 'iRacing', 'telemetry')
$PF      = [System.IO.Path]::Combine($env:USERPROFILE, 'simhub-processed.json')

function Write-Log { param($m); Write-Host "[$([DateTime]::Now.ToString('HH:mm:ss'))] $m" }

function Get-Processed {
  if (Test-Path $PF) { $j = Get-Content $PF -Raw; if ($j) { return @($j | ConvertFrom-Json) } }
  return @()
}

function Save-Processed { param($list); ($list | ConvertTo-Json) | Set-Content $PF -Encoding UTF8 }

function Send-File { param($fp)
  $boundary = [System.Guid]::NewGuid().ToString()
  $fileName = [System.IO.Path]::GetFileName($fp)
  $fileBytes = [System.IO.File]::ReadAllBytes($fp)
  $enc = [System.Text.Encoding]::UTF8
  $header = $enc.GetBytes("--$boundary\r\nContent-Disposition: form-data; name=""ibt""; filename=""$fileName""\r\nContent-Type: application/octet-stream\r\n\r\n")
  $footer = $enc.GetBytes("\r\n--$boundary--\r\n")
  $ms = New-Object System.IO.MemoryStream
  $ms.Write($header,    0, $header.Length)
  $ms.Write($fileBytes, 0, $fileBytes.Length)
  $ms.Write($footer,    0, $footer.Length)
  $r = Invoke-WebRequest -Uri $API_URL -Method POST -Body $ms.ToArray() \`
    -ContentType "multipart/form-data; boundary=$boundary" \`
    -Headers @{'x-secret'=$SECRET;'x-user-id'=$USER_ID} -UseBasicParsing
  return $r.Content | ConvertFrom-Json
}

function Invoke-Scan {
  $processed = Get-Processed
  if (-not (Test-Path $DIR)) { Write-Log "Dossier iRacing introuvable: $DIR"; return }
  $files = Get-ChildItem -Path $DIR -Filter '*.ibt' -Recurse -ErrorAction SilentlyContinue
  foreach ($f in $files) {
    if ($processed -contains $f.Name) { continue }
    Write-Log "Nouvelle session: $($f.Name)"
    try {
      $r = Send-File $f.FullName
      $processed += $f.Name
      Save-Processed $processed
      Write-Log "OK - $($r.circuit)"
    } catch {
      Write-Log "Erreur: $($_.Exception.Message)"
    }
  }
}

Write-Log "SimHub Watcher demarre"
Write-Log "Dossier surveille: $DIR"
Write-Log "En attente de sessions iRacing..."
Invoke-Scan
while ($true) { Start-Sleep -Seconds 30; Invoke-Scan }
`

  const encoded = toEncodedCommand(ps)

  const bat = `@echo off
title SimHub Watcher
powershell -NoProfile -ExecutionPolicy Bypass -EncodedCommand ${encoded}
pause
`

  return new NextResponse(bat, {
    headers: {
      'Content-Type': 'application/octet-stream',
      'Content-Disposition': 'attachment; filename="SimHub-Watcher.bat"',
    },
  })
}

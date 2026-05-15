import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return NextResponse.json({ error: 'Non connecté' }, { status: 401 })

  // Batch file qui s'auto-extrait et lance le watcher avec Node.js
  const bat = `@echo off
set J=%TEMP%\\simhub-watcher-%RANDOM%.js
more +4 "%~f0" > "%J%"
"C:\\Program Files\\nodejs\\node.exe" "%J%" & del "%J%" & exit /b
const USER_ID='${user.id}',SECRET='9xHvhnwMFaoBlSTEuejtQmsU6PCbVgWy',API_URL='https://simhub-a2ye.vercel.app/api/import-ibt';
const fs=require('fs'),path=require('path'),os=require('os');
const DIR=path.join(os.homedir(),'Documents','iRacing','telemetry');
const PF=path.join(os.homedir(),'simhub-processed.json');
function log(m){console.log('['+new Date().toLocaleTimeString('fr-FR')+'] '+m)}
function load(){try{return new Set(JSON.parse(fs.readFileSync(PF,'utf8')))}catch{return new Set()}}
function save(s){fs.writeFileSync(PF,JSON.stringify([...s]))}
async function upload(fp){
  const blob=new Blob([fs.readFileSync(fp)]);
  const form=new FormData();
  form.append('ibt',blob,path.basename(fp));
  const r=await fetch(API_URL,{method:'POST',headers:{'x-secret':SECRET,'x-user-id':USER_ID},body:form});
  if(!r.ok)throw new Error('HTTP '+r.status);
  return r.json();
}
function files(dir){
  if(!fs.existsSync(dir))return[];
  return fs.readdirSync(dir,{withFileTypes:true}).flatMap(e=>
    e.isDirectory()?files(path.join(dir,e.name)):e.name.endsWith('.ibt')?[path.join(dir,e.name)]:[]
  );
}
async function scan(){
  const p=load();
  for(const fp of files(DIR)){
    const k=path.relative(DIR,fp);
    if(p.has(k))continue;
    log('Nouvelle session: '+path.basename(fp));
    try{const d=await upload(fp);p.add(k);save(p);log('OK - '+d.circuit);}
    catch(e){log('Erreur: '+e.message);}
  }
}
log('SimHub Watcher demarre - dossier: '+DIR);
scan();setInterval(scan,30000);
`

  return new NextResponse(bat, {
    headers: {
      'Content-Type': 'application/octet-stream',
      'Content-Disposition': 'attachment; filename="SimHub-Watcher.bat"',
    },
  })
}

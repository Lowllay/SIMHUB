import Header from '@/components/Header'
import { addSession } from './actions'
import Link from 'next/link'

const CIRCUITS = ['Spa-Francorchamps','Monza','Nürburgring GP','Silverstone','Le Mans','Zandvoort','Imola','Barcelona','Watkins Glen','Bathurst','Portimão','Daytona','Suzuka','Interlagos','Paul Ricard','Laguna Seca','Road America','Brands Hatch','Misano','Donington Park']
const CARS     = ['Porsche 911 GT3 R','Ferrari 296 GT3','BMW M4 GT3','Audi R8 LMS','McLaren 720S GT3','Mercedes AMG GT3','Lamborghini Huracán GT3','Ferrari 499P LMH','Toyota GR010','Porsche 963 LMDh']
const WEATHERS = ['☀️ Sec','🌤️ Nuageux','⛅ Mixte','🌧️ Pluie','🌙 Nuit','❄️ Froid']
const COUNTRIES: Record<string, string> = {
  'Spa-Francorchamps':'🇧🇪 Belgique','Monza':'🇮🇹 Italie','Nürburgring GP':'🇩🇪 Allemagne',
  'Silverstone':'🇬🇧 UK','Le Mans':'🇫🇷 France','Zandvoort':'🇳🇱 Pays-Bas',
  'Imola':'🇮🇹 Italie','Barcelona':'🇪🇸 Espagne','Watkins Glen':'🇺🇸 USA',
  'Bathurst':'🇦🇺 Australie','Portimão':'🇵🇹 Portugal','Daytona':'🇺🇸 USA',
  'Suzuka':'🇯🇵 Japon','Interlagos':'🇧🇷 Brésil','Paul Ricard':'🇫🇷 France',
  'Laguna Seca':'🇺🇸 USA','Road America':'🇺🇸 USA','Brands Hatch':'🇬🇧 UK',
  'Misano':'🇮🇹 Italie','Donington Park':'🇬🇧 UK',
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="text-xs font-medium mb-1.5 block" style={{ color: 'var(--muted)' }}>{label}</label>
      {children}
    </div>
  )
}

export default function NewSession() {
  const today = new Date().toLocaleDateString('fr-FR', { day:'2-digit', month:'2-digit', year:'2-digit' })

  return (
    <>
      <Header title="Nouvelle Session" subtitle="Enregistre une session de roulage" />
      <div className="flex-1 overflow-y-auto p-5">
        <div className="max-w-2xl mx-auto">

          <form action={addSession} className="space-y-5">

            {/* Circuit + Voiture */}
            <div className="card">
              <h3 className="text-sm font-semibold text-white mb-4">Circuit & Voiture</h3>
              <div className="grid grid-cols-2 gap-4">
                <Field label="Circuit *">
                  <select name="circuit" required className="inp w-full"
                    onChange={undefined}>
                    <option value="">Sélectionner…</option>
                    {CIRCUITS.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </Field>
                <Field label="Pays">
                  <input name="country" type="text" placeholder="🇧🇪 Belgique" className="inp w-full" />
                </Field>
                <Field label="Voiture *">
                  <select name="car" required className="inp w-full">
                    <option value="">Sélectionner…</option>
                    {CARS.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </Field>
                <Field label="Catégorie *">
                  <select name="category" required className="inp w-full">
                    {['GT3','GT4','LMH','LMDh','GTE','Open Wheel'].map(c => <option key={c}>{c}</option>)}
                  </select>
                </Field>
              </div>
            </div>

            {/* Session info */}
            <div className="card">
              <h3 className="text-sm font-semibold text-white mb-4">Infos Session</h3>
              <div className="grid grid-cols-3 gap-4">
                <Field label="Type *">
                  <select name="type" required className="inp w-full">
                    <option value="Course">Course</option>
                    <option value="Qualif">Qualif</option>
                    <option value="Essais">Essais</option>
                  </select>
                </Field>
                <Field label="Simulateur *">
                  <select name="sim" required className="inp w-full">
                    {['iRacing','LMU','ACC','AC'].map(s => <option key={s}>{s}</option>)}
                  </select>
                </Field>
                <Field label="Météo">
                  <select name="weather" className="inp w-full">
                    {WEATHERS.map(w => <option key={w} value={w.slice(0,2)}>{w}</option>)}
                  </select>
                </Field>
                <Field label="Date">
                  <input name="session_date" type="text" defaultValue={today} placeholder="14/05/26" className="inp w-full" />
                </Field>
                <Field label="Nombre de tours">
                  <input name="laps" type="number" min={1} placeholder="24" className="inp w-full" />
                </Field>
                <Field label="Position finale">
                  <input name="pos" type="number" min={0} placeholder="0 = essais" className="inp w-full" />
                </Field>
              </div>
            </div>

            {/* Chronos */}
            <div className="card">
              <h3 className="text-sm font-semibold text-white mb-4">Chronos</h3>
              <div className="grid grid-cols-3 gap-4">
                <Field label="Meilleur tour * (ex: 2:01.234)">
                  <input name="laptime" type="text" required placeholder="2:01.234"
                    pattern="\d+:\d{2}\.\d{3}" title="Format : m:ss.mmm"
                    className="inp w-full font-mono" />
                </Field>
                <Field label="Delta (ex: -0.456)">
                  <input name="delta" type="text" placeholder="-0.456" className="inp w-full font-mono" />
                </Field>
                <Field label="Setup">
                  <input name="setup" type="text" placeholder="Wet, Race, Qual…" className="inp w-full" />
                </Field>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 justify-end">
              <Link href="/sessions" className="btn btn-g">Annuler</Link>
              <button type="submit" className="btn btn-p px-6 font-semibold">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/>
                </svg>
                Enregistrer la session
              </button>
            </div>

          </form>
        </div>
      </div>
    </>
  )
}

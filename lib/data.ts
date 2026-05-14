export type SessionType = 'Course' | 'Qualif' | 'Essais'
export type SimName = 'iRacing' | 'LMU' | 'ACC' | 'AC'

export interface Session {
  id: number
  circuit: string
  country: string
  car: string
  category: string
  type: SessionType
  sim: SimName
  weather: string
  laptime: string
  laps: number
  pos: number
  delta: string
  setup: string
  date: string
}

export const sessions: Session[] = [
  { id:1,  circuit:'Spa-Francorchamps', country:'🇧🇪 Belgique',  car:'Porsche 911 GT3 R', category:'GT3', type:'Course', sim:'iRacing', weather:'☀️', laptime:'2:01.234', laps:24, pos:3, delta:'-0.456', setup:'Wet',  date:'12/04/26' },
  { id:2,  circuit:'Monza',             country:'🇮🇹 Italie',    car:'Ferrari 296 GT3',   category:'GT3', type:'Qualif', sim:'ACC',     weather:'🌤️', laptime:'1:46.891', laps:5,  pos:2, delta:'-0.123', setup:'Qual', date:'10/04/26' },
  { id:3,  circuit:'Nürburgring GP',    country:'🇩🇪 Allemagne', car:'BMW M4 GT3',        category:'GT3', type:'Course', sim:'ACC',     weather:'⛅', laptime:'1:58.723', laps:30, pos:7, delta:'+2.341', setup:'Race', date:'08/04/26' },
  { id:4,  circuit:'Silverstone',       country:'🇬🇧 UK',        car:'Audi R8 LMS',       category:'GT3', type:'Essais', sim:'iRacing', weather:'☀️', laptime:'1:52.456', laps:18, pos:0, delta:'',       setup:'Base', date:'05/04/26' },
  { id:5,  circuit:'Le Mans',           country:'🇫🇷 France',    car:'Ferrari 296 GT3',   category:'GT3', type:'Course', sim:'LMU',     weather:'🌙', laptime:'3:24.891', laps:40, pos:1, delta:'-1.234', setup:'LM',   date:'03/04/26' },
  { id:6,  circuit:'Zandvoort',         country:'🇳🇱 Pays-Bas',  car:'Porsche 911 GT3 R', category:'GT3', type:'Qualif', sim:'iRacing', weather:'🌧️', laptime:'1:31.456', laps:8,  pos:4, delta:'+0.567', setup:'Wet',  date:'01/04/26' },
  { id:7,  circuit:'Imola',             country:'🇮🇹 Italie',    car:'McLaren 720S GT3',  category:'GT3', type:'Course', sim:'ACC',     weather:'☀️', laptime:'1:43.234', laps:26, pos:2, delta:'-0.789', setup:'Race', date:'29/03/26' },
  { id:8,  circuit:'Barcelona',         country:'🇪🇸 Espagne',   car:'BMW M4 GT3',        category:'GT3', type:'Essais', sim:'iRacing', weather:'☀️', laptime:'1:39.678', laps:22, pos:0, delta:'',       setup:'Base', date:'27/03/26' },
  { id:9,  circuit:'Spa-Francorchamps', country:'🇧🇪 Belgique',  car:'Porsche 911 GT3 R', category:'GT3', type:'Course', sim:'iRacing', weather:'⛅', laptime:'2:01.555', laps:24, pos:5, delta:'+1.234', setup:'Race', date:'24/03/26' },
  { id:10, circuit:'Watkins Glen',      country:'🇺🇸 USA',       car:'Audi R8 LMS',       category:'GT3', type:'Qualif', sim:'iRacing', weather:'🌤️', laptime:'1:34.891', laps:6,  pos:1, delta:'-0.345', setup:'Qual', date:'22/03/26' },
  { id:11, circuit:'Bathurst',          country:'🇦🇺 Australie', car:'Ferrari 296 GT3',   category:'GT3', type:'Course', sim:'ACC',     weather:'☀️', laptime:'2:03.456', laps:32, pos:3, delta:'-0.123', setup:'Race', date:'19/03/26' },
  { id:12, circuit:'Portimão',          country:'🇵🇹 Portugal',  car:'McLaren 720S GT3',  category:'GT3', type:'Essais', sim:'iRacing', weather:'☀️', laptime:'1:41.234', laps:15, pos:0, delta:'',       setup:'Base', date:'17/03/26' },
  { id:13, circuit:'Le Mans',           country:'🇫🇷 France',    car:'Ferrari 499P LMH',  category:'LMH', type:'Course', sim:'LMU',     weather:'🌙', laptime:'3:22.123', laps:40, pos:2, delta:'-2.456', setup:'LM',   date:'14/03/26' },
  { id:14, circuit:'Daytona',           country:'🇺🇸 USA',       car:'Porsche 911 GT3 R', category:'GT3', type:'Course', sim:'iRacing', weather:'☀️', laptime:'1:42.891', laps:20, pos:1, delta:'-0.987', setup:'Race', date:'12/03/26' },
  { id:15, circuit:'Suzuka',            country:'🇯🇵 Japon',     car:'BMW M4 GT3',        category:'GT3', type:'Qualif', sim:'ACC',     weather:'🌤️', laptime:'1:49.567', laps:7,  pos:3, delta:'+0.234', setup:'Qual', date:'09/03/26' },
]

export const topCircuits = [
  { name: 'Spa-Francorchamps', best: '2:01.234', sessions: 48, pct: 92, trend: -0.321 },
  { name: 'Nürburgring GP',    best: '1:58.723', sessions: 31, pct: 78, trend: +0.145 },
  { name: 'Monza',             best: '1:46.891', sessions: 29, pct: 74, trend: -0.089 },
  { name: 'Silverstone',       best: '1:52.456', sessions: 24, pct: 65, trend: -0.234 },
  { name: 'Le Mans',           best: '3:24.891', sessions: 18, pct: 52, trend: -0.521 },
]

export const simStats = [
  { name: 'iRacing', color: '#e63946', count: 148 },
  { name: 'LMU',     color: '#3b82f6', count: 72  },
  { name: 'ACC',     color: '#22c55e', count: 61  },
  { name: 'AC',      color: '#f59e0b', count: 31  },
]

export const sectors = [
  { name: 'Secteur 1', time: '0:37.456', refTime: '0:37.579', delta: -0.123, myPct: 96 },
  { name: 'Secteur 2', time: '0:52.891', refTime: '0:52.657', delta: +0.234, myPct: 74 },
  { name: 'Secteur 3', time: '0:30.887', refTime: '0:30.899', delta: -0.012, myPct: 99 },
]

export const recommendations = [
  { id:1, title:'Freinage T1',     priority:'Critique',  color:'#e63946', desc:'Tu freines 18m trop tôt au virage 1 de Raidillon. Retarder le point de freinage peut gagner ~0.3s par tour.', gain:'~0.3s/tour' },
  { id:2, title:'Secteur 2',       priority:'Important', color:'#f59e0b', desc:'Perte de 0.23s en secteur 2. Optimise la trajectoire au chicane du Bus Stop pour conserver la vitesse de sortie.', gain:'~0.2s/tour' },
  { id:3, title:'Gestion pneus',   priority:'Normal',    color:'#3b82f6', desc:'Dégradation élevée sur le pneu arrière droit après 15 tours. Augmenter la pression à froid de +0.2 psi.', gain:'Régularité' },
  { id:4, title:'Tour de chauffe', priority:'Normal',    color:'#22c55e', desc:'Tes tours lancés en qualif sont 0.4s en dessous de ton potentiel. Améliorer la préparation des pneus au tour out-lap.', gain:'~0.4s/lap' },
]

export const goals = [
  { id:1, name:'Atteindre iRating 5 000',   current:4247, target:5000, unit:'iR',   color:'#3b82f6' },
  { id:2, name:'50 victoires cette saison',  current:47,   target:50,   unit:'wins', color:'#f59e0b' },
  { id:3, name:'Régularité 96%',             current:94.2, target:96,   unit:'%',    color:'#22c55e' },
  { id:4, name:'Safety Rating A 4.0',        current:3.45, target:4.0,  unit:'SR',   color:'#e63946' },
]

export const licences = [
  { name:'iRacing', short:'iR', color:'#3b82f6', sub:'Class A · Road',       stats:[{k:'iRating',v:'4 247'},{k:'Safety Rating',v:'A 3.45'},{k:'Licence Class',v:'A'},{k:'Starts',v:'312'}] },
  { name:'ACC',     short:'AC', color:'#22c55e', sub:'GT3 · GT4',            stats:[{k:'Driver Rating',v:'87/100'},{k:'Safety',v:'A'},{k:'Podiums',v:'94'},{k:'Pole Awards',v:'12'}] },
  { name:'LMU',     short:'LM', color:'#e63946', sub:'LMH · GT3',            stats:[{k:'Starts',v:'72'},{k:'Wins',v:'11'},{k:'Best Lap',v:'3:22.123'},{k:'Podiums',v:'28'}] },
  { name:'AC',      short:'AC', color:'#f59e0b', sub:'Multi-catégorie',      stats:[{k:'Mods',v:'14'},{k:'Events',v:'31'},{k:'Best Lap',v:'1:39.234'},{k:'Laps',v:'487'}] },
]

export const categories = [
  { name:'GT3',  sessions:198, best:'2:01.234', pct:85, color:'#e63946' },
  { name:'GT4',  sessions:42,  best:'2:08.567', pct:30, color:'#3b82f6' },
  { name:'LMH',  sessions:28,  best:'3:22.123', pct:20, color:'#f59e0b' },
  { name:'GTE',  sessions:31,  best:'2:03.456', pct:22, color:'#22c55e' },
  { name:'Open', sessions:13,  best:'1:39.234', pct:10, color:'#8b5cf6' },
]

export const simulators = [
  { name:'iRacing',             short:'iR',  color:'#3b82f6', path:'Documents/iRacing',   connected:true,  lastSync:'Il y a 2h',   sessions:148 },
  { name:'Le Mans Ultimate',    short:'LMU', color:'#e63946', path:'AppData/LMU',          connected:true,  lastSync:'Il y a 1j',   sessions:72  },
  { name:'Assetto Corsa Comp.', short:'ACC', color:'#22c55e', path:'Documents/ACC',        connected:false, lastSync:'Il y a 3j',   sessions:61  },
  { name:'Assetto Corsa',       short:'AC',  color:'#f59e0b', path:'Steam/steamapps/AC',   connected:false, lastSync:'Il y a 1sem', sessions:31  },
]

export const importHistory = [
  { id:1, file:'spa_24h_ibt_pack.zip',     date:'12/04/26', sessions:12, status:'success' as const },
  { id:2, file:'monza_quali_2604.ibt',      date:'10/04/26', sessions:1,  status:'success' as const },
  { id:3, file:'lmu_lemans_march.ldx',      date:'03/04/26', sessions:8,  status:'success' as const },
  { id:4, file:'acc_misano_corrupted.json', date:'28/03/26', sessions:0,  status:'error'   as const },
  { id:5, file:'iracing_daytona_pack.zip',  date:'22/03/26', sessions:6,  status:'success' as const },
]

// Generate 30 days of laptime data for charts
export function generateLaptimeData() {
  const data = []
  const base = 121.5
  for (let i = 29; i >= 0; i--) {
    const d = new Date()
    d.setDate(d.getDate() - i)
    const label = d.getDate() + '/' + (d.getMonth() + 1)
    const value = +(base - (29 - i) * 0.065 + (Math.random() - 0.42) * 0.55).toFixed(3)
    data.push({ label, value })
  }
  return data
}

export function generateComparatorData() {
  return Array.from({ length: 24 }, (_, i) => ({
    lap: 'T' + (i + 1),
    session1: +(121.234 + (Math.random() - 0.3) * 0.8 + i * 0.02).toFixed(3),
    session2: +(121.555 + (Math.random() - 0.3) * 1.1 + i * 0.025).toFixed(3),
  }))
}

export function fmtSec(v: number) {
  const m = Math.floor(v / 60)
  const s = (v % 60).toFixed(3)
  return m + ':' + s.padStart(6, '0')
}

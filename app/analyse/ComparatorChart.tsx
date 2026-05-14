'use client'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import { generateComparatorData, fmtSec } from '@/lib/data'
import { useMemo } from 'react'

export default function ComparatorChart() {
  const data = useMemo(() => generateComparatorData(), [])
  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
        <XAxis dataKey="lap" tick={{ fill: '#4a5568', fontSize: 10 }} axisLine={{ stroke: '#22232e' }} tickLine={false} interval={3} />
        <YAxis tick={{ fill: '#4a5568', fontSize: 10 }} axisLine={{ stroke: '#22232e' }} tickLine={false} reversed domain={['auto','auto']} tickFormatter={fmtSec} width={52} />
        <Tooltip
          contentStyle={{ background: '#1a1b23', border: '1px solid #22232e', borderRadius: 8, fontSize: 12 }}
          labelStyle={{ color: '#94a3b8' }}
          formatter={(v, name) => [fmtSec(Number(v)), name === 'session1' ? 'Spa 12/04' : 'Spa 24/03']}
        />
        <Line type="monotone" dataKey="session1" stroke="#e63946" strokeWidth={2} dot={false} activeDot={{ r: 4 }} name="session1" />
        <Line type="monotone" dataKey="session2" stroke="#3b82f6" strokeWidth={2} dot={false} activeDot={{ r: 4 }} name="session2" />
      </LineChart>
    </ResponsiveContainer>
  )
}

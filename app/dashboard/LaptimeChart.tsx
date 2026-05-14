'use client'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts'
import { generateLaptimeData, fmtSec } from '@/lib/data'
import { useMemo } from 'react'

export default function LaptimeChart() {
  const data = useMemo(() => generateLaptimeData(), [])
  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={data} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id="ltGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%"  stopColor="#e63946" stopOpacity={0.15} />
            <stop offset="95%" stopColor="#e63946" stopOpacity={0} />
          </linearGradient>
        </defs>
        <XAxis dataKey="label" tick={{ fill: '#4a5568', fontSize: 10 }} axisLine={{ stroke: '#22232e' }} tickLine={false} interval={4} />
        <YAxis
          tick={{ fill: '#4a5568', fontSize: 10 }} axisLine={{ stroke: '#22232e' }} tickLine={false}
          reversed domain={['auto', 'auto']}
          tickFormatter={fmtSec}
          width={52}
        />
        <Tooltip
          contentStyle={{ background: '#1a1b23', border: '1px solid #22232e', borderRadius: 8, fontSize: 12 }}
          labelStyle={{ color: '#94a3b8' }}
          formatter={(v) => [fmtSec(Number(v)), 'Meilleur tour']}
        />
        <Area type="monotone" dataKey="value" stroke="#e63946" strokeWidth={2} fill="url(#ltGrad)" dot={false} activeDot={{ r: 4, fill: '#e63946' }} />
      </AreaChart>
    </ResponsiveContainer>
  )
}

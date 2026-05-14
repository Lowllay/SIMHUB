'use client'
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts'
import { simStats } from '@/lib/data'

export default function SimChart() {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie data={simStats} dataKey="count" nameKey="name" cx="50%" cy="50%" innerRadius={42} outerRadius={62} paddingAngle={2}>
          {simStats.map(s => <Cell key={s.name} fill={s.color} strokeWidth={0} />)}
        </Pie>
        <Tooltip
          contentStyle={{ background: '#1a1b23', border: '1px solid #22232e', borderRadius: 8, fontSize: 12 }}
          labelStyle={{ color: '#94a3b8' }}
          formatter={(v, name) => [String(v) + ' sessions', String(name)]}
        />
      </PieChart>
    </ResponsiveContainer>
  )
}

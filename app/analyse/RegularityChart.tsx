'use client'
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts'

export default function RegularityChart() {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie data={[{v:94},{v:6}]} dataKey="v" cx="50%" cy="50%" innerRadius={46} outerRadius={58} startAngle={90} endAngle={-270} paddingAngle={0}>
          <Cell fill="#22c55e" strokeWidth={0} />
          <Cell fill="#22232e"  strokeWidth={0} />
        </Pie>
      </PieChart>
    </ResponsiveContainer>
  )
}

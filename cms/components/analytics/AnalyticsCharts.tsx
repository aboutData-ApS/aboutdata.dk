'use client'

import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts'

interface ChartDataPoint {
  day: string
  views: number
}

interface AnalyticsChartsProps {
  chartData: ChartDataPoint[]
}

export default function AnalyticsCharts({ chartData }: AnalyticsChartsProps) {
  const hasData = chartData.some((d) => d.views > 0)

  if (!hasData) {
    return (
      <div className="card">
        <h2 className="text-sm font-semibold text-gray-900 mb-4">Sidevisninger – 7 dage</h2>
        <div className="h-44 flex items-center justify-center">
          <div className="text-center">
            <p className="text-sm text-gray-400">Ingen data endnu</p>
            <p className="text-xs text-gray-300 mt-1">Vises her når dit website får besøgende</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="card">
      <h2 className="text-sm font-semibold text-gray-900 mb-4">Sidevisninger – 7 dage</h2>
      <ResponsiveContainer width="100%" height={180}>
        <AreaChart data={chartData} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="viewsGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2} />
              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
          <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} allowDecimals={false} />
          <Tooltip
            contentStyle={{ fontSize: 12, border: '1px solid #e2e8f0', borderRadius: 8, boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}
            labelStyle={{ fontWeight: 600, color: '#1e293b' }}
          />
          <Area type="monotone" dataKey="views" name="Visninger" stroke="#3b82f6" strokeWidth={2} fill="url(#viewsGradient)" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}

import { createClient } from '@/lib/supabase/server'
import { Eye, Mail, Clock } from 'lucide-react'
import { formatDate, formatTime } from '@/lib/utils'
import Link from 'next/link'
import AnalyticsCharts from '@/components/analytics/AnalyticsCharts'

async function getMetrics() {
  const supabase = await createClient()

  const sevenDaysAgo = new Date()
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)

  const [pageViewsRes, leadsRes, recentLeadsRes, recentEventsRes, weekEventsRes] = await Promise.all([
    supabase.from('analytics_events').select('id', { count: 'exact', head: true }).eq('event_type', 'page_view'),
    supabase.from('leads').select('id', { count: 'exact', head: true }),
    supabase.from('leads').select('*').order('created_at', { ascending: false }).limit(5),
    supabase.from('analytics_events').select('*').order('created_at', { ascending: false }).limit(8),
    supabase.from('analytics_events')
      .select('created_at')
      .eq('event_type', 'page_view')
      .gte('created_at', sevenDaysAgo.toISOString())
      .order('created_at', { ascending: true }),
  ])

  // Build 7-day chart data
  const days: Record<string, number> = {}
  for (let i = 6; i >= 0; i--) {
    const d = new Date()
    d.setDate(d.getDate() - i)
    const key = d.toLocaleDateString('da-DK', { weekday: 'short' })
    days[key] = 0
  }
  for (const ev of weekEventsRes.data ?? []) {
    const key = new Date(ev.created_at).toLocaleDateString('da-DK', { weekday: 'short' })
    if (key in days) days[key]++
  }
  const chartData = Object.entries(days).map(([day, views]) => ({ day, views }))

  return {
    pageViews: pageViewsRes.count ?? 0,
    totalLeads: leadsRes.count ?? 0,
    recentLeads: recentLeadsRes.data ?? [],
    recentEvents: recentEventsRes.data ?? [],
    chartData,
  }
}

const STATUS_COLORS: Record<string, string> = {
  new: 'badge-blue',
  read: 'badge-green',
  archived: 'badge-gray',
}
const STATUS_LABELS: Record<string, string> = {
  new: 'Ny', read: 'Læst', archived: 'Arkiveret',
}

export default async function DashboardPage() {
  const { pageViews, totalLeads, recentLeads, recentEvents, chartData } = await getMetrics()

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-7">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-sm text-gray-500 mt-1">Overblik over dit website</p>
      </div>

      {/* Metric cards — only 2 */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="card">
          <div className="w-9 h-9 rounded-lg flex items-center justify-center bg-blue-50 text-blue-600 mb-3">
            <Eye className="w-4 h-4" />
          </div>
          <p className="text-2xl font-bold text-gray-900">{pageViews.toLocaleString('da-DK')}</p>
          <p className="text-xs text-gray-500 mt-0.5">Sidevisninger</p>
        </div>
        <div className="card">
          <div className="w-9 h-9 rounded-lg flex items-center justify-center bg-purple-50 text-purple-600 mb-3">
            <Mail className="w-4 h-4" />
          </div>
          <p className="text-2xl font-bold text-gray-900">{totalLeads.toLocaleString('da-DK')}</p>
          <p className="text-xs text-gray-500 mt-0.5">Henvendelser</p>
        </div>
      </div>

      {/* 7-day chart */}
      <div className="mb-6">
        <AnalyticsCharts chartData={chartData} />
      </div>

      {/* Leads + Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 mb-6">
        {/* Recent leads */}
        <div className="lg:col-span-3 card">
          <h2 className="text-sm font-semibold text-gray-900 mb-4">Seneste henvendelser</h2>
          {recentLeads.length === 0 ? (
            <div className="py-8 text-center text-sm text-gray-400">Ingen henvendelser endnu</div>
          ) : (
            <div className="space-y-2">
              {recentLeads.map((lead: { id: string; name: string; email: string; status: string; created_at: string }) => (
                <div key={lead.id} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-xs font-semibold text-gray-600">
                      {lead.name[0]?.toUpperCase()}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{lead.name}</p>
                      <p className="text-xs text-gray-400">{lead.email}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={STATUS_COLORS[lead.status] ?? 'badge-gray'}>
                      {STATUS_LABELS[lead.status] ?? lead.status}
                    </span>
                    <p className="text-xs text-gray-400 mt-1">{formatDate(lead.created_at)}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Activity */}
        <div className="lg:col-span-2 card">
          <div className="flex items-center gap-2 mb-4">
            <Clock className="w-4 h-4 text-gray-400" />
            <h2 className="text-sm font-semibold text-gray-900">Aktivitet</h2>
          </div>
          {recentEvents.length === 0 ? (
            <div className="py-8 text-center text-sm text-gray-400">Ingen aktivitet endnu</div>
          ) : (
            <div className="space-y-2.5">
              {recentEvents.map((event: { id: string; event_type: string; section: string | null; created_at: string }) => (
                <div key={event.id} className="flex items-start gap-2.5">
                  <div className="w-1.5 h-1.5 bg-blue-400 rounded-full mt-1.5 shrink-0" />
                  <div>
                    <p className="text-xs text-gray-700">
                      {event.event_type === 'page_view' && 'Sidevisning'}
                      {event.event_type === 'cta_click' && `CTA klik${event.section ? ` · ${event.section}` : ''}`}
                      {event.event_type === 'form_submit' && 'Formular indsendt'}
                    </p>
                    <p className="text-xs text-gray-400">{formatTime(event.created_at)}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Quick action */}
      <div className="p-4 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-white">Rediger dit website</p>
            <p className="text-xs text-blue-200 mt-0.5">Klik direkte på teksten og rediger live</p>
          </div>
          <Link href="/editor" className="px-4 py-2 bg-white text-blue-700 text-sm font-medium rounded-lg hover:bg-blue-50 transition-colors">
            Åbn editor →
          </Link>
        </div>
      </div>
    </div>
  )
}

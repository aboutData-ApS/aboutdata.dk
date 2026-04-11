'use client'

import { useState, useEffect } from 'react'
import { Settings, Globe, Bell, Loader2, CheckCircle2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { DEFAULT_CONTENT } from '@/lib/defaults'

export default function SettingsPage() {
  const [email, setEmail] = useState('')
  const [resetting, setResetting] = useState(false)
  const [resetDone, setResetDone] = useState(false)
  const supabase = createClient()

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setEmail(data.user?.email ?? '')
    })
  }, [])

  async function handleReset() {
    if (!confirm('Er du sikker? Alt indhold nulstilles til standardværdier.')) return
    setResetting(true)

    const rows = [
      // Hero
      { section: 'hero', field_key: 'headline',           field_value: DEFAULT_CONTENT.hero.headline },
      { section: 'hero', field_key: 'headline_highlight', field_value: DEFAULT_CONTENT.hero.headline_highlight },
      { section: 'hero', field_key: 'subheadline',        field_value: DEFAULT_CONTENT.hero.subheadline },
      { section: 'hero', field_key: 'cta_primary_text',   field_value: DEFAULT_CONTENT.hero.cta_primary_text },
      { section: 'hero', field_key: 'cta_primary_link',   field_value: DEFAULT_CONTENT.hero.cta_primary_link },
      { section: 'hero', field_key: 'cta_secondary_text', field_value: DEFAULT_CONTENT.hero.cta_secondary_text },
      // Feature cards
      { section: 'features', field_key: 'items', field_value: JSON.stringify(DEFAULT_CONTENT.features.items) },
      // About
      { section: 'about', field_key: 'label',   field_value: DEFAULT_CONTENT.about.label },
      { section: 'about', field_key: 'title',   field_value: DEFAULT_CONTENT.about.title },
      { section: 'about', field_key: 'body',    field_value: DEFAULT_CONTENT.about.body },
      { section: 'about', field_key: 'mission', field_value: DEFAULT_CONTENT.about.mission },
      { section: 'about', field_key: 'values',  field_value: DEFAULT_CONTENT.about.values },
      // Services
      { section: 'services', field_key: 'label',    field_value: DEFAULT_CONTENT.services.label },
      { section: 'services', field_key: 'title',    field_value: DEFAULT_CONTENT.services.title },
      { section: 'services', field_key: 'subtitle', field_value: DEFAULT_CONTENT.services.subtitle },
      { section: 'services', field_key: 'items',    field_value: JSON.stringify(DEFAULT_CONTENT.services.items) },
      // Contact
      { section: 'contact', field_key: 'label',    field_value: DEFAULT_CONTENT.contact.label },
      { section: 'contact', field_key: 'title',    field_value: DEFAULT_CONTENT.contact.title },
      { section: 'contact', field_key: 'subtitle', field_value: DEFAULT_CONTENT.contact.subtitle },
      { section: 'contact', field_key: 'email',    field_value: DEFAULT_CONTENT.contact.email },
      { section: 'contact', field_key: 'phone',    field_value: DEFAULT_CONTENT.contact.phone },
      { section: 'contact', field_key: 'address',  field_value: DEFAULT_CONTENT.contact.address },
    ]

    for (const row of rows) {
      await supabase.from('website_content').upsert(
        { ...row, updated_at: new Date().toISOString() },
        { onConflict: 'section,field_key' }
      )
    }

    setResetting(false)
    setResetDone(true)
    setTimeout(() => setResetDone(false), 4000)
  }

  return (
    <div className="p-8 max-w-2xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Indstillinger</h1>
        <p className="text-sm text-gray-500 mt-1">Administrer dit CMS og din konto</p>
      </div>

      <div className="space-y-6">
        {/* Account */}
        <div className="card">
          <div className="flex items-center gap-2 mb-4">
            <Settings className="w-4 h-4 text-gray-400" />
            <h2 className="text-sm font-semibold text-gray-900">Konto</h2>
          </div>
          <div className="space-y-3">
            <div>
              <label className="field-label">Email</label>
              <div className="field-input bg-gray-50 text-gray-500 cursor-not-allowed">{email}</div>
            </div>
            <div>
              <label className="field-label">Rolle</label>
              <div className="field-input bg-gray-50 text-gray-500 cursor-not-allowed">Admin</div>
            </div>
          </div>
        </div>

        {/* Website */}
        <div className="card">
          <div className="flex items-center gap-2 mb-4">
            <Globe className="w-4 h-4 text-gray-400" />
            <h2 className="text-sm font-semibold text-gray-900">Website</h2>
          </div>
          <div className="space-y-3">
            <div>
              <label className="field-label">URL</label>
              <div className="field-input bg-gray-50 text-gray-500 cursor-not-allowed">https://aboutdata.dk</div>
            </div>
            <a href="https://aboutdata.dk" target="_blank" rel="noopener noreferrer" className="btn-secondary text-xs">
              Åbn website
            </a>
          </div>
        </div>

        {/* Danger zone */}
        <div className="card border-red-200">
          <div className="flex items-center gap-2 mb-4">
            <Bell className="w-4 h-4 text-red-400" />
            <h2 className="text-sm font-semibold text-red-700">Farezone</h2>
          </div>
          <p className="text-xs text-gray-500 mb-3">
            Nulstil alt website indhold til standardværdier. Denne handling kan ikke fortrydes.
          </p>
          <button
            onClick={handleReset}
            disabled={resetting || resetDone}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-600 border border-red-200 rounded-md hover:bg-red-50 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {resetting ? (
              <><Loader2 className="w-4 h-4 animate-spin" />Nulstiller...</>
            ) : resetDone ? (
              <><CheckCircle2 className="w-4 h-4 text-green-500" />Nulstillet</>
            ) : (
              'Nulstil indhold'
            )}
          </button>
        </div>
      </div>
    </div>
  )
}

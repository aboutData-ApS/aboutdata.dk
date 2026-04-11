'use client'

import { useState, useEffect } from 'react'
import { Layers, Save, Loader2, CheckCircle2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { DEFAULT_CONTENT } from '@/lib/defaults'
import EditableField from '@/components/editor/EditableField'
import type { SiteContent, Service, FeatureCard } from '@/types'

export default function EditorPage() {
  const [content, setContent] = useState<SiteContent>(DEFAULT_CONTENT)
  const [original, setOriginal] = useState<SiteContent>(DEFAULT_CONTENT)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const supabase = createClient()

  const isDirty = JSON.stringify(content) !== JSON.stringify(original)

  useEffect(() => {
    async function load() {
      const { data } = await supabase.from('website_content').select('*')
      if (data && data.length > 0) {
        const loaded = structuredClone(DEFAULT_CONTENT) as SiteContent
        for (const row of data) {
          const { section, field_key, field_value } = row
          if ((section === 'services' || section === 'features') && field_key === 'items') {
            try {
              if (section === 'services') loaded.services.items = JSON.parse(field_value)
              if (section === 'features') loaded.features.items = JSON.parse(field_value)
            } catch { /* keep default */ }
          } else if (section in loaded) {
            const sec = loaded[section as keyof SiteContent] as unknown as Record<string, unknown>
            sec[field_key] = field_value
          }
        }
        setContent(loaded)
        setOriginal(structuredClone(loaded))
      }
      setLoading(false)
    }
    load()
  }, [])

  function setHero(field: string, value: string) {
    setContent(prev => ({ ...prev, hero: { ...prev.hero, [field]: value } }))
  }
  function setAbout(field: string, value: string) {
    setContent(prev => ({ ...prev, about: { ...prev.about, [field]: value } }))
  }
  function setServices(field: string, value: string) {
    setContent(prev => ({ ...prev, services: { ...prev.services, [field]: value } }))
  }
  function setServiceItem(idx: number, field: keyof Service, value: string) {
    setContent(prev => {
      const items = prev.services.items.map((s, i) => i === idx ? { ...s, [field]: value } : s)
      return { ...prev, services: { ...prev.services, items } }
    })
  }
  function setFeatureItem(idx: number, field: keyof FeatureCard, value: string) {
    setContent(prev => {
      const items = prev.features.items.map((f, i) => i === idx ? { ...f, [field]: value } : f)
      return { ...prev, features: { items } }
    })
  }
  function setContact(field: string, value: string) {
    setContent(prev => ({ ...prev, contact: { ...prev.contact, [field]: value } }))
  }

  async function handleSave() {
    setSaving(true)

    const upsert = async (section: string, key: string, value: string) => {
      await supabase.from('website_content').upsert(
        { section, field_key: key, field_value: value, updated_at: new Date().toISOString() },
        { onConflict: 'section,field_key' }
      )
    }

    const { hero, about, services, contact, features } = content
    await Promise.all([
      upsert('hero', 'headline', hero.headline),
      upsert('hero', 'headline_highlight', hero.headline_highlight),
      upsert('hero', 'subheadline', hero.subheadline),
      upsert('hero', 'cta_primary_text', hero.cta_primary_text),
      upsert('hero', 'cta_primary_link', hero.cta_primary_link),
      upsert('hero', 'cta_secondary_text', hero.cta_secondary_text),
      upsert('features', 'items', JSON.stringify(features.items)),
      upsert('about', 'label', about.label),
      upsert('about', 'title', about.title),
      upsert('about', 'body', about.body),
      upsert('about', 'mission', about.mission),
      upsert('about', 'values', about.values),
      upsert('services', 'label', services.label),
      upsert('services', 'title', services.title),
      upsert('services', 'subtitle', services.subtitle),
      upsert('services', 'items', JSON.stringify(services.items)),
      upsert('contact', 'label', contact.label),
      upsert('contact', 'title', contact.title),
      upsert('contact', 'subtitle', contact.subtitle),
      upsert('contact', 'email', contact.email),
      upsert('contact', 'phone', contact.phone),
      upsert('contact', 'address', contact.address),
    ])

    setOriginal(structuredClone(content))
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="flex items-center gap-3 text-gray-400">
          <Loader2 className="w-5 h-5 animate-spin" />
          <span className="text-sm">Indlæser indhold...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full overflow-hidden">

      {/* Sticky save bar */}
      <div className="sticky top-0 z-50 bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4 text-gray-400" />
          <span className="text-sm font-semibold text-gray-900">Website Editor</span>
          {isDirty && <span className="text-xs text-orange-500 font-medium ml-1">• Ugemte ændringer</span>}
        </div>
        <button
          onClick={handleSave}
          disabled={!isDirty || saving}
          className="btn-primary disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {saving ? <><Loader2 className="w-4 h-4 animate-spin" />Gemmer...</>
            : saved ? <><CheckCircle2 className="w-4 h-4" />Gemt</>
            : <><Save className="w-4 h-4" />Gem</>}
        </button>
      </div>

      {/* Hint bar */}
      <div className="bg-blue-50 border-b border-blue-100 px-6 py-2 text-xs text-blue-600 shrink-0">
        Klik på en tekst for at redigere den direkte på siden. Tryk <kbd className="bg-blue-100 px-1 rounded">Gem</kbd> når du er klar.
      </div>

      {/* Website canvas */}
      <div className="flex-1 overflow-y-auto bg-gray-100">
        <div className="max-w-[860px] mx-auto my-6 bg-white shadow-sm rounded-lg overflow-hidden" style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}>

          {/* NAV (static — logos not editable) */}
          <nav className="h-14 px-8 flex items-center justify-between border-b border-gray-200 bg-white">
            <span className="font-bold text-gray-900">about<span className="text-blue-600">Data</span>.dk</span>
            <div className="flex items-center gap-1 text-sm text-gray-500">
              <span className="px-3 py-1 rounded">Om os</span>
              <span className="px-3 py-1 rounded">Services</span>
              <span className="px-3 py-1 bg-blue-600 text-white rounded-md text-xs font-medium">Kontakt</span>
            </div>
          </nav>

          {/* HERO */}
          <section className="px-10 py-16 bg-white">
            <h1 className="text-4xl font-bold text-gray-900 leading-tight tracking-tight mb-4" style={{ letterSpacing: '-0.04em' }}>
              <EditableField
                value={content.hero.headline}
                onChange={v => setHero('headline', v)}
                className="text-4xl font-bold text-gray-900"
                placeholder="Headline her..."
              />{' '}
              <EditableField
                value={content.hero.headline_highlight}
                onChange={v => setHero('headline_highlight', v)}
                className="text-4xl font-bold text-blue-600"
                placeholder="blå del..."
              />
            </h1>
            <p className="text-lg text-gray-500 max-w-xl mb-8 leading-relaxed">
              <EditableField
                as="textarea"
                rows={2}
                value={content.hero.subheadline}
                onChange={v => setHero('subheadline', v)}
                className="text-lg text-gray-500 w-full leading-relaxed"
                placeholder="Subheadline..."
              />
            </p>
            <div className="flex gap-3">
              <span className="inline-flex items-center px-5 py-2.5 bg-blue-600 text-white text-sm font-semibold rounded-md">
                <EditableField
                  value={content.hero.cta_primary_text}
                  onChange={v => setHero('cta_primary_text', v)}
                  className="text-sm font-semibold text-white"
                  placeholder="Primær knap"
                />
              </span>
              <span className="inline-flex items-center px-5 py-2.5 border border-gray-300 text-gray-700 text-sm font-semibold rounded-md">
                <EditableField
                  value={content.hero.cta_secondary_text}
                  onChange={v => setHero('cta_secondary_text', v)}
                  className="text-sm font-semibold text-gray-700"
                  placeholder="Sekundær knap"
                />
              </span>
            </div>
          </section>

          {/* FEATURE STRIP — editable */}
          <section className="px-10 py-12 bg-gray-50">
            <div className="grid grid-cols-3 gap-6">
              {content.features.items.map((f, idx) => (
                <div key={f.id} className="bg-white rounded-xl p-6 text-center">
                  <div className="w-9 h-9 bg-orange-100 rounded-full mx-auto mb-4" />
                  <h3 className="font-bold text-gray-900 text-sm leading-snug mb-2">
                    <EditableField
                      value={f.title}
                      onChange={v => setFeatureItem(idx, 'title', v)}
                      className="font-bold text-gray-900 text-sm"
                      placeholder="Titel..."
                    />
                  </h3>
                  <p className="text-xs text-gray-500 leading-relaxed">
                    <EditableField
                      as="textarea"
                      rows={3}
                      value={f.description}
                      onChange={v => setFeatureItem(idx, 'description', v)}
                      className="text-xs text-gray-500 w-full leading-relaxed"
                      placeholder="Beskrivelse..."
                    />
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* OM OS */}
          <section className="px-10 py-14 bg-white">
            <div className="flex gap-10 items-start">
              <div className="flex-1">
                <p className="text-xs font-bold uppercase tracking-widest text-blue-600 mb-2">
                  <EditableField
                    value={content.about.label}
                    onChange={v => setAbout('label', v)}
                    className="text-xs font-bold uppercase tracking-widest text-blue-600"
                    placeholder="Om os"
                  />
                </p>
                <h2 className="text-2xl font-bold text-gray-900 mb-4" style={{ letterSpacing: '-0.025em' }}>
                  <EditableField
                    value={content.about.title}
                    onChange={v => setAbout('title', v)}
                    className="text-2xl font-bold text-gray-900"
                    placeholder="Om os titel..."
                  />
                </h2>
                <div className="text-gray-500 text-base leading-relaxed">
                  <EditableField
                    as="textarea"
                    rows={4}
                    value={content.about.body}
                    onChange={v => setAbout('body', v)}
                    className="text-base text-gray-500 w-full leading-relaxed"
                    placeholder="Brødtekst..."
                  />
                </div>
              </div>
              {/* CEO photo — static, ikke redigerbar */}
              <img
                src="/img/ceo.jpg"
                alt="CEO"
                className="rounded-xl object-cover object-top shrink-0"
                style={{ width: 160, height: 200 }}
              />
            </div>
          </section>

          {/* TECH STRIP (static — logoer ikke redigerbare) */}
          <section className="px-10 py-10 bg-gray-50">
            <p className="text-xs font-bold uppercase tracking-widest text-blue-600 mb-6">Microsoft Dataplatform</p>
            <div className="flex gap-3 flex-wrap">
              {['Microsoft Fabric', 'Power BI', 'Azure', 'SQL Server', 'Databricks'].map(t => (
                <div key={t} className="flex items-center gap-2 px-4 py-2.5 border border-gray-200 rounded-lg bg-white">
                  <div className="w-6 h-6 bg-gray-200 rounded" />
                  <span className="text-sm font-semibold text-gray-800">{t}</span>
                </div>
              ))}
            </div>
          </section>

          {/* SERVICES */}
          <section className="px-10 py-14 bg-white">
            <p className="text-xs font-bold uppercase tracking-widest text-blue-600 mb-2">
              <EditableField
                value={content.services.label}
                onChange={v => setServices('label', v)}
                className="text-xs font-bold uppercase tracking-widest text-blue-600"
                placeholder="Hvad vi tilbyder"
              />
            </p>
            <h2 className="text-2xl font-bold text-gray-900 mb-8" style={{ letterSpacing: '-0.025em' }}>
              <EditableField
                value={content.services.title}
                onChange={v => setServices('title', v)}
                className="text-2xl font-bold text-gray-900"
                placeholder="Services titel..."
              />
            </h2>
            <div className="grid grid-cols-2 gap-px bg-gray-200 border border-gray-200 rounded-lg overflow-hidden">
              {content.services.items.map((service, idx) => (
                <div key={service.id} className="bg-white p-7 hover:bg-blue-50 transition-colors">
                  <h3 className="font-bold text-gray-900 text-base mb-2">
                    <EditableField
                      value={service.title}
                      onChange={v => setServiceItem(idx, 'title', v)}
                      className="font-bold text-gray-900 text-base"
                      placeholder="Service navn..."
                    />
                  </h3>
                  <p className="text-sm text-gray-500 leading-relaxed">
                    <EditableField
                      as="textarea"
                      rows={2}
                      value={service.description}
                      onChange={v => setServiceItem(idx, 'description', v)}
                      className="text-sm text-gray-500 w-full leading-relaxed"
                      placeholder="Beskrivelse..."
                    />
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* KONTAKT */}
          <section className="px-10 py-14 bg-gray-50">
            <p className="text-xs font-bold uppercase tracking-widest text-blue-600 mb-2">
              <EditableField
                value={content.contact.label}
                onChange={v => setContact('label', v)}
                className="text-xs font-bold uppercase tracking-widest text-blue-600"
                placeholder="Kom i kontakt"
              />
            </p>
            <h2 className="text-2xl font-bold text-gray-900 mb-3" style={{ letterSpacing: '-0.025em' }}>
              <EditableField
                value={content.contact.title}
                onChange={v => setContact('title', v)}
                className="text-2xl font-bold text-gray-900"
                placeholder="Kontakt titel..."
              />
            </h2>
            <div className="text-gray-500 mb-6 max-w-md">
              <EditableField
                as="textarea"
                rows={2}
                value={content.contact.subtitle}
                onChange={v => setContact('subtitle', v)}
                className="text-base text-gray-500 w-full leading-relaxed"
                placeholder="Kontakt undertitel..."
              />
            </div>
            <div className="space-y-3 text-sm text-gray-500">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-gray-800 block mb-0.5">Email</span>
                <EditableField value={content.contact.email} onChange={v => setContact('email', v)} className="text-blue-600 text-sm" placeholder="email@firma.dk" />
              </div>
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-gray-800 block mb-0.5">Telefon</span>
                <EditableField value={content.contact.phone} onChange={v => setContact('phone', v)} className="text-sm text-gray-500" placeholder="XX XX XX XX" />
              </div>
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-gray-800 block mb-0.5">Placering</span>
                <EditableField value={content.contact.address} onChange={v => setContact('address', v)} className="text-sm text-gray-500" placeholder="Adresse..." />
              </div>
            </div>
          </section>

          {/* FOOTER (static) */}
          <footer className="px-10 py-5 border-t border-gray-200 flex items-center justify-between">
            <span className="font-bold text-gray-900 text-sm">about<span className="text-blue-600">Data</span>.dk</span>
            <span className="text-xs text-gray-400">&copy; {new Date().getFullYear()} aboutData.dk</span>
          </footer>

        </div>
      </div>
    </div>
  )
}

import { createClient } from '@/lib/supabase/server'
import type { SiteContent } from '@/types'
import { DEFAULT_CONTENT } from '@/lib/defaults'

export { DEFAULT_CONTENT }

export async function getSiteContent(): Promise<SiteContent> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('website_content')
    .select('*')

  if (error || !data || data.length === 0) {
    return DEFAULT_CONTENT
  }

  const content = structuredClone(DEFAULT_CONTENT) as SiteContent

  for (const row of data) {
    const { section, field_key, field_value } = row
    if (section === 'services' && field_key === 'items') {
      try {
        content.services.items = JSON.parse(field_value)
      } catch {
        // keep default
      }
    } else if (section in content) {
      const sec = content[section as keyof SiteContent] as unknown as Record<string, unknown>
      sec[field_key] = field_value
    }
  }

  return content
}

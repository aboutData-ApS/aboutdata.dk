export type Section = 'hero' | 'about' | 'services' | 'contact' | 'features'

export interface WebsiteContent {
  id: string
  section: Section
  field_key: string
  field_value: string
  updated_at: string
}

export interface HeroContent {
  headline: string
  headline_highlight: string
  subheadline: string
  cta_primary_text: string
  cta_primary_link: string
  cta_secondary_text: string
}

export interface AboutContent {
  label: string
  title: string
  body: string
  values: string
  mission: string
}

export interface Service {
  id: string
  title: string
  description: string
  icon: string
}

export interface ServicesContent {
  label: string
  title: string
  subtitle: string
  items: Service[]
}

export interface ContactContent {
  label: string
  title: string
  subtitle: string
  email: string
  phone: string
  address: string
}

export interface FeatureCard {
  id: string
  title: string
  description: string
}

export interface FeaturesContent {
  items: FeatureCard[]
}

export interface SiteContent {
  hero: HeroContent
  about: AboutContent
  services: ServicesContent
  contact: ContactContent
  features: FeaturesContent
}

export interface AnalyticsEvent {
  id: string
  event_type: 'page_view' | 'cta_click' | 'form_submit'
  section: string | null
  page: string
  metadata: Record<string, unknown>
  created_at: string
}

export interface Lead {
  id: string
  name: string
  email: string
  message: string | null
  status: 'new' | 'read' | 'archived'
  created_at: string
}

export interface DashboardMetrics {
  totalPageViews: number
  totalCtaClicks: number
  totalLeads: number
  viewsThisWeek: number[]
  topSection: string
  topCta: string
}

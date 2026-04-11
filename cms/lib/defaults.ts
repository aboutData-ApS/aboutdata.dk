import type { SiteContent } from '@/types'

export const DEFAULT_CONTENT: SiteContent = {
  hero: {
    headline: 'Datadrevet indsigt der',
    headline_highlight: 'skaber vækst',
    subheadline: 'Data omsat til konkrete beslutninger og målbare resultater — fra analyse og BI til strategisk udvikling.',
    cta_primary_text: 'Kontakt os',
    cta_primary_link: '#kontakt',
    cta_secondary_text: 'Se vores services',
  },
  features: {
    items: [
      {
        id: '1',
        title: 'Data Intelligence + AI enablement',
        description: 'Specialister i Microsoft Dataplatform — Fabric, Power BI, Azure, SQL Server og Databricks. Grundstenen til et stærkt data- og AI-fundament.',
      },
      {
        id: '2',
        title: 'Seniorkonsulenter fra start til slut',
        description: 'Et samarbejde med datateam starter og slutter med en seniorkonsulent, der er hands-on hele vejen.',
      },
      {
        id: '3',
        title: 'De rette freelance kompetencer',
        description: 'Freelance it-konsulenter er der nok af. Nøglen er at matche kompetencer med kundekrav, så det rette hold kan stilles.',
      },
    ],
  },
  about: {
    label: 'Om os',
    title: 'Data som din stærkeste ressource',
    body: 'aboutData.dk er et specialiseret konsulenthus inden for data og business intelligence — med fokus på at skabe overblik, optimere processer og understøtte bedre beslutninger gennem datadrevet indsigt.',
    mission: 'Hands-on implementering — ikke bare rådgivning.',
    values: 'Dyb faglig ekspertise, skræddersyede løsninger og klar kommunikation hele vejen.',
  },
  services: {
    label: 'Hvad vi tilbyder',
    title: 'Services',
    subtitle: 'Skræddersyede dataløsninger',
    items: [
      { id: '1', title: 'Dataanalyse', description: 'Komplekse data omsat til klare indsigter, der skaber konkret værdi for forretningen.', icon: 'BarChart2' },
      { id: '2', title: 'Business Intelligence', description: 'Dashboards og rapporter der giver indsigt og et solidt beslutningsgrundlag.', icon: 'PieChart' },
      { id: '3', title: 'Datakonsultation', description: 'Rådgivning om dataarkitektur, platforme og best practices — med hands-on implementering af løsninger, der holder.', icon: 'Database' },
      { id: '4', title: 'Datastrategi', description: 'Klar retning for datarejsen — fra governance og kvalitet til langsigtet skalering.', icon: 'TrendingUp' },
    ],
  },
  contact: {
    label: 'Kom i kontakt',
    title: 'Lad os tale om jeres data',
    subtitle: 'Har I brug for hjælp til jeres data — eller vil I høre mere om mulighederne? Tag gerne kontakt til en uforpligtende dialog om, hvad der er muligt.',
    email: 'hzm@aboutdata.dk',
    phone: '60 61 10 15',
    address: 'Trigevej 20, 8382 Hinnerup',
  },
}

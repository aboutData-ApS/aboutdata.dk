import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'aboutData CMS',
  description: 'Website management dashboard for aboutData.dk',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="da">
      <body>{children}</body>
    </html>
  )
}

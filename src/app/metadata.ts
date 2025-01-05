import { Metadata, Viewport } from 'next';

export const metadata: Metadata = {
  title: 'Petit Génie',
  description: 'Application éducative pour les élèves de primaire',
  manifest: '/manifest.json',
  icons: {
    apple: '/icon-512x512.png',
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Petit Génie',
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
}

import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Cogpite — AI Procurement Intelligence',
    short_name: 'Cogpite',
    description: 'AI-powered RFP intelligence platform for East African ICT firms. Track government tenders from PPDA, PPOA, RPPA.',
    start_url: '/',
    display: 'standalone',
    background_color: '#0a0f1a',
    theme_color: '#0a0f1a',
    icons: [
      {
        src: '/android-chrome-192x192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/android-chrome-512x512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/maskable-512x512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
    ],
  }
}

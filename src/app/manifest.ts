import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Manuel Barra Lazo — Frontend Web Developer & AI Integrator',
    short_name: 'malb.dev',
    description: 'Portfolio de Manuel Barra Lazo. Frontend moderno, animaciones y experiencias web únicas.',
    start_url: '/',
    display: 'standalone',
    background_color: '#03060d',
    theme_color: '#3DDCFF',
    icons: [
      { src: '/icons/icon-192.png', sizes: '192x192', type: 'image/png' },
      { src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png' },
    ],
  }
}

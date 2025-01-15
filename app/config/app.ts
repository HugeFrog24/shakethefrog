export const appConfig = {
  name: 'Shake the Frog',
  description: 'A fun interactive frog that reacts to shaking!',
  url: 'https://shakethefrog.vercel.app',
  assets: {
    favicon: '/images/frog.svg',
    ogImage: {
      width: 1200,
      height: 630,
      bgColor: '#f0fdf4',
      textColor: '#374151'
    }
  }
} as const 
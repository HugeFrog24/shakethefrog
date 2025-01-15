export const appConfig = {
  name: 'Shake the Frog',
  description: 'A fun interactive frog that reacts to shaking!',
  url: 'https://shakethefrog.com',
  assets: {
    favicon: '/images/frog.svg',
    ogImage: {
      width: 1200,
      height: 630,
      bgColor: '#c9ffda',
      textColor: '#000000'
    }
  }
} as const 
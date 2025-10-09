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
  },
  skins: {
    frog: {
      id: 'frog',
      name: 'Frog',
      normal: '/images/frog.svg',
      shaken: '/images/frog-shaken.svg'
    },
    mandarin: {
      id: 'mandarin',
      name: 'Mandarin',
      normal: '/images/mandarin.svg',
      // TODO: Create a proper shaken version of the mandarin skin
      shaken: '/images/mandarin.svg' // Using the same image for both states until a shaken version is created
    },
    beaver: {
      id: 'beaver',
      name: 'Beaver',
      normal: '/images/beaver.svg',
      shaken: '/images/beaver-shaken.svg'
    }
  },
  defaultSkin: 'frog'
} as const
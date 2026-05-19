export type PhotoService = {
  id: string
  title: string
  tagline: string
  description: string
  includes: string[]
  startingPrice: string
  image: string
}

export const photoServices: PhotoService[] = [
  {
    id: 'portraits',
    title: 'Portrait Sessions',
    tagline: 'People, personality, presence',
    description:
      'Individual, couple, family, and milestone portraits — studio or on location. Relaxed direction so you feel like yourself.',
    includes: ['1–2 hour session', 'Outfit guidance', '20+ edited images', 'Online gallery'],
    startingPrice: 'From R1 200',
    image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=600&q=80',
  },
  {
    id: 'lifestyle',
    title: 'Lifestyle & Brand',
    tagline: 'Story-driven visuals',
    description:
      'Content for creators, small businesses, and social media — authentic moments that match your brand voice.',
    includes: ['Half or full day', 'Multiple looks/locations', 'Commercial usage option'],
    startingPrice: 'From R2 500',
    image: 'https://images.unsplash.com/photo-1493863641949-9b8692952d07?w=600&q=80',
  },
  {
    id: 'product',
    title: 'Product & Crochet Styling',
    tagline: 'Your pieces, beautifully lit',
    description:
      'Flat lays, detail shots, and styled scenes for crochet inventory, crafts, food, fashion, and anything you sell.',
    includes: ['Styled setups', 'White-background option', 'Web-ready exports'],
    startingPrice: 'From R800',
    image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=600&q=80',
  },
  {
    id: 'events',
    title: 'Events & Celebrations',
    tagline: 'Moments you will want to keep',
    description:
      'Birthdays, baby showers, small weddings, and gatherings — candid coverage with a warm, editorial feel.',
    includes: ['Coverage by the hour', 'Highlight reel option', 'Print-ready files'],
    startingPrice: 'From R1 800',
    image: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=600&q=80',
  },
]

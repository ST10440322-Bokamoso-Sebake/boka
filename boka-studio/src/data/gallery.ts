export type GalleryItem = {
  id: string
  type: 'crochet' | 'photo'
  title: string
  image: string
}

export const galleryItems: GalleryItem[] = [
  {
    id: 'g1',
    type: 'crochet',
    title: 'Handmade tote collection',
    image: 'https://images.unsplash.com/photo-1590874103328-dc06756b0770?w=800&q=80',
  },
  {
    id: 'g2',
    type: 'photo',
    title: 'Golden hour portrait',
    image: 'https://images.unsplash.com/photo-1531746020798-e695fe9f2a04?w=800&q=80',
  },
  {
    id: 'g3',
    type: 'crochet',
    title: 'Cozy wearables',
    image: 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=800&q=80',
  },
  {
    id: 'g4',
    type: 'photo',
    title: 'Lifestyle session',
    image: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=800&q=80',
  },
  {
    id: 'g5',
    type: 'photo',
    title: 'Product styling',
    image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&q=80',
  },
  {
    id: 'g6',
    type: 'crochet',
    title: 'Home décor pieces',
    image: 'https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=800&q=80',
  },
  {
    id: 'g7',
    type: 'photo',
    title: 'Celebration coverage',
    image: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=800&q=80',
  },
  {
    id: 'g8',
    type: 'crochet',
    title: 'Yarn & texture detail',
    image: 'https://images.unsplash.com/photo-1586105251266-9a3fa7552371?w=800&q=80',
  },
]

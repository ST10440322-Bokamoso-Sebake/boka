export type Product = {
  id: string
  name: string
  category: string
  price: number
  description: string
  image: string
}

export const products: Product[] = [
  {
    id: '1',
    name: 'Sunset Granny Square Bag',
    category: 'Bags & Totes',
    price: 450,
    description: 'Hand-crocheted cotton bag with boho sunset tones. One of a kind.',
    image: 'https://images.unsplash.com/photo-1590874103328-dc06756b0770?w=600&q=80',
  },
  {
    id: '2',
    name: 'Lavender Cloud Cardigan',
    category: 'Wearables',
    price: 890,
    description: 'Soft, oversized cardigan in dreamy lavender yarn. Made to order.',
    image: 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=600&q=80',
  },
  {
    id: '3',
    name: 'Macramé Plant Hanger Set',
    category: 'Home Décor',
    price: 320,
    description: 'Set of two crochet-and-macramé hangers for indoor plants.',
    image: 'https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=600&q=80',
  },
  {
    id: '4',
    name: 'Cozy Bucket Hat',
    category: 'Accessories',
    price: 280,
    description: 'Lightweight cotton bucket hat — perfect for sunny days.',
    image: 'https://images.unsplash.com/photo-1521369909029-2afed882baee?w=600&q=80',
  },
  {
    id: '5',
    name: 'Baby Blanket — Sage Stripe',
    category: 'Gifts',
    price: 650,
    description: 'Heirloom-quality baby blanket in sage and cream organic cotton.',
    image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&q=80',
  },
  {
    id: '6',
    name: 'Custom Crochet Commission',
    category: 'Custom',
    price: 0,
    description: 'Tell us your vision — we will quote and craft something uniquely yours.',
    image: 'https://images.unsplash.com/photo-1586105251266-9a3fa7552371?w=600&q=80',
  },
]

import { apiFetch, type ApiProduct } from '../lib/api'
import { apiImageUrl } from '../lib/config'
import type { Product } from '../data/products'
import { products as fallbackProducts } from '../data/products'

function mapProduct(p: ApiProduct): Product {
  return {
    id: String(p.id),
    name: p.name,
    category: p.category,
    price: p.price,
    description: p.description,
    image: apiImageUrl(p.imageUrl),
  }
}

export async function fetchProducts(): Promise<Product[]> {
  try {
    const data = await apiFetch<ApiProduct[]>('api/products')
    if (data.length > 0) return data.map(mapProduct)
  } catch (e) {
    console.warn('Could not load products from API, using fallbacks:', e)
  }
  return fallbackProducts
}

export function apiProductFromForm(form: {
  id?: number
  name: string
  description: string
  price: number
  inventoryCount: number
  imageUrl: string
  category: string
}): ApiProduct {
  return {
    id: form.id ?? 0,
    name: form.name,
    description: form.description,
    price: form.price,
    inventoryCount: form.inventoryCount,
    imageUrl: form.imageUrl,
    category: form.category,
    isNewlyAdded: false,
  }
}

export async function fetchAdminProducts(): Promise<ApiProduct[]> {
  return apiFetch<ApiProduct[]>('api/products')
}

export async function createProduct(product: Omit<ApiProduct, 'id' | 'isNewlyAdded'>): Promise<ApiProduct> {
  return apiFetch<ApiProduct>('api/products', {
    method: 'POST',
    body: JSON.stringify({ ...product, isNewlyAdded: true }),
  })
}

export async function updateProduct(id: number, product: ApiProduct): Promise<void> {
  await apiFetch(`api/products/${id}`, {
    method: 'PUT',
    body: JSON.stringify(product),
  })
}

export async function deleteProduct(id: number): Promise<void> {
  await apiFetch(`api/products/${id}`, { method: 'DELETE' })
}

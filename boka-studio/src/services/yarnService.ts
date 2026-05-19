import { apiFetch, type ApiYarnColor } from '../lib/api'
import { defaultYarnStock, type YarnColor } from '../data/yarnStock'

function mapYarn(y: ApiYarnColor): YarnColor {
  return {
    id: y.slug,
    name: y.name,
    hex: y.hex,
    inStock: y.inStock,
  }
}

export async function fetchYarnStock(): Promise<YarnColor[]> {
  try {
    const data = await apiFetch<ApiYarnColor[]>('api/yarn')
    if (data.length > 0) return data.map(mapYarn)
  } catch (e) {
    console.warn('Yarn API unavailable, using defaults:', e)
  }
  return defaultYarnStock
}

export async function updateYarnStock(id: number, inStock: boolean): Promise<void> {
  await apiFetch(`api/yarn/${id}`, {
    method: 'PUT',
    body: JSON.stringify({ inStock }),
  })
}

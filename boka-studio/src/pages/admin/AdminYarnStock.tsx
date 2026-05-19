import { useEffect, useState } from 'react'
import { apiFetch, type ApiYarnColor } from '../../lib/api'
import { defaultYarnStock } from '../../data/yarnStock'

export function AdminYarnStock() {
  const [stock, setStock] = useState<ApiYarnColor[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    apiFetch<ApiYarnColor[]>('api/yarn')
      .then(setStock)
      .catch(() =>
        setStock(
          defaultYarnStock.map((y, i) => ({
            id: i + 1,
            slug: y.id,
            name: y.name,
            hex: y.hex,
            inStock: y.inStock,
          })),
        ),
      )
      .finally(() => setLoading(false))
  }, [])

  async function toggleStock(yarn: ApiYarnColor) {
    const next = !yarn.inStock
    try {
      await apiFetch(`api/yarn/${yarn.id}`, {
        method: 'PUT',
        body: JSON.stringify({ ...yarn, inStock: next }),
      })
      setStock((prev) => prev.map((y) => (y.id === yarn.id ? { ...y, inStock: next } : y)))
    } catch {
      alert('Could not update yarn stock. Ensure you are logged in as admin.')
    }
  }

  if (loading) return <p className="page-loading">Loading yarn stock…</p>

  return (
    <div className="admin-page">
      <h1>Yarn stock</h1>
      <p className="admin-lead">
        Synced with BokaMarket API — colours in the Design Your Own picker update here.
      </p>

      <ul className="yarn-admin-list">
        {stock.map((y) => (
          <li key={y.id}>
            <span className="yarn-swatch" style={{ backgroundColor: y.hex }} />
            <span>
              {y.name} <code>{y.hex}</code>
            </span>
            <label>
              <input type="checkbox" checked={y.inStock} onChange={() => toggleStock(y)} />
              In stock
            </label>
          </li>
        ))}
      </ul>
    </div>
  )
}

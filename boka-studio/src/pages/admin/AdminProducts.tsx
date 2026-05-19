import { useCallback, useEffect, useState } from 'react'
import type { ApiProduct } from '../../lib/api'
import {
  apiProductFromForm,
  createProduct,
  deleteProduct,
  fetchAdminProducts,
  updateProduct,
} from '../../services/productService'

const emptyForm = {
  name: '',
  description: '',
  price: 0,
  inventoryCount: 0,
  imageUrl: '',
  category: 'Crochet Fashion',
}

export function AdminProducts() {
  const [products, setProducts] = useState<ApiProduct[]>([])
  const [editing, setEditing] = useState<ApiProduct | null>(null)
  const [form, setForm] = useState(emptyForm)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  const refresh = useCallback(() => {
    fetchAdminProducts()
      .then(setProducts)
      .catch(() => alert('Could not load products. Log in as admin and ensure the API is running.'))
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    refresh()
  }, [refresh])

  function startCreate() {
    setEditing(null)
    setForm(emptyForm)
  }

  function startEdit(p: ApiProduct) {
    setEditing(p)
    setForm({
      name: p.name,
      description: p.description,
      price: p.price,
      inventoryCount: p.inventoryCount,
      imageUrl: p.imageUrl,
      category: p.category,
    })
  }

  async function onImageFile(file: File | null) {
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setForm((f) => ({ ...f, imageUrl: reader.result as string }))
      }
    }
    reader.readAsDataURL(file)
  }

  async function save(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    try {
      const payload = apiProductFromForm({ ...form, id: editing?.id })
      if (editing) {
        await updateProduct(editing.id, payload)
      } else {
        await createProduct({
          name: payload.name,
          description: payload.description,
          price: payload.price,
          inventoryCount: payload.inventoryCount,
          imageUrl: payload.imageUrl,
          category: payload.category,
        })
      }
      setEditing(null)
      setForm(emptyForm)
      refresh()
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Save failed')
    } finally {
      setSaving(false)
    }
  }

  async function remove(id: number) {
    if (!confirm('Delete this product from the shelf?')) return
    try {
      await deleteProduct(id)
      refresh()
    } catch {
      alert('Delete failed')
    }
  }

  if (loading) return <p className="page-loading">Loading products…</p>

  return (
    <div className="admin-page">
      <h1>Product shelf</h1>
      <p className="admin-lead">Add, edit, or remove boutique products shown on the public catalog.</p>

      <div className="admin-products-layout">
        <ul className="admin-product-list">
          {products.map((p) => (
            <li key={p.id}>
              <button type="button" onClick={() => startEdit(p)} className={editing?.id === p.id ? 'active' : undefined}>
                {p.imageUrl && !p.imageUrl.startsWith('data:') ? (
                  <img src={p.imageUrl} alt="" className="admin-product-thumb" />
                ) : (
                  <span className="admin-product-thumb placeholder">IMG</span>
                )}
                <span>
                  <strong>{p.name}</strong>
                  <small>
                    R{p.price} · {p.inventoryCount} in stock
                  </small>
                </span>
              </button>
              <button type="button" className="btn btn-outline btn-sm" onClick={() => remove(p.id)}>
                Delete
              </button>
            </li>
          ))}
        </ul>

        <form className="admin-product-form" onSubmit={save}>
          <h2>{editing ? 'Edit product' : 'New product'}</h2>
          <button type="button" className="btn btn-outline" onClick={startCreate}>
            {editing ? 'New product' : 'Clear form'}
          </button>
          <label>
            Name
            <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </label>
          <label>
            Description
            <textarea
              rows={3}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />
          </label>
          <label>
            Price (ZAR)
            <input
              type="number"
              min={0}
              step={0.01}
              required
              value={form.price || ''}
              onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
            />
          </label>
          <label>
            Inventory
            <input
              type="number"
              min={0}
              required
              value={form.inventoryCount || ''}
              onChange={(e) => setForm({ ...form, inventoryCount: Number(e.target.value) })}
            />
          </label>
          <label>
            Category
            <input value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} />
          </label>
          <label>
            Image URL
            <input
              value={form.imageUrl.startsWith('data:') ? '' : form.imageUrl}
              placeholder="https://… or /images/…"
              onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
            />
          </label>
          <label>
            Or upload image
            <input type="file" accept="image/*" onChange={(e) => onImageFile(e.target.files?.[0] ?? null)} />
          </label>
          {form.imageUrl && (
            <img src={form.imageUrl} alt="Preview" className="admin-product-preview" />
          )}
          <button type="submit" className="btn btn-primary" disabled={saving}>
            {saving ? 'Saving…' : editing ? 'Update product' : 'Add product'}
          </button>
        </form>
      </div>
    </div>
  )
}

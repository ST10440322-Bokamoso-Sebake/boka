import { useEffect, useState } from 'react'
import { ProductCard } from '../components/ProductCard'
import type { Product } from '../data/products'
import { fetchProducts } from '../services/productService'

export function Boutique() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchProducts().then((data) => {
      setProducts(data)
      setLoading(false)
    })
  }, [])

  return (
    <>
      <section className="page-hero page-hero-yarn">
        <p className="eyebrow">Crochet boutique</p>
        <h1>Handmade pieces for everyday joy</h1>
        <p>
          Slow-fashion crochet from the BokaMarket catalog — loaded live from your store API.
        </p>
      </section>

      <section className="section">
        {loading ? (
          <p className="page-loading">Loading products…</p>
        ) : (
          <div className="grid grid-3">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
        <p className="note">
          Prices in ZAR from BokaMarket. Custom pieces available via Design your own.
        </p>
      </section>
    </>
  )
}

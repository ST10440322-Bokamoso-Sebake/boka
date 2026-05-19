import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ProductCard } from '../components/ProductCard'
import type { Product } from '../data/products'
import { fetchProducts } from '../services/productService'

export function Home() {
  const [featured, setFeatured] = useState<Product[]>([])

  useEffect(() => {
    fetchProducts().then((all) => setFeatured(all.slice(0, 3)))
  }, [])

  return (
    <>
      <section className="hero hero-split">
        <div className="hero-content">
          <p className="eyebrow">Crochet boutique &amp; photography studio</p>
          <h1>
            Crafted by hand.
            <br />
            Captured with heart.
          </h1>
          <p className="hero-lead">
            Boka Studio brings together one-of-a-kind crochet pieces and warm, story-driven
            photography — for people, products, celebrations, and everything in between.
          </p>
          <div className="hero-actions">
            <Link to="/boutique" className="btn btn-primary">
              Shop the boutique
            </Link>
            <Link to="/design" className="btn btn-secondary">
              Design your own
            </Link>
            <Link to="/photography" className="btn btn-outline">
              View photography
            </Link>
          </div>
        </div>
        <div className="hero-panels">
          <Link to="/boutique" className="hero-panel hero-panel-yarn">
            <span className="panel-icon" aria-hidden="true">
              🧶
            </span>
            <h2>Crochet Boutique</h2>
            <p>Bags, wearables, décor &amp; custom commissions</p>
          </Link>
          <Link to="/photography" className="hero-panel hero-panel-lens">
            <span className="panel-icon" aria-hidden="true">
              📷
            </span>
            <h2>Photography</h2>
            <p>Portraits, lifestyle, products &amp; events</p>
          </Link>
        </div>
      </section>

      <section className="section">
        <div className="section-header">
          <h2>Featured crochet</h2>
          <p>Small-batch pieces made with care — each one unique.</p>
        </div>
        <div className="grid grid-3">
          {featured.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
        <p className="section-cta">
          <Link to="/boutique">See full boutique →</Link>
        </p>
      </section>

      <section className="section section-alt">
        <div className="split-banner">
          <div>
            <h2>Need photos of your crochet — or anything else?</h2>
            <p>
              We shoot portraits, brand content, product flat lays, and event coverage. Perfect
              for makers who want their work to shine online.
            </p>
            <Link to="/photography" className="btn btn-primary">
              Explore packages
            </Link>
          </div>
          <img
            src="https://images.unsplash.com/photo-1493863641949-9b8692952d07?w=800&q=80"
            alt="Photography session in natural light"
            loading="lazy"
          />
        </div>
      </section>
    </>
  )
}

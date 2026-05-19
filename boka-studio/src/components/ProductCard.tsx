import { Link } from 'react-router-dom'
import type { Product } from '../data/products'

type Props = {
  product: Product
}

export function ProductCard({ product }: Props) {
  const priceLabel =
    product.price === 0 ? 'Price on request' : `R${product.price.toLocaleString('en-ZA')}`

  return (
    <article className="card product-card">
      <img src={product.image} alt={product.name} loading="lazy" />
      <div className="card-body">
        <span className="badge">{product.category}</span>
        <h3>{product.name}</h3>
        <p>{product.description}</p>
        <p className="price">{priceLabel}</p>
        <Link to="/contact?interest=boutique" className="btn btn-outline">
          Inquire
        </Link>
      </div>
    </article>
  )
}

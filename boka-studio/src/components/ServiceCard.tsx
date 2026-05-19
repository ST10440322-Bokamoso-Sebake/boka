import { Link } from 'react-router-dom'
import type { PhotoService } from '../data/services'

type Props = {
  service: PhotoService
}

export function ServiceCard({ service }: Props) {
  return (
    <article className="card service-card">
      <img src={service.image} alt={service.title} loading="lazy" />
      <div className="card-body">
        <p className="service-tagline">{service.tagline}</p>
        <h3>{service.title}</h3>
        <p>{service.description}</p>
        <ul>
          {service.includes.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
        <p className="price">{service.startingPrice}</p>
        <Link
          to={`/contact?interest=photo&service=${service.id}`}
          className="btn btn-primary"
        >
          Book this session
        </Link>
      </div>
    </article>
  )
}

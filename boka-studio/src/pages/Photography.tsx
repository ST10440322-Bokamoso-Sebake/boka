import { Link } from 'react-router-dom'
import { photoServices } from '../data/services'
import { ServiceCard } from '../components/ServiceCard'

export function Photography() {
  return (
    <>
      <section className="page-hero page-hero-lens">
        <p className="eyebrow">Photography</p>
        <h1>People, products &amp; moments</h1>
        <p>
          Warm, natural-light photography for portraits, lifestyle content, crochet product
          shots, events, and anything you want remembered beautifully.
        </p>
      </section>

      <section className="section">
        <div className="grid grid-2">
          {photoServices.map((service) => (
            <ServiceCard key={service.id} service={service} />
          ))}
        </div>
      </section>

      <section className="section section-alt">
        <div className="info-box">
          <h2>Not sure which package fits?</h2>
          <p>
            Tell us about your vision — a birthday shoot, Etsy product photos, or branding
            for your small business. We will recommend the right session length and deliverables.
          </p>
          <Link to="/contact?interest=photo" className="btn btn-primary">
            Get a custom quote
          </Link>
        </div>
      </section>
    </>
  )
}

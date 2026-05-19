import { Link } from 'react-router-dom'

export function About() {
  return (
    <>
      <section className="page-hero">
        <p className="eyebrow">About Boka Studio</p>
        <h1>Two crafts, one creative home</h1>
        <p>
          Boka Studio started with a love of yarn and grew into a space where handmade crochet
          and photography live side by side.
        </p>
      </section>

      <section className="section about-grid">
        <article className="about-card">
          <h2>🧶 The boutique</h2>
          <p>
            Every piece is crocheted by hand — no mass production. We focus on quality fibers,
            thoughtful colour palettes, and designs that feel warm, wearable, and uniquely yours.
          </p>
          <Link to="/boutique">Browse the collection</Link>
        </article>
        <article className="about-card">
          <h2>📷 The lens</h2>
          <p>
            Photography is about connection. Whether it is a portrait session, styled product
            shots for your crochet shop, or coverage of a special day, we aim for images that
            feel honest and luminous.
          </p>
          <Link to="/photography">See photography services</Link>
        </article>
      </section>

      <section className="section section-alt">
        <blockquote className="about-quote">
          <p>
            &ldquo;I wanted a place where people could buy something made with care — and also
            book someone who understands how to photograph handmade work.&rdquo;
          </p>
          <footer>— Your name here, founder of Boka Studio</footer>
        </blockquote>
      </section>
    </>
  )
}

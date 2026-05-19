import { Link } from 'react-router-dom'

export function Footer() {
  return (
    <footer className="footer">
      <div className="footer-grid">
        <div>
          <p className="footer-brand">Boka Studio</p>
          <p className="footer-tagline">
            Handcrafted crochet &amp; creative photography — one studio, two passions.
          </p>
        </div>
        <div>
          <p className="footer-heading">Explore</p>
          <ul>
            <li>
              <Link to="/boutique">Crochet boutique</Link>
            </li>
            <li>
              <Link to="/photography">Photography</Link>
            </li>
            <li>
              <Link to="/gallery">Gallery</Link>
            </li>
          </ul>
        </div>
        <div>
          <p className="footer-heading">Connect</p>
          <ul>
            <li>
              <a href="mailto:hello@bokastudio.com">hello@bokastudio.com</a>
            </li>
            <li>
              <a href="https://instagram.com" target="_blank" rel="noreferrer">
                Instagram
              </a>
            </li>
            <li>
              <Link to="/contact">Contact form</Link>
            </li>
          </ul>
        </div>
      </div>
      <p className="footer-copy">
        &copy; {new Date().getFullYear()} Boka Studio. Made with yarn &amp; light.
      </p>
    </footer>
  )
}

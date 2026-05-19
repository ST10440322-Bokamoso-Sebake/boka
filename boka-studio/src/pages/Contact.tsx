import { useMemo, useState, type FormEvent } from 'react'
import { useSearchParams } from 'react-router-dom'

type InquiryType = 'boutique' | 'photo' | 'both'

export function Contact() {
  const [searchParams] = useSearchParams()
  const defaultInterest = (searchParams.get('interest') as InquiryType | null) ?? 'both'

  const [submitted, setSubmitted] = useState(false)
  const [form, setForm] = useState({
    name: '',
    email: '',
    interest: defaultInterest,
    message: '',
  })

  const pageTitle = useMemo(() => {
    if (form.interest === 'boutique') return 'Boutique inquiry'
    if (form.interest === 'photo') return 'Photography booking'
    return 'Get in touch'
  }, [form.interest])

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setSubmitted(true)
  }

  return (
    <>
      <section className="page-hero">
        <p className="eyebrow">Contact</p>
        <h1>{pageTitle}</h1>
        <p>
          Orders, custom crochet, photo sessions, or collaborations — send a message and we will
          reply within 1–2 business days.
        </p>
      </section>

      <section className="section contact-section">
        {submitted ? (
          <div className="success-box" role="status">
            <h2>Thank you!</h2>
            <p>Your message has been received. We will be in touch soon.</p>
          </div>
        ) : (
          <form className="contact-form" onSubmit={handleSubmit}>
            <label>
              Name
              <input
                type="text"
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </label>
            <label>
              Email
              <input
                type="email"
                required
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
            </label>
            <label>
              I am interested in
              <select
                value={form.interest}
                onChange={(e) =>
                  setForm({ ...form, interest: e.target.value as InquiryType })
                }
              >
                <option value="boutique">Crochet / boutique</option>
                <option value="photo">Photography</option>
                <option value="both">Both</option>
              </select>
            </label>
            <label>
              Message
              <textarea
                required
                rows={5}
                placeholder="Tell us about the piece you want, or your shoot date, location, and vision…"
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
              />
            </label>
            <button type="submit" className="btn btn-primary">
              Send message
            </button>
          </form>
        )}

        <aside className="contact-aside">
          <h2>Studio details</h2>
          <ul>
            <li>
              <strong>Email</strong>
              <br />
              hello@bokastudio.com
            </li>
            <li>
              <strong>Location</strong>
              <br />
              South Africa — sessions on location or studio by appointment
            </li>
            <li>
              <strong>Instagram</strong>
              <br />
              @bokastudio
            </li>
          </ul>
        </aside>
      </section>
    </>
  )
}

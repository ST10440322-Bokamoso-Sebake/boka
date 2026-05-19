import { useEffect, useMemo, useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import {
  addOnOptions,
  buildLiveSummary,
  defaultBuilder,
  garmentTypes,
  sizes,
  stitchPatterns,
} from '../data/builderOptions'
import { fetchYarnStock } from '../services/yarnService'
import type { YarnColor } from '../data/yarnStock'
import { SketchCanvas } from '../components/builder/SketchCanvas'
import { submitCustomOrder } from '../services/orderService'
import type { BuilderConfig } from '../types/customOrder'

export function DesignYourOwn() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [yarnStock, setYarnStock] = useState<YarnColor[]>([])

  useEffect(() => {
    fetchYarnStock().then((stock) => setYarnStock(stock.filter((y) => y.inStock)))
  }, [])

  const [config, setConfig] = useState<BuilderConfig>({
    ...defaultBuilder,
    addOns: [],
  })
  const [inspirationPreview, setInspirationPreview] = useState<string | null>(null)
  const [sketchDataUrl, setSketchDataUrl] = useState<string | null>(null)
  const [notes, setNotes] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [done, setDone] = useState(false)

  const liveSummary = useMemo(() => buildLiveSummary(config), [config])

  function updateConfig(patch: Partial<BuilderConfig>) {
    setConfig((prev) => ({ ...prev, ...patch }))
  }

  function toggleAddOn(id: string) {
    setConfig((prev) => ({
      ...prev,
      addOns: prev.addOns.includes(id)
        ? prev.addOns.filter((a) => a !== id)
        : [...prev.addOns, id],
    }))
  }

  function handleInspirationFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => setInspirationPreview(reader.result as string)
    reader.readAsDataURL(file)
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!user) return
    setSubmitting(true)
    setError('')
    try {
      await submitCustomOrder({
        customerId: user.id,
        customerEmail: user.email,
        customerName: user.name,
        builder: config,
        liveSummary,
        inspirationImageUrl: inspirationPreview,
        sketchDataUrl,
        customerNotes: notes,
      })
      setDone(true)
      setTimeout(() => navigate('/my-orders'), 2000)
    } catch {
      setError('Could not submit your request. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  if (done) {
    return (
      <section className="section">
        <div className="success-box">
          <h2>Request submitted!</h2>
          <p>We will review your design and send you a quote soon. Redirecting to your orders…</p>
        </div>
      </section>
    )
  }

  return (
    <>
      <section className="page-hero page-hero-yarn">
        <p className="eyebrow">Design your own</p>
        <h1>Build your custom piece</h1>
        <p>Choose every detail — or upload inspiration and sketch your idea. We will quote it for you.</p>
      </section>

      <form className="section design-form" onSubmit={handleSubmit}>
        <aside className="design-preview-sticky">
          <h2>Live order summary</h2>
          <p className="live-summary">{liveSummary}</p>
          <button type="submit" className="btn btn-primary" disabled={submitting}>
            {submitting ? 'Submitting…' : 'Submit custom order request'}
          </button>
          {error && <p className="form-error">{error}</p>}
        </aside>

        <div className="design-steps">
          <fieldset className="design-fieldset">
            <legend>1. Garment type</legend>
            <div className="option-grid">
              {garmentTypes.map((g) => (
                <label key={g.id} className={`option-chip ${config.garmentType === g.id ? 'selected' : ''}`}>
                  <input
                    type="radio"
                    name="garment"
                    value={g.id}
                    checked={config.garmentType === g.id}
                    onChange={() => updateConfig({ garmentType: g.id })}
                  />
                  {g.label}
                </label>
              ))}
            </div>
          </fieldset>

          <fieldset className="design-fieldset">
            <legend>2. Stitch pattern</legend>
            <div className="option-grid">
              {stitchPatterns.map((s) => (
                <label key={s.id} className={`option-chip ${config.stitchPattern === s.id ? 'selected' : ''}`}>
                  <input
                    type="radio"
                    name="stitch"
                    value={s.id}
                    checked={config.stitchPattern === s.id}
                    onChange={() => updateConfig({ stitchPattern: s.id })}
                  />
                  {s.label}
                </label>
              ))}
            </div>
          </fieldset>

          <fieldset className="design-fieldset">
            <legend>3. Yarn colour (in stock)</legend>
            <div className="yarn-swatches">
              {yarnStock.map((y) => (
                <button
                  key={y.id}
                  type="button"
                  className={`yarn-swatch ${config.yarnColorId === y.id ? 'selected' : ''}`}
                  style={{ backgroundColor: y.hex }}
                  title={y.name}
                  onClick={() =>
                    updateConfig({
                      yarnColorId: y.id,
                      yarnColorName: y.name,
                      yarnHex: y.hex,
                    })
                  }
                >
                  <span className="sr-only">{y.name}</span>
                </button>
              ))}
            </div>
            <p className="yarn-label">
              Selected: <strong>{config.yarnColorName}</strong>
            </p>
          </fieldset>

          <fieldset className="design-fieldset">
            <legend>4. Size</legend>
            <div className="option-grid size-grid">
              {sizes.map((s) => (
                <label key={s.id} className={`option-chip ${config.size === s.id ? 'selected' : ''}`}>
                  <input
                    type="radio"
                    name="size"
                    value={s.id}
                    checked={config.size === s.id}
                    onChange={() => updateConfig({ size: s.id })}
                  />
                  {s.label}
                </label>
              ))}
            </div>
            {config.size === 'custom' && (
              <label className="full-width">
                Custom measurements
                <textarea
                  rows={3}
                  placeholder="e.g. bust 90cm, length 65cm, sleeve 58cm…"
                  value={config.customMeasurements}
                  onChange={(e) => updateConfig({ customMeasurements: e.target.value })}
                />
              </label>
            )}
          </fieldset>

          <fieldset className="design-fieldset">
            <legend>5. Add-ons &amp; extras</legend>
            <div className="option-grid">
              {addOnOptions.map((a) => (
                <label key={a.id} className={`option-chip ${config.addOns.includes(a.id) ? 'selected' : ''}`}>
                  <input
                    type="checkbox"
                    checked={config.addOns.includes(a.id)}
                    onChange={() => toggleAddOn(a.id)}
                  />
                  {a.label}
                </label>
              ))}
            </div>
          </fieldset>

          <fieldset className="design-fieldset">
            <legend>6. Upload inspiration</legend>
            <p className="field-hint">Photo, screenshot, or drawing you found — we will match the vibe.</p>
            <input type="file" accept="image/*" onChange={handleInspirationFile} />
            {inspirationPreview && (
              <img src={inspirationPreview} alt="Your inspiration" className="inspiration-preview" />
            )}
            <label className="full-width">
              Notes about your inspiration
              <textarea
                rows={3}
                placeholder="e.g. I want this but in purple and longer sleeves…"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </label>
          </fieldset>

          <fieldset className="design-fieldset">
            <legend>7. Sketch your idea</legend>
            <SketchCanvas onExport={setSketchDataUrl} />
          </fieldset>
        </div>
      </form>

    </>
  )
}

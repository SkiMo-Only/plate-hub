import { useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { catalog } from '../generated/catalog'
import { PreviewFrame } from '../components/PreviewFrame'
import { fileUrl, formatBytes, githubFileUrl, platePcbs, previewFor } from '../lib/catalog'
import { RichText } from '../lib/RichText'

export function PlatePage() {
  const { slug } = useParams()
  const plate = catalog.plates.find((item) => item.slug === slug)
  const [activeIndex, setActiveIndex] = useState(0)

  const variant = plate?.variants[Math.min(activeIndex, (plate?.variants.length ?? 1) - 1)]
  const preview = useMemo(
    () => (plate && variant ? previewFor(plate, variant) : undefined),
    [plate, variant],
  )

  if (!plate || !variant) {
    return (
      <section className="missing">
        <h1>Plate not found</h1>
        <p>That keyboard is not in the catalog.</p>
        <Link to="/" className="text-link">
          Back to catalog
        </Link>
      </section>
    )
  }

  const pcbs = platePcbs(plate)

  return (
    <article className="plate-page">
      <Link to="/" className="back-link">
        ← Catalog
      </Link>

      <header className="plate-header">
        <p className="eyebrow">
          <span className={`family-pill family-${plate.switchFamily.toLowerCase()}`}>{plate.switchFamily}</span>
          <span>{plate.brand}</span>
        </p>
        <h1>{plate.name}</h1>
        <RichText text={plate.description} className="plate-lede" />
        {pcbs.length > 0 ? <p className="pcb-line">Designed for {pcbs.join(' / ')}</p> : null}
        <a className="ghost-link" href={plate.sourceUrl} target="_blank" rel="noreferrer">
          View folder on GitHub
        </a>
      </header>

      <PreviewFrame src={preview} alt={`${variant.name} preview for ${plate.name}`} className="hero-preview" zoomable />

      {plate.variants.length > 1 ? (
        <div className="variant-tabs" role="tablist" aria-label="Plate variants">
          {plate.variants.map((item, index) => (
            <button
              key={item.file}
              type="button"
              role="tab"
              aria-selected={index === activeIndex}
              className={index === activeIndex ? 'tab active' : 'tab'}
              onClick={() => setActiveIndex(index)}
            >
              {item.name}
            </button>
          ))}
        </div>
      ) : null}

      <section className="variant-panel">
        <div className="variant-copy">
          <p className="footer-kicker">Selected variant</p>
          <h2>{variant.name}</h2>
          <dl className="spec-list">
            <div>
              <dt>File</dt>
              <dd>
                <code>{variant.file}</code>
              </dd>
            </div>
            <div>
              <dt>Format</dt>
              <dd>{variant.format.toUpperCase()}</dd>
            </div>
            {variant.switchType ? (
              <div>
                <dt>Switch type</dt>
                <dd>{variant.switchType}</dd>
              </div>
            ) : null}
            {variant.configuration ? (
              <div>
                <dt>Configuration</dt>
                <dd>{variant.configuration}</dd>
              </div>
            ) : null}
            {variant.layout ? (
              <div>
                <dt>Layout</dt>
                <dd>{variant.layout}</dd>
              </div>
            ) : null}
            {variant.pcb ? (
              <div>
                <dt>PCB</dt>
                <dd>{variant.pcb}</dd>
              </div>
            ) : null}
            {variant.halfPlate ? (
              <div>
                <dt>Style</dt>
                <dd>Half plate</dd>
              </div>
            ) : null}
            <div>
              <dt>Size</dt>
              <dd>{formatBytes(variant.sizeBytes)}</dd>
            </div>
          </dl>
        </div>

        <div className="download-stack">
          <a className="download-btn" href={fileUrl(plate, variant.file)} download={variant.file}>
            Download {variant.format.toUpperCase()}
            <span>{formatBytes(variant.sizeBytes)}</span>
          </a>
          <a className="secondary-btn" href={githubFileUrl(plate, variant.file)} target="_blank" rel="noreferrer">
            Open file on GitHub
          </a>
        </div>
      </section>

      {plate.notes ? (
        <section className="prose-block">
          <h2>Notes</h2>
          <RichText text={plate.notes} />
        </section>
      ) : null}

      {plate.credits ? (
        <section className="prose-block">
          <h2>Credits</h2>
          <RichText text={plate.credits} />
        </section>
      ) : null}
    </article>
  )
}

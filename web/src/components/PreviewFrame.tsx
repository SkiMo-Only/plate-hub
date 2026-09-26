import { useState } from 'react'
import { ImageLightbox } from './ImageLightbox'

type PreviewFrameProps = {
  src?: string
  alt: string
  className?: string
  zoomable?: boolean
}

export function PreviewFrame({ src, alt, className, zoomable = false }: PreviewFrameProps) {
  const [open, setOpen] = useState(false)

  return (
    <div className={`preview-frame ${className ?? ''}`.trim()}>
      <span className="tick tick-tl" />
      <span className="tick tick-tr" />
      <span className="tick tick-bl" />
      <span className="tick tick-br" />
      {src ? (
        zoomable ? (
          <button type="button" className="preview-open" onClick={() => setOpen(true)} aria-label={`Open preview: ${alt}`}>
            <img src={src} alt={alt} />
          </button>
        ) : (
          <img src={src} alt={alt} />
        )
      ) : (
        <div className="preview-empty">No preview available</div>
      )}
      {open && src ? <ImageLightbox src={src} alt={alt} onClose={() => setOpen(false)} /> : null}
    </div>
  )
}

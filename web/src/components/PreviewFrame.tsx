type PreviewFrameProps = {
  src?: string
  alt: string
  className?: string
}

export function PreviewFrame({ src, alt, className }: PreviewFrameProps) {
  return (
    <div className={`preview-frame ${className ?? ''}`.trim()}>
      <span className="tick tick-tl" />
      <span className="tick tick-tr" />
      <span className="tick tick-bl" />
      <span className="tick tick-br" />
      {src ? (
        <img src={src} alt={alt} />
      ) : (
        <div className="preview-empty">No preview available</div>
      )}
    </div>
  )
}

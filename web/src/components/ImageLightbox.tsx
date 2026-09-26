import { useEffect, useRef, useState, type PointerEvent as ReactPointerEvent } from 'react'
import { createPortal } from 'react-dom'

type ImageLightboxProps = {
  src: string
  alt: string
  onClose: () => void
}

type View = {
  scale: number
  x: number
  y: number
}

const MIN_SCALE = 1
const MAX_SCALE = 6

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value))
}

export function ImageLightbox({ src, alt, onClose }: ImageLightboxProps) {
  const stageRef = useRef<HTMLDivElement>(null)
  const closeRef = useRef<HTMLButtonElement>(null)
  const [view, setView] = useState<View>({ scale: 1, x: 0, y: 0 })
  const [dragging, setDragging] = useState(false)
  const drag = useRef<{ x: number; y: number; ox: number; oy: number } | null>(null)
  const pointers = useRef(new Map<number, { x: number; y: number }>())
  const pinch = useRef<{ distance: number; scale: number } | null>(null)
  const onCloseRef = useRef(onClose)
  onCloseRef.current = onClose

  useEffect(() => {
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    closeRef.current?.focus()

    function onKey(event: KeyboardEvent) {
      if (event.key === 'Escape') onCloseRef.current()
      if (event.key === '+' || event.key === '=') setView((current) => zoomToward(current, 1.25, 0, 0))
      if (event.key === '-' || event.key === '_') setView((current) => zoomToward(current, 0.8, 0, 0))
      if (event.key === '0') setView({ scale: 1, x: 0, y: 0 })
    }

    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', onKey)
    }
  }, [])

  useEffect(() => {
    const stage = stageRef.current
    if (!stage) return

    function onWheel(event: WheelEvent) {
      event.preventDefault()
      const rect = stage!.getBoundingClientRect()
      const px = event.clientX - rect.left - rect.width / 2
      const py = event.clientY - rect.top - rect.height / 2
      const factor = event.deltaY < 0 ? 1.12 : 1 / 1.12
      setView((current) => zoomToward(current, factor, px, py))
    }

    stage.addEventListener('wheel', onWheel, { passive: false })
    return () => stage.removeEventListener('wheel', onWheel)
  }, [])

  function zoomBy(factor: number) {
    setView((current) => zoomToward(current, factor, 0, 0))
  }

  function onPointerDown(event: ReactPointerEvent<HTMLDivElement>) {
    pointers.current.set(event.pointerId, { x: event.clientX, y: event.clientY })
    event.currentTarget.setPointerCapture(event.pointerId)

    if (pointers.current.size === 2) {
      const [a, b] = [...pointers.current.values()]
      pinch.current = {
        distance: Math.hypot(a.x - b.x, a.y - b.y),
        scale: view.scale,
      }
      drag.current = null
      setDragging(false)
      return
    }

    if (view.scale <= 1) return
    drag.current = { x: event.clientX, y: event.clientY, ox: view.x, oy: view.y }
    setDragging(true)
  }

  function onPointerMove(event: ReactPointerEvent<HTMLDivElement>) {
    if (!pointers.current.has(event.pointerId)) return
    pointers.current.set(event.pointerId, { x: event.clientX, y: event.clientY })

    if (pointers.current.size === 2 && pinch.current) {
      const [a, b] = [...pointers.current.values()]
      const distance = Math.hypot(a.x - b.x, a.y - b.y)
      const next = clamp((pinch.current.scale * distance) / pinch.current.distance, MIN_SCALE, MAX_SCALE)
      setView((current) =>
        next <= 1 ? { scale: 1, x: 0, y: 0 } : { scale: next, x: current.x, y: current.y },
      )
      return
    }

    if (!drag.current) return
    setView({
      scale: view.scale,
      x: drag.current.ox + (event.clientX - drag.current.x),
      y: drag.current.oy + (event.clientY - drag.current.y),
    })
  }

  function onPointerUp(event: ReactPointerEvent<HTMLDivElement>) {
    pointers.current.delete(event.pointerId)
    pinch.current = null
    drag.current = null
    setDragging(false)
  }

  function onDoubleClick() {
    setView((current) => (current.scale > 1 ? { scale: 1, x: 0, y: 0 } : { scale: 2.5, x: 0, y: 0 }))
  }

  const percent = `${Math.round(view.scale * 100)}%`

  return createPortal(
    <div className="lightbox" role="dialog" aria-modal="true" aria-label={alt} onClick={onClose}>
      <div className="lightbox-toolbar" onClick={(event) => event.stopPropagation()}>
        <p className="lightbox-hint">Scroll, pinch, or double-click to zoom. Drag to pan.</p>
        <div className="lightbox-controls">
          <button type="button" onClick={() => zoomBy(1 / 1.25)} aria-label="Zoom out">
            −
          </button>
          <button type="button" onClick={() => setView({ scale: 1, x: 0, y: 0 })} aria-label="Reset zoom">
            {percent}
          </button>
          <button type="button" onClick={() => zoomBy(1.25)} aria-label="Zoom in">
            +
          </button>
          <button ref={closeRef} type="button" className="lightbox-close" onClick={onClose} aria-label="Close preview">
            Close
          </button>
        </div>
      </div>
      <div
        ref={stageRef}
        className={dragging ? 'lightbox-stage is-dragging' : 'lightbox-stage'}
        onClick={(event) => event.stopPropagation()}
        onDoubleClick={onDoubleClick}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
      >
        <img
          src={src}
          alt={alt}
          draggable={false}
          style={{ transform: `translate(${view.x}px, ${view.y}px) scale(${view.scale})` }}
        />
      </div>
    </div>,
    document.body,
  )
}

function zoomToward(current: View, factor: number, px: number, py: number): View {
  const next = clamp(current.scale * factor, MIN_SCALE, MAX_SCALE)
  if (next <= 1) return { scale: 1, x: 0, y: 0 }
  const pointX = (px - current.x) / current.scale
  const pointY = (py - current.y) / current.scale
  return {
    scale: next,
    x: px - pointX * next,
    y: py - pointY * next,
  }
}

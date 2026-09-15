import { Link, useLocation } from 'react-router-dom'
import { catalog } from '../generated/catalog'

export function Header() {
  const location = useLocation()
  const family = new URLSearchParams(location.search).get('family')
  const onCatalog = location.pathname === '/'

  return (
    <header className="site-header">
      <Link to="/" className="brand">
        <span className="brand-mark" aria-hidden="true">
          <svg viewBox="0 0 32 32" width="28" height="28">
            <rect x="3" y="8" width="26" height="16" rx="1.5" fill="none" stroke="currentColor" strokeWidth="1.4" />
            <rect x="6" y="11" width="4" height="4" rx="0.5" />
            <rect x="11.5" y="11" width="4" height="4" rx="0.5" />
            <rect x="17" y="11" width="4" height="4" rx="0.5" />
            <rect x="22.5" y="11" width="3.5" height="4" rx="0.5" />
            <rect x="6" y="17" width="6.5" height="4" rx="0.5" />
            <rect x="13.5" y="17" width="12.5" height="4" rx="0.5" />
          </svg>
        </span>
        <span className="brand-text">
          <span className="brand-name">Plate Hub</span>
          <span className="brand-sub">La-Versa.works</span>
        </span>
      </Link>

      <nav className="site-nav" aria-label="Primary">
        <Link to="/" className={onCatalog && !family ? 'active' : undefined}>
          Catalog
        </Link>
        <Link to="/?family=MX" className={onCatalog && family === 'MX' ? 'active' : undefined}>
          MX
        </Link>
        <Link to="/?family=EC" className={onCatalog && family === 'EC' ? 'active' : undefined}>
          EC
        </Link>
        <a href={catalog.repoUrl} target="_blank" rel="noreferrer">
          GitHub
        </a>
      </nav>
    </header>
  )
}

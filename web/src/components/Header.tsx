import { Link, useLocation } from 'react-router-dom'
import { catalog } from '../generated/catalog'
import logo from '../assets/logo.svg'

export function Header() {
  const location = useLocation()
  const family = new URLSearchParams(location.search).get('family')
  const onCatalog = location.pathname === '/'

  return (
    <header className="site-header">
      <Link to="/" className="brand">
        <span className="brand-mark" aria-hidden="true">
          <img src={logo} alt="" width="36" height="36" />
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

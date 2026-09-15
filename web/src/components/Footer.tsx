import { catalog } from '../generated/catalog'

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-grid">
        <div>
          <p className="footer-kicker">Attribution</p>
          <p>
            Plate files by <strong>La-Versa.works</strong>, unless a plate README says otherwise. Keyboard names
            and trademarks belong to their respective owners.
          </p>
        </div>
        <div>
          <p className="footer-kicker">License</p>
          <p>
            <a href={`${catalog.repoUrl}/blob/main/LICENSE.md`} target="_blank" rel="noreferrer">
              CC BY-NC-SA 4.0
            </a>
            . Personal and other non-commercial manufacturing is allowed. Commercial use needs permission.
          </p>
        </div>
        <div>
          <p className="footer-kicker">Verify before cutting</p>
          <p>
            Files are provided as-is. Check dimensions, tolerances, material thickness, mounting points, and
            compatibility before manufacturing.
          </p>
        </div>
      </div>
    </footer>
  )
}

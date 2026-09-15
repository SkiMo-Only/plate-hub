import { Link } from 'react-router-dom'
import type { Plate } from '../types'
import { padIndex, plateFormats, platePcbs, previewFor } from '../lib/catalog'
import { PreviewFrame } from './PreviewFrame'

type PlateCardProps = {
  plate: Plate
  index: number
  total: number
}

export function PlateCard({ plate, index, total }: PlateCardProps) {
  const preview = previewFor(plate)
  const pcbs = platePcbs(plate)
  const formats = plateFormats(plate)

  return (
    <Link to={`/plate/${plate.slug}`} className="plate-card">
      <PreviewFrame src={preview} alt={`${plate.name} plate preview`} />
      <div className="card-meta">
        <div className="card-top">
          <span className={`family-pill family-${plate.switchFamily.toLowerCase()}`}>{plate.switchFamily}</span>
          <span className="card-index">
            {padIndex(index, total)} / {padIndex(total - 1, total)}
          </span>
        </div>
        <p className="card-brand">{plate.brand}</p>
        <h2 className="card-title">{plate.name}</h2>
        <p className="card-facts">
          {plate.variants.length === 1 ? '1 variant' : `${plate.variants.length} variants`}
          <span aria-hidden="true"> · </span>
          {formats.join(' / ')}
          {pcbs.length > 0 ? (
            <>
              <span aria-hidden="true"> · </span>
              {pcbs.join(', ')}
            </>
          ) : null}
        </p>
      </div>
    </Link>
  )
}

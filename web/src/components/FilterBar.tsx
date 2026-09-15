import type { SwitchFamily } from '../types'

type FilterBarProps = {
  query: string
  family: SwitchFamily | 'all'
  brand: string
  brands: string[]
  resultCount: number
  onQuery: (value: string) => void
  onFamily: (value: SwitchFamily | 'all') => void
  onBrand: (value: string) => void
}

export function FilterBar({
  query,
  family,
  brand,
  brands,
  resultCount,
  onQuery,
  onFamily,
  onBrand,
}: FilterBarProps) {
  return (
    <section className="filter-bar" aria-label="Filter plates">
      <label className="search-field">
        <span className="sr-only">Search plates</span>
        <input
          type="search"
          value={query}
          onChange={(event) => onQuery(event.target.value)}
          placeholder="Search name, brand, PCB, layout…"
        />
      </label>

      <div className="filter-groups">
        <div className="chip-row" role="group" aria-label="Switch family">
          {(['all', 'MX', 'EC'] as const).map((value) => (
            <button
              key={value}
              type="button"
              className={family === value ? 'chip active' : 'chip'}
              onClick={() => onFamily(value)}
            >
              {value === 'all' ? 'All' : value}
            </button>
          ))}
        </div>

        <div className="chip-row wrap" role="group" aria-label="Brand">
          <button type="button" className={brand === 'all' ? 'chip active' : 'chip'} onClick={() => onBrand('all')}>
            All brands
          </button>
          {brands.map((item) => (
            <button
              key={item}
              type="button"
              className={brand === item ? 'chip active' : 'chip'}
              onClick={() => onBrand(item)}
            >
              {item}
            </button>
          ))}
        </div>
      </div>

      <p className="result-count" aria-live="polite">
        {resultCount} {resultCount === 1 ? 'keyboard' : 'keyboards'}
      </p>
    </section>
  )
}

import { useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import { catalog } from '../generated/catalog'
import { FilterBar } from '../components/FilterBar'
import { PlateCard } from '../components/PlateCard'
import { brandsIn, searchPlate } from '../lib/catalog'
import type { SwitchFamily } from '../types'

function isFamily(value: string | null): value is SwitchFamily {
  return value === 'MX' || value === 'EC'
}

export function CatalogPage() {
  const [params, setParams] = useSearchParams()
  const query = params.get('q') ?? ''
  const familyParam = params.get('family')
  const family: SwitchFamily | 'all' = isFamily(familyParam) ? familyParam : 'all'
  const brand = params.get('brand') ?? 'all'
  const brands = useMemo(() => brandsIn(catalog), [])

  const plates = useMemo(() => {
    return catalog.plates.filter((plate) => {
      if (family !== 'all' && plate.switchFamily !== family) return false
      if (brand !== 'all' && plate.brand !== brand) return false
      if (query.trim() && !searchPlate(plate, query)) return false
      return true
    })
  }, [brand, family, query])

  function update(next: Record<string, string | undefined>) {
    const merged = new URLSearchParams(params)
    for (const [key, value] of Object.entries(next)) {
      if (!value || value === 'all') merged.delete(key)
      else merged.set(key, value)
    }
    setParams(merged, { replace: true })
  }

  const variantCount = catalog.plates.reduce((sum, plate) => sum + plate.variants.length, 0)
  const mxCount = catalog.plates.filter((plate) => plate.switchFamily === 'MX').length
  const ecCount = catalog.plates.filter((plate) => plate.switchFamily === 'EC').length

  return (
    <>
      <section className="hero">
        <p className="hero-kicker">LA-VERSA.WORKS PLATE ARCHIVE</p>
        <h1>Keyboard plates for <em>MX</em> and <em>EC</em> systems.
        </h1>
        <p className="hero-lead">Browse and download plate files.</p>
        <dl className="hero-stats">
          <div>
            <dt>Keyboards</dt>
            <dd>{catalog.plates.length}</dd>
          </div>
          <div>
            <dt>Variants</dt>
            <dd>{variantCount}</dd>
          </div>
          <div>
            <dt>MX / EC</dt>
            <dd>
              {mxCount} / {ecCount}
            </dd>
          </div>
        </dl>
      </section>

      <FilterBar
        query={query}
        family={family}
        brand={brand}
        brands={brands}
        resultCount={plates.length}
        onQuery={(value) => update({ q: value || undefined })}
        onFamily={(value) => update({ family: value })}
        onBrand={(value) => update({ brand: value })}
      />

      {plates.length === 0 ? (
        <p className="empty-state">No plates match those filters. Clear search or choose another family.</p>
      ) : (
        <div className="plate-grid">
          {plates.map((plate, index) => (
            <PlateCard key={plate.id} plate={plate} index={index} total={plates.length} />
          ))}
        </div>
      )}
    </>
  )
}

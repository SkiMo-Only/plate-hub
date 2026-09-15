import type { Catalog, Plate, PlateVariant } from '../types'

export function fileUrl(plate: Plate, filename: string): string {
  return `./files/${plate.folder}/${filename}`
}

export function githubFileUrl(plate: Plate, filename: string): string {
  return `${plate.sourceUrl.replace('/tree/', '/blob/')}/${filename}`
}

export function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(bytes < 10 * 1024 ? 1 : 0)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

export function unique<T>(values: T[]): T[] {
  return [...new Set(values)]
}

export function platePcbs(plate: Plate): string[] {
  return unique(plate.variants.map((variant) => variant.pcb).filter((value): value is string => Boolean(value)))
}

export function plateFormats(plate: Plate): string[] {
  return unique(plate.variants.map((variant) => variant.format.toUpperCase()))
}

export function previewFor(plate: Plate, variant?: PlateVariant): string | undefined {
  const chosen = variant ?? plate.variants.find((item) => item.preview) ?? plate.variants[0]
  return chosen?.preview ? fileUrl(plate, chosen.preview) : undefined
}

export function searchPlate(plate: Plate, query: string): boolean {
  const haystack = [
    plate.name,
    plate.brand,
    plate.switchFamily,
    plate.description,
    plate.notes,
    ...plate.variants.flatMap((variant) => [
      variant.name,
      variant.file,
      variant.configuration,
      variant.pcb,
      variant.layout,
    ]),
  ]
    .filter(Boolean)
    .join(' ')
    .toLowerCase()

  return query
    .toLowerCase()
    .split(/\s+/)
    .filter(Boolean)
    .every((token) => haystack.includes(token))
}

export function brandsIn(catalog: Catalog): string[] {
  return unique(catalog.plates.map((plate) => plate.brand)).sort((a, b) => a.localeCompare(b))
}

export function padIndex(index: number, total: number): string {
  const width = String(total).length
  return String(index + 1).padStart(width, '0')
}

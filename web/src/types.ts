export type SwitchFamily = 'MX' | 'EC'

export type PlateVariant = {
  name: string
  file: string
  format: string
  preview?: string
  switchType: string
  configuration?: string
  pcb?: string
  layout?: string
  halfPlate: boolean
  sizeBytes: number
}

export type Plate = {
  id: string
  slug: string
  name: string
  brand: string
  switchFamily: SwitchFamily
  folder: string
  description: string
  notes: string
  credits: string
  sourceUrl: string
  variants: PlateVariant[]
}

export type Catalog = {
  generatedAt: string
  repoUrl: string
  plates: Plate[]
}

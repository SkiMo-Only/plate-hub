import fs from 'node:fs'
import path from 'node:path'
import type { Catalog, Plate, PlateVariant, SwitchFamily } from '../src/types.ts'

const REPO_URL = 'https://github.com/SkiMo-Only/plate-hub'
const FAMILIES: SwitchFamily[] = ['MX', 'EC']

function extractSection(markdown: string, heading: string): string {
  const start = markdown.search(new RegExp(`^## ${escapeRegExp(heading)}\\s*$`, 'im'))
  if (start < 0) return ''
  const afterHeading = markdown.slice(start).replace(/^## .+\n/, '')
  const next = afterHeading.search(/^## /m)
  return (next < 0 ? afterHeading : afterHeading.slice(0, next)).trim()
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

function firstParagraph(markdown: string): string {
  const withoutTitle = markdown.replace(/^# .+\n+/, '')
  const beforeSection = withoutTitle.split(/^## /m)[0]?.trim() ?? ''
  return beforeSection.split(/\n{2,}/)[0]?.trim() ?? ''
}

function parsePreviewMap(section: string): Record<string, string> {
  const map: Record<string, string> = {}
  for (const block of section.split(/^### /m).slice(1)) {
    const [rawName, ...rest] = block.split('\n')
    const name = rawName?.trim()
    const image = rest.join('\n').match(/!\[[^\]]*]\(\.\/([^)]+)\)/)?.[1]
    if (name && image) map[name] = image
  }
  return map
}

function parseBullet(body: string, label: string): string | undefined {
  const match = body.match(new RegExp(`^-\\s*${escapeRegExp(label)}:\\s*(.+)$`, 'im'))
  return match?.[1]?.replace(/\*\*/g, '').trim()
}

function parseVariants(
  section: string,
  previews: Record<string, string>,
  dir: string,
  files: string[],
): PlateVariant[] {
  return section
    .split(/^### /m)
    .slice(1)
    .map((block) => {
      const [rawName, ...rest] = block.split('\n')
      const name = rawName?.trim() ?? 'Plate'
      const body = rest.join('\n')
      const file = body.match(/\[`([^`]+)`]/)?.[1]
      if (!file) return null

      const stem = file.replace(/\.[^.]+$/, '')
      const previewFromHeading = previews[name]
      const previewFromFile = files.find((entry) => entry === `${stem}.png`)
      const preview = previewFromHeading ?? previewFromFile
      const stats = fs.statSync(path.join(dir, file))

      const variant: PlateVariant = {
        name,
        file,
        format: path.extname(file).slice(1).toLowerCase(),
        preview,
        switchType: parseBullet(body, 'Switch type') ?? '',
        configuration: parseBullet(body, 'Configuration'),
        pcb: parseBullet(body, 'PCB'),
        layout: parseBullet(body, 'Layout'),
        halfPlate: /half-plate/i.test(body) || /half plate/i.test(name),
        sizeBytes: stats.size,
      }

      return variant
    })
    .filter((variant): variant is PlateVariant => variant !== null)
}

function slugify(family: SwitchFamily, brand: string, keyboard: string): string {
  return `${family}-${brand}-${keyboard}`
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

function scanFamily(repoRoot: string, family: SwitchFamily): Plate[] {
  const familyDir = path.join(repoRoot, family)
  if (!fs.existsSync(familyDir)) return []

  const plates: Plate[] = []

  for (const brand of fs.readdirSync(familyDir).sort()) {
    const brandDir = path.join(familyDir, brand)
    if (!fs.statSync(brandDir).isDirectory()) continue

    for (const keyboard of fs.readdirSync(brandDir).sort()) {
      const dir = path.join(brandDir, keyboard)
      if (!fs.statSync(dir).isDirectory()) continue

      const readmePath = path.join(dir, 'README.md')
      if (!fs.existsSync(readmePath)) continue

      const markdown = fs.readFileSync(readmePath, 'utf8')
      const files = fs.readdirSync(dir)
      const folder = `${family}/${brand}/${keyboard}`
      const title = markdown.match(/^#\s+(.+)$/m)?.[1]?.trim() ?? keyboard.replace(/-/g, ' ')
      const variants = parseVariants(
        extractSection(markdown, 'Variants'),
        parsePreviewMap(extractSection(markdown, 'Preview')),
        dir,
        files,
      )

      if (variants.length === 0) continue

      plates.push({
        id: folder.toLowerCase(),
        slug: slugify(family, brand, keyboard),
        name: title,
        brand,
        switchFamily: family,
        folder,
        description: firstParagraph(markdown),
        notes: extractSection(markdown, 'Notes'),
        credits: extractSection(markdown, 'Credits'),
        sourceUrl: `${REPO_URL}/tree/main/${folder}`,
        variants,
      })
    }
  }

  return plates
}

export function scanPlates(repoRoot: string): Catalog {
  const plates = FAMILIES.flatMap((family) => scanFamily(repoRoot, family))

  return {
    generatedAt: new Date().toISOString(),
    repoUrl: REPO_URL,
    plates,
  }
}

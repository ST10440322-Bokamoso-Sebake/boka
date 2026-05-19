export const garmentTypes = [
  { id: 'top', label: 'Top / Crop top' },
  { id: 'cardigan', label: 'Cardigan' },
  { id: 'sweater', label: 'Sweater / Jumper' },
  { id: 'vest', label: 'Vest' },
  { id: 'bag', label: 'Bag / Tote' },
  { id: 'beanie', label: 'Beanie / Hat' },
  { id: 'scarf', label: 'Scarf' },
  { id: 'blanket', label: 'Blanket / Throw' },
  { id: 'skirt', label: 'Skirt' },
  { id: 'other', label: 'Other (describe in notes)' },
] as const

export const stitchPatterns = [
  { id: 'basic', label: 'Basic single crochet' },
  { id: 'granny', label: 'Granny square' },
  { id: 'ribbed', label: 'Ribbed' },
  { id: 'shell', label: 'Shell stitch' },
  { id: 'cable', label: 'Cable' },
  { id: 'lace', label: 'Open lace' },
  { id: 'bobble', label: 'Bobble / popcorn' },
  { id: 'mixed', label: 'Mixed / let me decide' },
] as const

export const sizes = [
  { id: 'xs', label: 'XS' },
  { id: 's', label: 'S' },
  { id: 'm', label: 'M' },
  { id: 'l', label: 'L' },
  { id: 'xl', label: 'XL' },
  { id: '2xl', label: '2XL' },
  { id: '3xl', label: '3XL' },
  { id: 'custom', label: 'Custom measurements' },
] as const

export const addOnOptions = [
  { id: 'buttons', label: 'Buttons' },
  { id: 'tassels', label: 'Tassels' },
  { id: 'pockets', label: 'Pockets' },
  { id: 'fringe', label: 'Fringe' },
  { id: 'lining', label: 'Lined interior' },
  { id: 'hood', label: 'Hood' },
  { id: 'belt', label: 'Matching belt' },
  { id: 'embroidery', label: 'Embroidery detail' },
] as const

export const defaultBuilder = {
  garmentType: 'cardigan',
  stitchPattern: 'granny',
  yarnColorId: 'lavender',
  yarnColorName: 'Lavender Dream',
  yarnHex: '#9B59B6',
  size: 'm',
  customMeasurements: '',
  addOns: [] as string[],
}

export function buildLiveSummary(config: typeof defaultBuilder): string {
  const garment = garmentTypes.find((g) => g.id === config.garmentType)?.label ?? config.garmentType
  const stitch = stitchPatterns.find((s) => s.id === config.stitchPattern)?.label ?? config.stitchPattern
  const size =
    config.size === 'custom'
      ? `Custom (${config.customMeasurements || 'measurements to follow'})`
      : (sizes.find((s) => s.id === config.size)?.label ?? config.size)
  const addOns =
    config.addOns.length > 0
      ? config.addOns
          .map((id) => addOnOptions.find((a) => a.id === id)?.label ?? id)
          .join(', ')
      : 'None'

  return [
    `Custom ${garment}`,
    `Stitch: ${stitch}`,
    `Yarn: ${config.yarnColorName} (${config.yarnHex})`,
    `Size: ${size}`,
    `Add-ons: ${addOns}`,
  ].join(' · ')
}

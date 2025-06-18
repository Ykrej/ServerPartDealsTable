const PAGE_SIZE = 70
export enum ServerPartsCollection {
  SOLID_STATE_DRIVES = 167154483242,
  HARD_DRIVES = 167154516010,
}

const collectionSlugMap = new Map<ServerPartsCollection, string>([
  [ServerPartsCollection.HARD_DRIVES, 'hard-drives'],
  [ServerPartsCollection.SOLID_STATE_DRIVES, 'solid-state-drives'],
])

export type ServerPartsRecord = {
  brand: string
  series: string
  sku: string
  capacityGb: number
  condition: string
  formFactor: string
  interface: string
  interfaceSpeedGbPerSecond: number
  type: string
  warrantyDays: number
  priceUsd: number
  link: string
}

export async function getServerPartsRecords(collection: ServerPartsCollection) {
  const rawRecords = await fetchServerPartsData(collection)
  return rawRecords
    .map((raw) => {
      const tagMap = new Map<string, string>(
        raw.tags.map((tag: string) => {
          const delimiterIndex = tag.indexOf(':')
          return [
            tag.substring(0, delimiterIndex).trim(),
            tag.substring(delimiterIndex + 1).trim(),
          ]
        })
      )

      const priceUsd = raw.price_max || raw.price_min
      if (!priceUsd || !Number.isFinite(priceUsd)) return undefined

      const brand = tagMap.get('brand')
      if (!brand || typeof brand !== 'string') return undefined

      const series = tagMap.get('series')
      if (!series) return undefined

      const formFactor = tagMap.get('formFactor')
      if (!formFactor) return undefined

      const _type = tagMap.get('type')
      if (!_type) return undefined

      const condition = tagMap.get('condition')
      if (!condition) return undefined

      const _interface = tagMap.get('interface')
      if (!_interface) return undefined

      const rawSkus = raw.skus
      if (!rawSkus || !Array.isArray(rawSkus)) return undefined
      const sku = rawSkus.join("/")

      const collectionSlug = collectionSlugMap.get(collection)
      if (collectionSlug === undefined) return undefined

      const recordSlug = raw.handle
      if (!recordSlug || typeof recordSlug !== 'string') return undefined
      const link = `https://serverpartdeals.com/collections/${collectionSlug}/products/${recordSlug}`

      const rawInterfaceSpeed = tagMap.get('interfaceSpeed')
      if (!rawInterfaceSpeed) return undefined

      const interfaceSpeedGbPerSecond =
        parseInterfaceSpeedGbPerSecond(rawInterfaceSpeed)
      if (interfaceSpeedGbPerSecond === undefined) return undefined

      const capacityRaw = tagMap.get('capacity')
      if (!capacityRaw) return undefined

      const capacityGb = parseCapacityGb(capacityRaw)
      if (!capacityGb) return undefined

      const warrantyRaw = tagMap.get('warranty')
      if (!warrantyRaw) return undefined

      const warrantyDays = parseWarrantyDays(warrantyRaw)
      if (warrantyDays === undefined) return undefined

      const record: ServerPartsRecord = {
        brand,
        series,
        sku,
        capacityGb,
        formFactor,
        interfaceSpeedGbPerSecond,
        interface: _interface,
        type: _type,
        warrantyDays,
        priceUsd,
        condition,
        link,
      }

      return record
    })
    .filter((r) => r !== undefined)
}

function parseCapacityGb(capacity: string): number | undefined {
  const units = capacity.substring(capacity.length - 2, capacity.length)
  const value = parseFloat(capacity.substring(0, capacity.length - 2))

  switch (units) {
    case 'TB':
      return value * 1000
    case 'GB':
      return value
    default:
      return undefined
  }
}

function parseInterfaceSpeedGbPerSecond(
  interfaceSpeed: string
): number | undefined {
  if (!interfaceSpeed.toLowerCase().endsWith('gb/s')) return undefined

  const gbPerSecond = parseFloat(
    interfaceSpeed.substring(0, interfaceSpeed.length - 4)
  )
  if (!Number.isFinite(gbPerSecond)) return undefined

  return gbPerSecond
}

function parseWarrantyDays(warranty: string): number | undefined {
  const _warranty = warranty.trim().toLowerCase()

  const value = parseInt(_warranty.substring(0, _warranty.indexOf(' ')))
  if (_warranty.includes('day')) return value
  if (_warranty.includes('year')) return value * 365

  return undefined
}

async function fetchServerPartsData(collection: ServerPartsCollection) {
  const fetchResult = await fetchServerPartsPage(collection, 1)
  const { content } = fetchResult
  let records = fetchResult.records

  const remainingPages = Math.ceil(
    (content.total_product - (content.total_product % PAGE_SIZE)) / PAGE_SIZE
  )
  await Promise.all(
    Array.from({ length: remainingPages }, (_, i) => i + 2).map(
      async (page) => {
        const res = await fetchServerPartsPage(collection, page)
        records = records.concat(res.records)
      }
    )
  )

  return records
}

async function fetchServerPartsPage(
  collection: ServerPartsCollection,
  page: number
) {
  const params = new URLSearchParams()
  params.set('shop', 'usatechrepair.myshopify.com')
  params.set('collection_scope', `${collection}`)
  params.set('page', `${page}`)
  params.set('limit', `${PAGE_SIZE}`)
  params.set('product_available', `${false}`)
  params.set('variant_available', `${false}`)
  params.set('zero_options', `${true}`)
  params.set('build_filter_tree', `${true}`)

  const response = await fetch(
    `https://services.mybcapps.com/bc-sf-filter/filter?${params}`
  )
  if (!response.ok) throw new Error('Failed to fetch serverpartdeals data')

  const content = await response.json()
  if (!content.products) throw new Error('No products key in response')

  const records = content.products
  if (!Array.isArray(records)) throw new Error('products is not an Array')

  return { content, records }
}

import type { PageLoad } from "./$types";

export const load: PageLoad = async ({ params }) => {
  return {
    serverPartsData: await getServerPartsRecords(),
  };
};

const url =
  "https://services.mybcapps.com/bc-sf-filter/filter?shop=usatechrepair.myshopify.com&product_available=true";


interface ServerPartsRecord {
  brand: string
  series: string
  sku: string
  capacityGb: number
  condition: string
  formFactor: string
  interface: string
  interfaceSpeed: string
  type: string
  warrantyDays: number
  priceUsd: number
}

async function getServerPartsRecords() {
  const rawRecords = await fetchServerPartsData()
  return rawRecords.map(raw => {
    const tagMap = new Map(raw.tags.map((tag: string) => {
      const delimiterIndex = tag.indexOf(":")
      return [
        tag.substring(0, delimiterIndex).trim(),
        tag.substring(delimiterIndex + 1).trim()
      ]
    }))
    return {
      brand: tagMap.get("brand"),
      series: tagMap.get("series"),
      sku: raw.skus[0],
      capacityGb: tagMap.get("capacity"),
      formFactor: tagMap.get("formFactor"),
      interface: tagMap.get("interface"),
      interfaceSpeed: tagMap.get("interfaceSpeed"),
      type: tagMap.get("type"),
      warrantyDays: tagMap.get("warranty"),
      priceUsd: raw.price_max || raw.price_min,
    } as ServerPartsRecord
  })
}

async function fetchServerPartsData() {
  console.log(`Fetching ${url}`)
  const response = await fetch(url);
  if (!response.ok)
    throw new Error("Failed to fetch serverpartdeals data");

  const content = await response.json();
  if (!content.products)
    throw new Error("No products key in response")

  const data = content.products
  if (!Array.isArray(data))
    throw new Error("products is not an Array")
  return data
}

import type { PageLoad } from "./$types";

export const load: PageLoad = async () => {
  return {
    serverPartsData: await getServerPartsRecords(
      ServerPartsCollection.HARD_DRIVES,
    ),
  };
};

const PAGE_SIZE = 70;
enum ServerPartsCollection {
  SOLID_STATE_DRIVES = 167154483242,
  HARD_DRIVES = 167154516010,
}

export type ServerPartsRecord = {
  available: boolean;
  brand: string;
  series: string;
  sku: string;
  capacityGb: number;
  condition: string;
  formFactor: string;
  interface: string;
  interfaceSpeed: string;
  type: string;
  warrantyDays: number;
  priceUsd: number;
};

async function getServerPartsRecords(collection: ServerPartsCollection) {
  const rawRecords = await fetchServerPartsData(collection);
  console.log(JSON.stringify(rawRecords));
  return rawRecords.map((raw) => {
    const tagMap = new Map<string, string>(
      raw.tags.map((tag: string) => {
        const delimiterIndex = tag.indexOf(":");
        return [
          tag.substring(0, delimiterIndex).trim(),
          tag.substring(delimiterIndex + 1).trim(),
        ];
      }),
    );
    return {
      brand: tagMap.get("brand"),
      series: tagMap.get("series"),
      sku: raw.skus,
      capacityGb: parseCapacityGb(tagMap.get("capacity")),
      formFactor: tagMap.get("formFactor"),
      interface: tagMap.get("interface"),
      interfaceSpeed: tagMap.get("interfaceSpeed"),
      type: tagMap.get("type"),
      warrantyDays: tagMap.get("warranty"),
      priceUsd: raw.price_max || raw.price_min,
      condition: tagMap.get("condition"),
      available: raw.available,
    } as ServerPartsRecord;
  });
}

function parseCapacityGb(capacity: string): number {
  const units = capacity.substring(capacity.length - 2, capacity.length);
  const value = parseFloat(capacity.substring(0, capacity.length - 2));

  switch (units) {
    case "TB":
      return value * 1000;
    case "GB":
      return value;
    default:
      throw new Error("Unsupported units", { cause: { units } });
  }
}

async function fetchServerPartsData(collection: ServerPartsCollection) {
  const fetchResult = await fetchServerPartsPage(collection, 1);
  const { content } = fetchResult;
  let records = fetchResult.records;

  const remainingPages = Math.ceil(
    (content.total_product - (content.total_product % PAGE_SIZE)) / PAGE_SIZE,
  );
  await Promise.all(
    Array.from({ length: remainingPages }, (_, i) => i + 2).map(
      async (page) => {
        const res = await fetchServerPartsPage(collection, page);
        records = records.concat(res.records);
      },
    ),
  );

  return records;
}

async function fetchServerPartsPage(
  collection: ServerPartsCollection,
  page: number,
) {
  const params = new URLSearchParams();
  params.set("shop", "usatechrepair.myshopify.com");
  params.set("collection_scope", `${collection}`);
  params.set("page", `${page}`);
  params.set("limit", `${PAGE_SIZE}`);
  params.set("product_available", `${false}`);
  params.set("variant_available", `${false}`);
  params.set("zero_options", `${true}`);
  params.set("build_filter_tree", `${true}`);

  const url = `https://services.mybcapps.com/bc-sf-filter/filter?${params}`;
  console.log(`Fetching ${url}`);

  const response = await fetch(url, { method: "GET" });

  if (!response.ok) throw new Error("Failed to fetch serverpartdeals data");

  const content = await response.json();
  if (!content.products) throw new Error("No products key in response");

  const records = content.products;
  if (!Array.isArray(records)) throw new Error("products is not an Array");

  return { content, records };
}

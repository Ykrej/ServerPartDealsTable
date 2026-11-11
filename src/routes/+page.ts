import {
  getServerPartsRecords,
  ServerPartsCollection,
  type ServerPartsRecord,
} from '../clientLib/serverPartDeals'
import type { PageLoad } from './$types'

export const load: PageLoad = async () => {
  const serverPartsData = (
    await Promise.all([
      safeGetServerPartsRecords(ServerPartsCollection.HARD_DRIVES),
      safeGetServerPartsRecords(ServerPartsCollection.SOLID_STATE_DRIVES),
    ])
  ).flatMap((record) => record)
  return {
    serverPartsData,
  }
}

async function safeGetServerPartsRecords(collection: ServerPartsCollection): Promise<ServerPartsRecord[]> {
  try {
    return await getServerPartsRecords(collection)
  } catch {
    console.error(`failed to fetch server parts collection: ${collection}`)
  }
  return []
}

import {
  getServerPartsRecords,
  ServerPartsCollection,
} from '../clientLib/serverPartDeals'
import type { PageLoad } from './$types'

export const load: PageLoad = async () => {
  const serverPartsData = (
    await Promise.all([
      getServerPartsRecords(ServerPartsCollection.HARD_DRIVES),
      getServerPartsRecords(ServerPartsCollection.SOLID_STATE_DRIVES),
    ])
  ).flatMap((record) => record)
  return {
    serverPartsData,
  }
}

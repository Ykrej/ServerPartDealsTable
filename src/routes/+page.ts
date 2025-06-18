import {
  getServerPartsRecords,
  ServerPartsCollection,
} from '../clientLib/serverPartDeals'
import type { PageLoad } from './$types'

export const load: PageLoad = async () => {
  return {
    serverPartsData: await getServerPartsRecords(
      ServerPartsCollection.HARD_DRIVES
    ),
  }
}

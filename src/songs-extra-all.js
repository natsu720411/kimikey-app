import { EXTRA_SONGS as BASE_EXTRA_SONGS } from '/src/songs-extra.js'
import { CATALOG_500_SONGS } from './songs-catalog-500.js'

export const EXTRA_SONGS = [
  ...BASE_EXTRA_SONGS,
  ...CATALOG_500_SONGS,
]

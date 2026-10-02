import { EXTRA_SONGS as BASE_EXTRA_SONGS } from '/src/songs-extra.js'
import { CATALOG_500_SONGS } from './songs-catalog-500.js'

const catalogSongsWithStableIds =
  CATALOG_500_SONGS.map(
    (song, index) => ({
      ...song,
      id: 10000 + index,
    })
  )

export const EXTRA_SONGS = [
  ...BASE_EXTRA_SONGS,
  ...catalogSongsWithStableIds,
]

import { SONGS } from '../src/songs.js'

console.log(
  `🎵 現在の曲数：${SONGS.length}曲`
)


// ==========================================
// ID重複
// ==========================================

const idMap =
  new Map()

for (const song of SONGS) {

  if (!idMap.has(song.id)) {
    idMap.set(
      song.id,
      []
    )
  }

  idMap
    .get(song.id)
    .push(song)
}


const duplicateIds =
  [...idMap.entries()]
    .filter(
      ([, songs]) =>
        songs.length > 1
    )


if (
  duplicateIds.length > 0
) {

  console.log(
    '\n❌ ID重複があります'
  )

  duplicateIds.forEach(
    ([id, songs]) => {

      console.log(
        `ID ${id}`
      )

      songs.forEach(
        song => {

          console.log(
            `  ${song.artist} - ${song.title}`
          )

        }
      )
    }
  )

} else {

  console.log(
    '✅ ID重複なし'
  )

}


// ==========================================
// 同じ曲＋同じアーティスト
// ==========================================

const songKeyMap =
  new Map()


for (const song of SONGS) {

  const key =
    `${song.artist}|||${song.title}`

      .toLowerCase()
      .trim()


  if (
    !songKeyMap.has(key)
  ) {

    songKeyMap.set(
      key,
      []
    )
  }


  songKeyMap
    .get(key)
    .push(song)

}


const duplicates =
  [...songKeyMap.values()]
    .filter(
      songs =>
        songs.length > 1
    )


if (
  duplicates.length > 0
) {

  console.log(
    '\n⚠️ 同じ曲が重複しています'
  )


  duplicates.forEach(
    songs => {

      songs.forEach(
        song => {

          console.log(
            `  ID ${song.id}：${song.artist} - ${song.title}`
          )

        }
      )


      console.log('---')

    }
  )

} else {

  console.log(
    '✅ 曲名＋アーティスト重複なし'
  )

}


// ==========================================
// 音域異常チェック
// ==========================================

const invalidSongs =
  SONGS.filter(
    song =>
      !Number.isFinite(
        song.lowMidi
      ) ||
      !Number.isFinite(
        song.highMidi
      ) ||
      song.highMidi <
        song.lowMidi
  )


if (
  invalidSongs.length > 0
) {

  console.log(
    '\n❌ 音域データ異常'
  )

  invalidSongs.forEach(
    song => {

      console.log(
        `${song.artist} - ${song.title}`
      )

    }
  )

} else {

  console.log(
    '✅ 音域データ異常なし'
  )

}


// ==========================================
// 最後
// ==========================================

console.log(
  '\n--------------------'
)

console.log(
  `現在 ${SONGS.length}曲`
)

console.log(
  `300曲まであと ${Math.max(
    0,
    300 - SONGS.length
  )}曲`
)

console.log(
  `500曲まであと ${Math.max(
    0,
    500 - SONGS.length
  )}曲`
)
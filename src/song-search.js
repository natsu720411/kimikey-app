export function initSongSearch({
  songs,
  onSongSelected
}) {
  const container =
    document.querySelector(
      '#songSearchResults'
    )

  const input =
    document.querySelector(
      '#songSearch'
    )


  function createSongButton(song) {
    const item =
      document.createElement(
        'button'
      )

    item.className =
      'search-song-item'

    item.innerHTML = `
      <div>
        <strong>${song.title}</strong>
        <span>${song.artist}</span>
      </div>

      <span class="search-arrow">
        ›
      </span>
    `

    item.addEventListener(
      'click',
      () => {
        onSongSelected(song)
      }
    )

    return item
  }


  function createArtistButton(
    artist,
    backMode = 'search'
  ) {
    const artistSongs =
      songs.filter(
        song =>
          song.artist === artist
      )

    const item =
      document.createElement(
        'button'
      )

    item.className =
      'search-song-item'

    item.innerHTML = `
      <div>
        <strong>
          🎤 ${artist}
        </strong>

        <span>
          ${artistSongs.length}曲
        </span>
      </div>

      <span class="search-arrow">
        ›
      </span>
    `

    item.addEventListener(
      'click',
      () => {
        renderArtistSongs(
          artist,
          backMode
        )
      }
    )

    return item
  }


  function renderArtistSongs(
    artist,
    backMode = 'search'
  ) {
    container.innerHTML = ''

    const artistSongs =
      songs.filter(
        song =>
          song.artist === artist
      )


    const backButton =
      document.createElement(
        'button'
      )

    backButton.className =
      'search-song-item'

    backButton.innerHTML = `
      <div>
        <strong>
          ← 戻る
        </strong>

        <span>
          ${artist}
        </span>
      </div>
    `

    backButton.addEventListener(
      'click',
      () => {
        if (
          backMode ===
          'artists'
        ) {
          renderArtistList()
        } else {
          renderSearchResults(
            input.value
          )
        }
      }
    )

    container.appendChild(
      backButton
    )


    const heading =
      document.createElement(
        'div'
      )

    heading.className =
      'no-song'

    heading.textContent =
      `🎤 ${artist} の曲一覧（${artistSongs.length}曲）`

    container.appendChild(
      heading
    )


    artistSongs.forEach(
      song => {
        container.appendChild(
          createSongButton(song)
        )
      }
    )
  }


  function renderArtistList() {
    container.innerHTML = ''

    const backButton =
      document.createElement(
        'button'
      )

    backButton.className =
      'search-song-item'

    backButton.innerHTML = `
      <div>
        <strong>
          ← 曲検索に戻る
        </strong>

        <span>
          アーティスト一覧
        </span>
      </div>
    `

    backButton.addEventListener(
      'click',
      () => {
        renderSearchResults(
          input.value
        )
      }
    )

    container.appendChild(
      backButton
    )


    const heading =
      document.createElement(
        'div'
      )

    heading.className =
      'no-song'

    heading.textContent =
      '🎤 アーティスト一覧'

    container.appendChild(
      heading
    )


    const artists =
      [
        ...new Set(
          songs.map(
            song => song.artist
          )
        )
      ]
        .sort(
          (a, b) =>
            a.localeCompare(
              b,
              'ja'
            )
        )


    artists.forEach(
      artist => {
        container.appendChild(
          createArtistButton(
            artist,
            'artists'
          )
        )
      }
    )
  }


  function renderBrowseButton() {
    container.innerHTML = ''

    const item =
      document.createElement(
        'button'
      )

    item.className =
      'search-song-item'

    item.innerHTML = `
      <div>
        <strong>
          🎤 アーティストから探す
        </strong>

        <span>
          アーティスト一覧を見る
        </span>
      </div>

      <span class="search-arrow">
        ›
      </span>
    `

    item.addEventListener(
      'click',
      () => {
        renderArtistList()
      }
    )

    container.appendChild(
      item
    )
  }


  function renderSearchResults(
    searchText = ''
  ) {
    container.innerHTML = ''

    const query =
      searchText
        .trim()
        .toLowerCase()


    if (!query) {
      renderBrowseButton()
      return
    }


    const artists =
      [
        ...new Set(
          songs.map(
            song => song.artist
          )
        )
      ]


    const artistResults =
      artists
        .filter(
          artist =>
            artist
              .toLowerCase()
              .includes(query)
        )
        .sort(
          (a, b) =>
            a.localeCompare(
              b,
              'ja'
            )
        )


    const songResults =
      songs.filter(
        song =>
          song.title
            .toLowerCase()
            .includes(query)
      )


    if (
      artistResults.length === 0 &&
      songResults.length === 0
    ) {
      container.innerHTML = `
        <div class="no-song">
          曲またはアーティストが見つかりません
        </div>
      `

      return
    }


    artistResults.forEach(
      artist => {
        container.appendChild(
          createArtistButton(
            artist,
            'search'
          )
        )
      }
    )


    songResults.forEach(
      song => {
        container.appendChild(
          createSongButton(song)
        )
      }
    )
  }


  input.addEventListener(
    'input',
    event => {
      renderSearchResults(
        event.target.value
      )
    }
  )


  return renderSearchResults
}

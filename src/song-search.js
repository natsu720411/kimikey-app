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

  let artistListQuery = ''


  function hasRangeData(song) {
    return (
      Number.isFinite(song.minMidi) &&
      Number.isFinite(song.maxMidi)
    )
  }


  function normalizeSearchText(
    value = ''
  ) {
    return String(value)
      .normalize('NFKC')
      .toLowerCase()
      .replace(
        /[\s・･._\-‐‑–—'’"“”!?！？。、「」()（）&＆+＋]/g,
        ''
      )
  }


  function matchesSearch(
    value,
    searchText = ''
  ) {
    const normalizedValue =
      normalizeSearchText(value)

    const tokens =
      String(searchText)
        .normalize('NFKC')
        .toLowerCase()
        .split(/\s+/)
        .map(normalizeSearchText)
        .filter(Boolean)

    if (tokens.length === 0) {
      return true
    }

    return tokens.every(
      token =>
        normalizedValue.includes(token)
    )
  }


  function sortSongsForDisplay(
    songList
  ) {
    return [...songList].sort(
      (a, b) => {
        const rangeDifference =
          Number(hasRangeData(b)) -
          Number(hasRangeData(a))

        if (rangeDifference !== 0) {
          return rangeDifference
        }

        return a.title.localeCompare(
          b.title,
          'ja'
        )
      }
    )
  }


  function getArtistStats(artist) {
    const artistSongs =
      songs.filter(
        song =>
          song.artist === artist
      )

    const readyCount =
      artistSongs.filter(
        hasRangeData
      ).length

    return {
      artistSongs,
      readyCount,
    }
  }


  function createSongButton(song) {
    const item =
      document.createElement(
        'button'
      )

    item.className =
      'search-song-item'

    const songStatus =
      hasRangeData(song)
        ? `${song.artist} ・ 音域あり`
        : `${song.artist} ・ 音域準備中`

    item.innerHTML = `
      <div>
        <strong>${song.title}</strong>
        <span>${songStatus}</span>
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
    const {
      artistSongs,
      readyCount,
    } = getArtistStats(artist)

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
          全${artistSongs.length}曲 ・ 音域あり${readyCount}曲
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

    const {
      artistSongs,
      readyCount,
    } = getArtistStats(artist)


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
          renderArtistList(
            artistListQuery
          )
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
      `🎤 ${artist} の曲一覧（全${artistSongs.length}曲・音域あり${readyCount}曲）`

    container.appendChild(
      heading
    )


    const songFilter =
      document.createElement(
        'input'
      )

    songFilter.type =
      'text'

    songFilter.className =
      'song-search'

    songFilter.placeholder =
      '曲名で絞り込み'

    container.appendChild(
      songFilter
    )


    const songResults =
      document.createElement(
        'div'
      )

    songResults.className =
      'song-search-results'

    container.appendChild(
      songResults
    )


    function renderFilteredSongs(
      searchText = ''
    ) {
      songResults.innerHTML = ''

      const filteredSongs =
        sortSongsForDisplay(
          artistSongs.filter(
            song =>
              matchesSearch(
                song.title,
                searchText
              )
          )
        )


      if (
        filteredSongs.length === 0
      ) {
        songResults.innerHTML = `
          <div class="no-song">
            曲が見つかりません
          </div>
        `

        return
      }


      filteredSongs.forEach(
        song => {
          songResults.appendChild(
            createSongButton(song)
          )
        }
      )
    }


    songFilter.addEventListener(
      'input',
      event => {
        renderFilteredSongs(
          event.target.value
        )
      }
    )


    renderFilteredSongs()


    requestAnimationFrame(
      () => {
        songFilter.focus()
      }
    )
  }


  function renderArtistList(
    initialQuery = ''
  ) {
    container.innerHTML = ''

    artistListQuery =
      initialQuery


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
        artistListQuery = ''

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


    const artistSearch =
      document.createElement(
        'input'
      )

    artistSearch.type =
      'text'

    artistSearch.className =
      'song-search'

    artistSearch.placeholder =
      'アーティスト名で絞り込み'

    artistSearch.value =
      artistListQuery

    container.appendChild(
      artistSearch
    )


    const artistResults =
      document.createElement(
        'div'
      )

    artistResults.className =
      'song-search-results'

    container.appendChild(
      artistResults
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


    function renderFilteredArtists(
      searchText = ''
    ) {
      artistResults.innerHTML = ''

      artistListQuery =
        searchText


      const filteredArtists =
        artists.filter(
          artist =>
            matchesSearch(
              artist,
              searchText
            )
        )


      if (
        filteredArtists.length === 0
      ) {
        artistResults.innerHTML = `
          <div class="no-song">
            アーティストが見つかりません
          </div>
        `

        return
      }


      filteredArtists.forEach(
        artist => {
          artistResults.appendChild(
            createArtistButton(
              artist,
              'artists'
            )
          )
        }
      )
    }


    artistSearch.addEventListener(
      'input',
      event => {
        renderFilteredArtists(
          event.target.value
        )
      }
    )


    renderFilteredArtists(
      artistListQuery
    )


    requestAnimationFrame(
      () => {
        artistSearch.focus()

        artistSearch.setSelectionRange(
          artistSearch.value.length,
          artistSearch.value.length
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
        artistListQuery = ''

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

    if (!normalizeSearchText(searchText)) {
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
            matchesSearch(
              artist,
              searchText
            )
        )
        .sort(
          (a, b) =>
            a.localeCompare(
              b,
              'ja'
            )
        )


    const songResults =
      sortSongsForDisplay(
        songs.filter(
          song =>
            matchesSearch(
              `${song.artist} ${song.title}`,
              searchText
            )
        )
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

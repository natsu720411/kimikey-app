export function initSongSearch({
  songs,
  onSongSelected,
  getSongPageHref,
  getSongFit = null,
}) {
  const container =
    document.querySelector(
      '#songSearchResults'
    )

  const input =
    document.querySelector(
      '#songSearch'
    )

  const filterRangeReady = document.querySelector('#filterRangeReady')
  const filterFitsRange = document.querySelector('#filterFitsRange')
  const filterRecentRelease = document.querySelector('#filterRecentRelease')
  const filterHighNote = document.querySelector('#filterHighNote')
  const clearSongFilters = document.querySelector('#clearSongFilters')
  const filterSummary = document.querySelector('#songFilterSummary')

  let artistListQuery = ''
  let initialSearchApplied = false


  function hasRangeData(song) {
    return (
      Number.isFinite(song.minMidi) &&
      Number.isFinite(song.maxMidi)
    )
  }


  function trackAnalyticsEvent(
    eventName,
    parameters = {}
  ) {
    if (
      typeof window === 'undefined' ||
      typeof window.gtag !== 'function'
    ) {
      return
    }

    window.gtag(
      'event',
      eventName,
      parameters
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


  function getFilterState() {
    return {
      readyOnly: Boolean(filterRangeReady?.checked),
      fitsRange: Boolean(filterFitsRange?.checked),
      recentRelease: Boolean(filterRecentRelease?.checked),
      highNoteMax: Number(filterHighNote?.value || 0),
    }
  }

  function hasActiveFilters() {
    const state = getFilterState()
    return (
      state.readyOnly ||
      state.fitsRange ||
      state.recentRelease ||
      state.highNoteMax > 0
    )
  }

  function passesFilters(song) {
    const state = getFilterState()

    if (state.readyOnly && !hasRangeData(song)) return false

    if (
      state.fitsRange &&
      (typeof getSongFit !== 'function' || !getSongFit(song))
    ) {
      return false
    }

    if (
      state.recentRelease &&
      (!Number.isFinite(song.year) || song.year < new Date().getFullYear() - 1)
    ) {
      return false
    }

    if (
      state.highNoteMax > 0 &&
      (!Number.isFinite(song.maxMidi) || song.maxMidi > state.highNoteMax)
    ) {
      return false
    }

    return true
  }

  function updateFilterSummary(count = null) {
    if (!filterSummary) return

    const state = getFilterState()
    const labels = []
    if (state.readyOnly) labels.push('音域あり')
    if (state.fitsRange) labels.push('自分に合う')
    if (state.recentRelease) labels.push('新曲')
    if (state.highNoteMax > 0) labels.push('最高音指定')

    if (labels.length === 0) {
      filterSummary.textContent = ''
      return
    }

    filterSummary.textContent =
      count === null
        ? `絞り込み中：${labels.join('・')}`
        : `${count}曲見つかりました ・ ${labels.join('・')}`
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
        'a'
      )

    item.className =
      'search-song-item'

    item.href =
      typeof getSongPageHref === 'function'
        ? getSongPageHref(song)
        : '/songs/'

    const rangeAvailable =
      hasRangeData(song)

    const songStatus =
      rangeAvailable
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
      event => {
        event.preventDefault()

        trackAnalyticsEvent(
          'song_selected',
          {
            song_title: song.title,
            artist_name: song.artist,
            range_available:
              rangeAvailable
                ? 'yes'
                : 'no',
          }
        )

        if (!rangeAvailable) {
          trackAnalyticsEvent(
            'range_data_requested',
            {
              song_title: song.title,
              artist_name: song.artist,
            }
          )
        }

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
              ) &&
              passesFilters(song)
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
    if (!initialSearchApplied) {
      initialSearchApplied = true
      const queryFromLink =
        new URLSearchParams(window.location.search).get('search')?.trim() ?? ''
      if (queryFromLink && !normalizeSearchText(searchText)) {
        searchText = queryFromLink
        input.value = queryFromLink
      }
    }
    container.innerHTML = ''

    if (!normalizeSearchText(searchText) && !hasActiveFilters()) {
      updateFilterSummary()
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
            ) &&
            passesFilters(song)
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


    if (!hasActiveFilters()) {
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
    }

    updateFilterSummary(songResults.length)

    songResults.slice(0, 120).forEach(
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

  for (const control of [
    filterRangeReady,
    filterFitsRange,
    filterRecentRelease,
    filterHighNote,
  ]) {
    control?.addEventListener('change', () => {
      renderSearchResults(input.value)
    })
  }

  clearSongFilters?.addEventListener('click', () => {
    if (filterRangeReady) filterRangeReady.checked = false
    if (filterFitsRange) filterFitsRange.checked = false
    if (filterRecentRelease) filterRecentRelease.checked = false
    if (filterHighNote) filterHighNote.value = ''
    renderSearchResults(input.value)
  })


  return renderSearchResults
}

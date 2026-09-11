export function initSongSearch({ songs, onSongSelected }) {
  const container = document.querySelector('#songSearchResults')

  function renderSearchResults(searchText = '') {
    container.innerHTML = ''
    const query = searchText.trim().toLowerCase()

    if (!query) return

    const results = songs.filter(song =>
      song.title.toLowerCase().includes(query) ||
      song.artist.toLowerCase().includes(query)
    )

    if (results.length === 0) {
      container.innerHTML = `
        <div class="no-song">
          曲が見つかりません
        </div>
      `
      return
    }

    results.forEach(song => {
      const item = document.createElement('button')
      item.className = 'search-song-item'
      item.innerHTML = `
        <div>
          <strong>${song.title}</strong>
          <span>${song.artist}</span>
        </div>
        <span class="search-arrow">›</span>
      `
      item.addEventListener('click', () => onSongSelected(song))
      container.appendChild(item)
    })
  }

  document.querySelector('#songSearch').addEventListener('input', event => {
    renderSearchResults(event.target.value)
  })

  return renderSearchResults
}

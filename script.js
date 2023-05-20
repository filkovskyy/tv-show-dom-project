const showContainer = document.querySelector('.show-box')
const gridContainer = document.querySelector('.grid-container')
const input = document.getElementById('search')
const numOfShows = document.querySelector('#number_of_shows')
const numOfEpisodes = document.querySelector('#number_of_episodes')
const showSelector = document.querySelector('#show_selector')
const episodeSelector = document.querySelector('#episode_selector')
const homeBtn = document.querySelector('#home_btn')

const showAPIs = [
  'https://api.tvmaze.com/shows/82/episodes',
  'https://api.tvmaze.com/shows/527/episodes',
  'https://api.tvmaze.com/shows/22036/episodes',
  'https://api.tvmaze.com/shows/5/episodes',
  'https://api.tvmaze.com/shows/583/episodes',
  'https://api.tvmaze.com/shows/179/episodes',
  'https://api.tvmaze.com/shows/528/episodes',
  'https://api.tvmaze.com/shows/590/episodes',
]

async function fetchEpisodes(api) {
  try {
    const response = await Promise.all(api.map((e) => fetch(e)))
    let responseJSON = await Promise.all(response.map((e) => e.json()))
    return responseJSON
  } catch (err) {
    console.log(err)
  }
}

async function fetchShowInfo(api) {
  try {
    const response = await Promise.all(api.map((e) => fetch(e.slice(0, -9))))
    let responseJSON = await Promise.all(response.map((e) => e.json()))
    return responseJSON
  } catch (err) {
    console.log(err)
  }
}

async function setup() {
  try {
    const showData = await fetchShowInfo(showAPIs)
    const showDataArr = [...showData]
    const allShows = showDataArr.map((show) => [show.name, show.id])
    console.log(showDataArr)

    input.addEventListener('input', () => search(input))

    showDataArr.forEach((data) => renderShows(data, showContainer, showDataArr))

    setShowsDropMenu(allShows)
  } catch (error) {
    console.log(error)
  }
}

homeBtn.addEventListener('click', async () => {
  const showData = await fetchShowInfo(showAPIs)
  const showDataArr = [...showData]
  deleteAllChildren(gridContainer)
  deleteAllChildren(episodeSelector)
  showDataArr.forEach((data) => renderShows(data, showContainer, showDataArr))
  showContainer.style.display = 'block'
  showSelector.value = ''
  episodeSelector.value = ''
  setNumberOfShows(showDataArr)
  setNumberOfEpisodes
})

// Function to format the series number
function formatSeriesNumber(number) {
  return number < 10 ? '0' + number : number
}
function setNumberOfShows(data) {
  numOfShows.innerHTML = `Displaying ${data.length}/${data.length} shows`
}

function setNumberOfEpisodes(dataArr) {
  numOfEpisodes.innerHTML = `Displaying ${dataArr.length}/${dataArr.length} episodes`
}
// Function to search for episodes
function search({ value: inputValue }) {
  const filter = inputValue.toUpperCase().trim()
  const posts = Array.from(document.querySelectorAll('.post-container'))
  let count = 0

  posts.forEach((post) => {
    const title = post.querySelector('h2')
    const txtValue = title.textContent.trim()

    if (txtValue.toUpperCase().includes(filter)) {
      post.style.display = ''
      count++
    } else {
      post.style.display = 'none'
    }
  })

  numOfEpisodes.forEach((el) => {
    el.innerHTML = `Displaying ${count}/${posts.length} episodes`
  })
}

function renderShows(data, parentElement, showsArr) {
  numOfEpisodes.style.display = 'none'
  setNumberOfShows(showsArr)
  const showEl = Object.assign(document.createElement('div'), {
    className: 'show-container',
  })
  const showDescription = Object.assign(document.createElement('div'), {
    className: 'show-description',
  })
  const showTitle = Object.assign(document.createElement('p'), {
    className: 'show-title',
  })
  const showLink = Object.assign(document.createElement('a'), {
    href: data.url,
  })
  const showSummary = Object.assign(document.createElement('p'), {
    className: 'show-summary',
  })

  const showImage = Object.assign(document.createElement('img'), {
    className: 'show-poster',
    src: data.image.medium,
  })
  const showDetails = Object.assign(document.createElement('div'), {
    className: 'show-details',
  })
  const showRating = document.createElement('p')
  const showGenre = document.createElement('p')
  const showStatus = document.createElement('p')
  const showRuntime = document.createElement('p')
  const showLanguage = document.createElement('p')

  showLink.innerHTML = data.name
  showRating.innerHTML = `Rating : ${data.rating.average}`
  showGenre.innerHTML = `Genres : ${data.genres.join(' | ')}`
  showStatus.innerHTML = `Status : ${data.status}`
  showLanguage.innerHTML = `Language : ${data.language}`
  showSummary.innerHTML = data.summary
  showRuntime.innerHTML = `Runtime : ${data.runtime} min`

  parentElement.append(showEl)
  showEl.append(showImage)
  showEl.append(showDescription)
  showEl.append(showDetails)
  showDescription.append(showTitle)
  showDescription.append(showSummary)
  showDetails.append(showRating)
  showDetails.append(showGenre)
  showDetails.append(showStatus)
  showDetails.append(showLanguage)
  showDetails.append(showRuntime)
  showTitle.append(showLink)
}

// Function to render the elements on the page
function renderElements(data, parentElement) {
  numOfShows.style.display = 'none'
  numOfEpisodes.style.display = 'inline'
  const dataEl = Object.assign(document.createElement('div'), {
    className: 'post-container',
    id: data.id,
  })
  const title = document.createElement('h2')
  const link = Object.assign(document.createElement('a'), { href: data.url })
  const image = document.createElement('img')
  const description = document.createElement('p')
  try {
    image.setAttribute('src', data.image.medium)
    description.innerHTML = data.summary
  } catch (err) {
    image.setAttribute(
      'src',
      'https://static.tvmaze.com/images/no-img/no-img-portrait-text.png'
    )
    description.innerHTML =
      'Description information is not available. Sorry for inconvenience'

    console.log("Coudn't load image")
  }
  link.innerHTML = `${data.name} - S${formatSeriesNumber(
    data.season
  )}E${formatSeriesNumber(data.number)}`
  // description.innerHTML = data.summary
  parentElement.append(dataEl)
  dataEl.append(title)
  title.append(link)
  dataEl.append(image)
  dataEl.append(description)
}

function deleteAllChildren(parentEl) {
  while (parentEl.firstChild) {
    parentEl.removeChild(parentEl.firstChild)
  }
}

async function setShowsDropMenu(shows) {
  shows.sort()
  shows.forEach((show) => {
    let option = document.createElement('option')
    option.setAttribute('value', show[1])
    option.innerHTML = show[0]
    showSelector.append(option)
  })
  showSelector.addEventListener('change', async () => {
    console.log(`https://api.tvmaze.com/shows/${showSelector.value}/episodes`)
    let res = await fetch(
      `https://api.tvmaze.com/shows/${showSelector.value}/episodes`
    )
    let episodes = await res.json()
    console.log(episodes)
    deleteAllChildren(gridContainer)
    deleteAllChildren(episodeSelector)
    episodes.forEach((episode) => {
      renderElements(episode, gridContainer)
      showContainer.style.display = 'none'
    })

    setDropDownMenuAndScrollToElement(episodes)
    setNumberOfEpisodes(episodes)
  })
}

function setDropDownMenuAndScrollToElement(episodes) {
  episodes.forEach((episode) => {
    let option = document.createElement('option')
    option.setAttribute(
      'value',
      `S${formatSeriesNumber(episode.season)}E${formatSeriesNumber(
        episode.number
      )}`
    )
    option.innerHTML = `${episode.name} - S${formatSeriesNumber(
      episode.season
    )}E${formatSeriesNumber(episode.number)}`
    episodeSelector.append(option)
  })

  episodeSelector.addEventListener('change', () => {
    const episode = episodes.find(
      (episode) =>
        `S${formatSeriesNumber(episode.season)}E${formatSeriesNumber(
          episode.number
        )}` === episodeSelector.value
    )
    const selectedEl = document.getElementById(`${episode.id}`)
    console.log(selectedEl)
    try {
      selectedEl.scrollIntoView({ behavior: 'smooth' })
    } catch (err) {
      console.log(err)
    }
    highlightSelected(selectedEl)
  })
}

function highlightSelected(item) {
  const duration = 1200
  const interval = 200

  const blink = setInterval(() => {
    item.classList.toggle('selected')
  }, interval)

  setTimeout(() => {
    clearInterval(blink)
    item.classList.remove('selected') // make sure the class is removed after stopping the interval
  }, duration)
}

window.onload = setup

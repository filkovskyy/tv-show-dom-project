const showAPIs = [
  'https://api.tvmaze.com/shows/82/episodes',
  'https://api.tvmaze.com/shows/527/episodes',
  'https://api.tvmaze.com/shows/22036/episodes',
  'https://api.tvmaze.com/shows/5/episodes',
  'https://api.tvmaze.com/shows/583/episodes',
  'https://api.tvmaze.com/shows/179/episodes',
  'https://api.tvmaze.com/shows/379/episodes',
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
    const episodesData = await fetchEpisodes(showAPIs)
    const episodesDataArr = [...episodesData]
    let allEpisodes = []
    for (let i = 0; i < episodesDataArr.length; i++) {
      allEpisodes = allEpisodes.concat(episodesDataArr[i])
    }

    const showData = await fetchShowInfo(showAPIs)
    const showDataArr = [...showData]
    const allShows = showDataArr.map((show) => [show.name, show.id])
    console.log(allShows)

    const globalContainer = document.querySelector('.grid-container')
    const input = document.getElementById('search')
    input.addEventListener('input', () => search(input))
    setNumberOfEpisodes(allEpisodes)
    allEpisodes.forEach((data) => renderElements(data, globalContainer))

    // Setting values for drop-down menus
    setShowsDropMenu(allShows)
    setDropDownMenuAndScrollToElement(allEpisodes)
  } catch (error) {
    console.log(error)
  }
}

// Function to format the series number
function formatSeriesNumber(number) {
  return number < 10 ? '0' + number : number
}
function setNumberOfEpisodes(dataArr) {
  const numOfEpisodes = document.querySelector('#number_of_episodes')
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

  const numOfEpisodes = document.querySelectorAll('#number_of_episodes')
  numOfEpisodes.forEach((el) => {
    el.innerHTML = `Displaying ${count}/${posts.length} episodes`
  })
}

// Function to render the elements on the page
function renderElements(element, parentElement) {
  const dataEl = document.createElement('div')
  const title = document.createElement('h2')
  const link = document.createElement('a')
  const image = document.createElement('img')
  const description = document.createElement('p')
  dataEl.setAttribute('id', element.id)
  dataEl.setAttribute('class', 'post-container')
  try {
    image.setAttribute('src', element.image.medium)
    description.innerHTML = element.summary
  } catch (err) {
    image.setAttribute(
      'src',
      'https://static.tvmaze.com/images/no-img/no-img-portrait-text.png'
    )
    description.innerHTML =
      'Description information is not available. Sorry for inconvenience'

    console.log("Coudn't load image")
  }
  link.setAttribute('href', element.url)
  link.innerHTML = `${element.name} - S${formatSeriesNumber(
    element.season
  )}E${formatSeriesNumber(element.number)}`
  // description.innerHTML = element.summary
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
  const globalContainer = document.querySelector('.grid-container')
  const select = document.querySelector('#show_selector')
  const episodeSelector = document.querySelector('#episode_selector')
  shows.sort()
  shows.forEach((show) => {
    let option = document.createElement('option')
    option.setAttribute('value', show[1])
    option.innerHTML = show[0]
    select.append(option)
  })
  select.addEventListener('change', async () => {
    console.log(`https://api.tvmaze.com/shows/${select.value}/episodes`)
    let res = await fetch(
      `https://api.tvmaze.com/shows/${select.value}/episodes`
    )
    let episodes = await res.json()
    console.log(episodes)
    deleteAllChildren(globalContainer)
    deleteAllChildren(episodeSelector)
    episodes.forEach((episode) => renderElements(episode, globalContainer))
    setDropDownMenuAndScrollToElement(episodes)
    setNumberOfEpisodes(episodes)
  })
}

function setDropDownMenuAndScrollToElement(episodes) {
  const select = document.querySelector('#episode_selector')
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
    select.append(option)
  })

  select.addEventListener('change', () => {
    const episode = episodes.find(
      (episode) =>
        `S${formatSeriesNumber(episode.season)}E${formatSeriesNumber(
          episode.number
        )}` === select.value
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

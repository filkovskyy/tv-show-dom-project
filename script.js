async function setup() {
  try {
    const response = await fetch('https://api.tvmaze.com/shows/82/episodes')
    const data = await response.json()
    const dataArr = [...data]
    console.log(dataArr)
    const globalContainer = document.querySelector('.grid-container')
    const input = document.getElementById('search')
    const numOfEpisodes = document.querySelector('#number_of_episodes')
    input.addEventListener('input', () => search(input))
    numOfEpisodes.innerHTML = `Displaying ${data.length}/${dataArr.length} episodes` // Display the number of episodes
    dataArr.forEach((data) => renderElements(data, globalContainer))
    setDropDownMenu(dataArr)
    scrollToElement(dataArr)
  } catch (error) {
    console.log(error)
  }
}

// Function to format the series number
function formatSeriesNumber(number) {
  return number < 10 ? '0' + number : number
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
  image.setAttribute('src', element.image.medium)
  link.setAttribute('href', element.url)
  link.innerHTML = `${element.name} - S${formatSeriesNumber(
    element.season
  )}E${formatSeriesNumber(element.number)}`
  description.innerHTML = element.summary
  parentElement.append(dataEl)
  dataEl.append(title)
  title.append(link)
  dataEl.append(image)
  dataEl.append(description)
}

function setDropDownMenu(episodes) {
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
}

function scrollToElement(episodes) {
  const select = document.querySelector('#episode_selector')
  select.addEventListener('change', () => {
    const episode = episodes.find(
      (episode) =>
        `S${formatSeriesNumber(episode.season)}E${formatSeriesNumber(
          episode.number
        )}` === select.value
    )
    const selectedEl = document.getElementById(`${episode.id}`)
    selectedEl.scrollIntoView({ behavior: 'smooth' })
  })
}

window.onload = setup

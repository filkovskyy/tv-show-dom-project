//You can edit ALL of the code here
const getData = async () => {
  try {
    const response = await fetch('https://api.tvmaze.com/shows/82/episodes')
    const data = await response.json()
    const dataArr = [...data]
    console.log(data)
    const globalContainer = document.querySelector('.global')
    dataArr.forEach((data) => {
      const dataEl = document.createElement('div')
      const title = document.createElement('h2')
      const link = document.createElement('a')
      const image = document.createElement('img')
      const description = document.createElement('p')
      dataEl.setAttribute('id', data.id)
      dataEl.setAttribute('class', 'post-container')
      image.setAttribute('src', data.image.medium)
      link.setAttribute('href', data.url)
      link.innerHTML = `${data.name} - S${formatSeriesNumber(
        data.season
      )}E${formatSeriesNumber(data.number)}`
      description.innerHTML = data.summary
      globalContainer.append(dataEl)
      dataEl.append(title)
      title.append(link)
      dataEl.append(image)
      dataEl.append(description)
    })
  } catch (error) {
    console.log(error)
  }
}
function setup() {
  const allEpisodes = getAllEpisodes()
  makePageForEpisodes(allEpisodes)
  let isLoading = false
}
function formatSeriesNumber(number) {
  return number < 10 ? '0' + number : number
}
function makePageForEpisodes(episodeList) {
  const rootElem = document.getElementById('root')
  rootElem.textContent = `Got ${episodeList.length} episode(s)`
}

window.onload = setup
window.onload = getData

import { useEffect, useState } from 'react'

function App() {
  const [userType, setUserType] = useState('user')
  const [value, setValue] = useState('')
  const [message, setMessage] = useState('')
  const [previousChats, setPreviousChats] = useState([])
  const [currentTitle, setCurrentTitle] = useState('')

  const createNewChat = () => {
    setMessage(null)
    setValue('')
    setCurrentTitle(null)
  }
  const handleChangeUserType = (type) => {
    setUserType(type)
  }
  const handleClick = (uniqueTitle) => {
    setCurrentTitle(uniqueTitle)
    setMessage(null)
    setValue('')
  }

  const getMessages = async () => {
    const options = {
      method: 'POST',
      body: JSON.stringify({
        message: value,
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    }
    try {
      const response = await fetch('http://localhost:8000/completions', options)
      const data = await response.json()
      console.log(data)
      setMessage(data.choices[0].message)
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    console.log(currentTitle, value, message)
    if (!currentTitle && value && message) {
      setCurrentTitle(value)
    }
    if (currentTitle && value && message) {
      setPreviousChats((prevChats) => [
        ...prevChats,
        {
          title: currentTitle,
          role: 'user',
          content: value,
        },
        {
          title: currentTitle,
          role: message.role,
          content: message.content,
        },
      ])
    }
  }, [message, currentTitle])

  console.log(previousChats)

  const currentChat = previousChats.filter(
    (previousChat) => previousChat.title === currentTitle
  )
  const uniqueTitles = Array.from(
    new Set(previousChats.map((previousChat) => previousChat.title))
  )
  console.log(uniqueTitles)

  return (
    <>
      <div className="app">
        <section className="side-bar">
          <button id="new-chat-btn" onClick={createNewChat}>
            <span>
              <i className="fa-solid fa-plus"></i>New chat
            </span>
          </button>
          <ul className="history">
            <p id="history-title">History</p>
            {uniqueTitles?.map(
              (uniqueTitle, index) => (
                <li key={index} onClick={() => handleClick(uniqueTitle)}>
                  <i className="fa-regular fa-message"></i>
                  <p>{uniqueTitle}</p>
                </li>
              )

              //</div>
            )}
          </ul>
          <nav>
            <p>Made by Artem</p>
          </nav>
        </section>
        <section className="main">
          {!currentTitle && (
            <div className="mainPage">
              <h1>ArtemGPT</h1>
              <div className="grid-container">
                <div className="grid-column first">
                  <i className="fa-regular fa-sun"></i>
                  <h2 className="grid-heading">Examples</h2>
                  <ul className="chat-overview">
                    <li className="examples">
                      <button>
                        "Explain quantum computing in simple terms" →
                      </button>
                    </li>
                    <li className="examples">
                      <button>
                        "Got any creative ideas for a 10 year old’s birthday?" →
                      </button>
                    </li>
                    <li className="examples">
                      <button>
                        "How do I make an HTTP request in Javascript?" →
                      </button>
                    </li>
                  </ul>
                </div>
                <div className="grid-column second">
                  <i className="fa-solid fa-bolt"></i>
                  <h2 className="grid-heading">Capabilities</h2>
                  <ul className="chat-overview">
                    <li>
                      Remembers what user said earlier in the conversation
                    </li>
                    <li>Allows user to provide follow-up corrections</li>
                    <li>Trained to decline inappropriate requests</li>
                  </ul>
                </div>
                <div className="grid-column third">
                  <i className="fa-solid fa-triangle-exclamation"></i>
                  <h2 className="grid-heading">Limitations</h2>
                  <ul className="chat-overview">
                    <li>May occasionally generate incorrect information</li>
                    <li>
                      May occasionally produce harmful instructions or biased
                      content
                    </li>
                    <li>Limited knowledge of world and events after 2021</li>
                  </ul>
                </div>
              </div>
            </div>
          )}
          <ul className="feed">
            {currentChat?.map((chatMessage, index) => (
              <li key={index}>
                <div className="role">
                  {chatMessage.role === 'user' && (
                    <i className="fa-solid fa-user"></i>
                  )}
                  {chatMessage.role === 'assistant' && (
                    <i className="fa-solid fa-robot"></i>
                  )}
                </div>

                <p>{chatMessage.content}</p>
              </li>
            ))}
          </ul>
          <div className="bottom-section">
            <div className="input-container">
              <input
                type="text"
                value={value}
                onChange={(e) => setValue(e.target.value)}
              />
              <div id="submit" onClick={getMessages}>
                <i className="fa-regular fa-paper-plane"></i>
              </div>
            </div>
            <p className="info">
              Free Research Preview. ChatGPT may produce inaccurate information
              about people, places, or facts. ChatGPT Mar 23 Version
            </p>
          </div>
        </section>
      </div>
    </>
  )
}

export default App

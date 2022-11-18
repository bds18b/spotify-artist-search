import { useState, useRef } from 'react'
import './App.css'
import NA from './assets/not-available-circle.png'

function App() {
  //spotify variables
  const client_id = "2b4f407653c44852a6474a37c1928dbf"
  const client_secret = "162e01b59b874741b4fa19b1ca3100dc"
  const base_artist_url = "https://open.spotify.com/artist/"
  
  const search_value = useRef();
  const [results, setResults] = useState([])

  function handleSearch() {
    _getToken().then(function(token) {
      _getArtist(token, search_value.current.value).then(function(data) {
         setResults(format_data(data))
      })
    })
  }

  function format_data(data) {
    const formatted_data = []
    const items = data['artists']['items']

    for (let x in items) {

      let image = ''
      if (items[x]['images'].length > 0){
        image = items[x]['images'][0].url
      } else {
        image = NA;
      }
      console.log(items[x])
      
    
      let dict = {
        "name": items[x]['name'], 
        "artist_id" : items[x]['id'],
        "followers" : items[x]['followers']['total'],
        "genres" : items[x]['genres'],
        "spotify-link" : items[x]['external_urls']['spotify'],
        "image" : image
      }
      formatted_data.push(dict)
    }
    return formatted_data
  }

  const _getToken = async () => {
    
    const result = await fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        headers: {
            'Content-Type' : 'application/x-www-form-urlencoded', 
            'Authorization' : 'Basic ' + btoa(client_id + ':' + client_secret)
        },
        body: 'grant_type=client_credentials'
    });

    const data = await result.json();
    return data.access_token;
  }

  const _getArtist = async (token, artist_name) => {

      const result = await fetch("https://api.spotify.com/v1/search?type=artist&q=" + artist_name, {
          method: 'GET',
          headers: { 'Authorization' : 'Bearer ' + token}
      });

      const data = await result.json();
      return data;
  }

  function handleEnter(e) {
    if (e.key === 'Enter') {
      handleSearch()
    }
  }

  

  
  return (
    <>
      <div className="search-bar-container">
        <h1>Spotify Artist Search</h1>
        <input onKeyDown={handleEnter} ref={search_value} placeholder="Enter an Artist Name"/>
        <button type="text" onClick={handleSearch}>Search</button>
      </div>

      <div className="grid-container">
        {results.map(results => 
            <a href={base_artist_url + results.artist_id} target="_blank" className='grid-item'>
              <img src={results.image}/>
              <h1>{results.name}</h1>
              <h2>Followers: {results.followers}</h2>
            </a>
        )}
      </div>
    </>
  )
}

export default App

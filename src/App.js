import './App.css';
import { useState, useEffect } from 'react';
import { data } from 'autoprefixer';
import searchIcon from './img/search.svg';
import songIcon from './img/disc.svg';
import artistIcon from './img/user.svg';
import { getLyrics, searchSong } from 'genius-lyrics-api';

// spotify
const CLIENT_ID = "7a507811507a40808833cf3ba9962c96";
const CLIENT_SECRET = "2c86fd15ef1a41b4a58d082b8cfd135a";

const YOUTUBE_DATA_API_KEY = "AIzaSyAVu-tvpt1ZFbz0nikqcNKTVt--WmEuA1Y";

const GENIUS_API_KEY = "lUlvBOiGEFiAeRvnMlUzrvN34mG6JkYW0relP2TC9tbBXkYf-kayW6WOyrurWMtg"

function App() {
  const [searchTerm, setSearchTerm] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [accessToken, setAccessToken] = useState(null);
  const [tracks, setTracks] = useState([]);
  const [selectedTrack, setSelectedTrack] = useState(null);
  const [chosenTrack, setChosenTrack] = useState({
    apiKey: GENIUS_API_KEY,
    title: "",
    artist: "",
    optimizeQuery: true
  });

  useEffect(() => {
    var authParameters = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: 'grant_type=client_credentials&client_id=' + CLIENT_ID + '&client_secret=' + CLIENT_SECRET
    }

    fetch('https://accounts.spotify.com/api/token', authParameters)
      .then(result => result.json())
      .then(data => setAccessToken(data.access_token))
  }, [])

  // search
  async function search() {
    console.log("Searching for: " + searchTerm);

    // Get request using search to get Artist ID
    var searchParameters = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + accessToken
      }
    }

      var returnedTracks = await fetch('https://api.spotify.com/v1/search?q=' + searchTerm + '&type=track', searchParameters)
      .then(response => response.json())
      .then(data => { 
      console.log(data); 
      setTracks(data.tracks.items);
     }) 
  }

  const handleInputChange = (event) => {
    setSearchTerm(event.target.value);
    if (searchTerm.trim() === '') {
      setShowDropdown(false);
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter' && searchTerm.trim() !== '') {
      console.log(`Search term: ${searchTerm}`); // Log the search term
      setShowDropdown(true);
      search();
    }
  };

  const handleSearchClick = () => {
    setShowDropdown(true); // Show dropdown on button click
    search();
  };

  const handleTrackClick = (track) => {
    setSelectedTrack(track);
    setChosenTrack({
      apiKey: GENIUS_API_KEY,
      title: track.name,
      artist: track.artists.map(artist => artist.name).join(', '),
      optimizeQuery: true
    });
    setShowDropdown(false);
  };

  const fetchAndLogLyrics = async () => {
    if (chosenTrack.title && chosenTrack.artist) {
      try {
        const lyrics = await getLyrics(chosenTrack);
        console.log(`Lyrics for "${chosenTrack.title}" by ${chosenTrack.artist}:\n${lyrics}`);
      } catch (error) {
        console.error("Error fetching lyrics:", error);
      }
    } else {
      console.log("Track details are incomplete.");
    }
  };

  const handleLogButtonClick = () => {
    if (selectedTrack) {
      console.log(`Song Title: ${selectedTrack.name}, Artist: ${selectedTrack.artists.map(artist => artist.name).join(', ')}`);
      console.log(chosenTrack);
      fetchAndLogLyrics();
    } else {
      console.log("No track selected");
    }
  };

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (event.target.closest('.dropdown-items') === null && event.target.closest('.search-bar') === null && event.target.closest('.search-button') === null) {
        setShowDropdown(false);
      }
    };
    
    document.addEventListener('mousedown', handleOutsideClick);

    // Cleanup: Remove the event listener when the component unmounts
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <header className="bg-pink-500 text-white py-4 px-6 shadow-md">
        <h1 className="text-1xl font-bold">UtacyLyrics</h1>
      </header>

      <main className="flex-grow p-6 flex items-start justify-center">
        
        <button onClick={handleLogButtonClick}>Click me!</button>

        <div className="w-full max-w-md mt-20 relative">
          <div className='relative'>
            <input
              type="text"
              className="search-bar"
              placeholder="Search for a song..."
              value={searchTerm}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
            />
            <button 
              className="search-button"
              onClick={handleSearchClick}
            >
              <img src={searchIcon} alt="Search" className="w-6 h-6 filter invert" /> {search.svg}
            </button>
          </div>
          
          {showDropdown && (
            <div className="absolute bg-white shadow-md w-full overflow-y-auto max-h-80">
              <ul className="dropdown-items">
                {tracks.map((track, i) => (
                  <li key={track.id} className="px-4 py-2 cursor-pointer flex items-center" onClick={() => handleTrackClick(track)}>
                    <span className="mr-2"><img src={track.album.images[2].url}></img></span> 
                    <span>{track.name}</span> 
                  </li>
                ))}
              </ul>
            </div>
          )}

        </div>
      </main>
    </div>
  );
}

export default App;
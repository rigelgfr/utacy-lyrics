import './App.css';
import { useState, useEffect } from 'react';
import { data } from 'autoprefixer';
import searchIcon from './img/search.svg';

import Header from './components/Header';
import SearchBar from './components/SearchBar';
import Dropdown from './components/Dropdown';

// spotify
const CLIENT_ID = "7a507811507a40808833cf3ba9962c96";
const CLIENT_SECRET = "2c86fd15ef1a41b4a58d082b8cfd135a";

function App() {
  const [searchTerm, setSearchTerm] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [accessToken, setAccessToken] = useState(null);
  const [tracks, setTracks] = useState([]);
  const [selectedTrack, setSelectedTrack] = useState(null);

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
    setShowDropdown(false);
  };

  const handleLogButtonClick = () => {
    if (selectedTrack) {
      console.log(`Song Title: ${selectedTrack.name}, Artist: ${selectedTrack.artists.map(artist => artist.name).join(', ')}`);
      fetchAndLogLyrics();
    } else {
      console.log("No track selected");
    }
  };

  async function fetchAndLogLyrics() {
    if (!selectedTrack) {
      console.error('No track selected');
      return;
    }

    const title = selectedTrack.name; // replace with your title
    const artist = selectedTrack.artists.map(artist => artist.name).join(', '); // Use selected track's artists

    try {
        const response = await fetch(`/api/lyrics?title=${title}&artist=${artist}`);
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error);
        }
        const data = await response.json();
        console.log(data.lyrics);
    } catch (error) {
        console.error('Error fetching lyrics:', error.message);
    }
  }

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
      <Header />

      <main className="flex-grow p-6 flex items-start justify-center">
        
        <button onClick={handleLogButtonClick}>Click me!</button>

        <div className="w-full max-w-md mt-20 relative">
          <SearchBar
              searchTerm={searchTerm}
              handleInputChange={handleInputChange}
              handleKeyDown={handleKeyDown}
              handleSearchClick={handleSearchClick}
            />
          
          {showDropdown && (
            <Dropdown tracks={tracks} handleTrackClick={handleTrackClick} />
          )}
        </div>
      </main>
    </div>
  );
}

export default App;
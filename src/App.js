import './App.css';
import { useState, useEffect } from 'react';
import { data } from 'autoprefixer';

import Header from './components/Header';
import SearchBar from './components/SearchBar';
import Dropdown from './components/Dropdown';
import Spinner from './components/Spinner';
import LyricsBox from './components/LyricsBox';

// spotify
const CLIENT_ID = "7a507811507a40808833cf3ba9962c96";
const CLIENT_SECRET = "2c86fd15ef1a41b4a58d082b8cfd135a";

function App() {
  const [searchTerm, setSearchTerm] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [accessToken, setAccessToken] = useState(null);
  const [tracks, setTracks] = useState([]);
  const [selectedTrack, setSelectedTrack] = useState(null);
  const [lyrics, setLyrics] = useState(''); // Add lyrics to state
  const [romanizedLyrics, setRomanizedLyrics] = useState('');

  const [isScraping, setIsScraping] = useState(false);
  const [isRomanizing, setIsRomanizing] = useState(false);

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
    if (searchTerm.trim() !== '') {
      setShowDropdown(true);
      search();
    }
  };

  const handleTrackClick = (track) => {
    setIsScraping(true);
    setSelectedTrack(track);
    setShowDropdown(false);
  };

    
  async function fetchAndLogLyrics() {
    const title = selectedTrack.name; // replace with your title
    const artist = selectedTrack.artists.map(artist => artist.name).join(', '); // Use selected track's artists

    try {
        const response = await fetch(`/api/lyrics?artist=${artist}&title=${title}`);
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error);
        }
        const data = await response.json();
        setIsScraping(false);
        setLyrics(data.lyrics); // Set processed lyrics in state
      } catch (error) {
        console.error('Error fetching lyrics:', error.message);
        setLyrics("No lyrics found."); // Set default lyrics in state
    }
  }

  useEffect(() => {
    if (selectedTrack) {
      console.log(`Song Title: ${selectedTrack.name}, Artist: ${selectedTrack.artists.map(artist => artist.name).join(', ')}`);
      fetchAndLogLyrics(selectedTrack);
    }
  }, [selectedTrack]);

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

  const handleRomanizeClick = async () => {
    setIsRomanizing(true);
    try {
        const response = await fetch('/api/romanize', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ text: lyrics, sourceLanguage: 'ja' }), // Assuming the source language is Japanese
        });
        const data = await response.json();
        setRomanizedLyrics(data.romanizedText);
    } catch (error) {
        console.error('Error romanizing lyrics:', error.message);
    } finally {
      setIsRomanizing(false);
    }
  };

  useEffect(() => {
    if (romanizedLyrics) {
      // Replace three or more newlines with two newlines
      const formattedLyrics = romanizedLyrics.replace(/\n{3,}/g, '\n\n').trim();
      setLyrics(formattedLyrics); // Update the state with formatted lyrics
    }
  }, [romanizedLyrics]);  
  
  
  return (
    <div className="app">
      <div className='gradient-bg'></div>
      
      <Header />
  
      <main className="body-div">
        

        <div className="w-1/5 flex flex-col justify-end">
          {selectedTrack && (
            <img 
              src={selectedTrack.album.images[0].url} // Assuming this URL structure
              alt={selectedTrack.name} 
              className="w-full h-auto rounded-r-lg" // Full width and responsive height
            />
          )}
        </div>

        <div className="w-3/5 flex flex-col">
          <div className="top">
            <button className="text-1xl font-bold" onClick={searchGenius}>Genius</button>
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

          <div className="flex-grow flex items-end w-full justify-center">
            <LyricsBox 
              selectedTrack={selectedTrack}
              lyrics={lyrics}
              isScraping={isScraping}
              handleRomanizeClick={handleRomanizeClick}
              isRomanizing={isRomanizing}
            />
          </div>
        </div>

        <div className="w-1/5">
          {/* Right section content */}
        </div>
      </main>
    </div>
  );
  
  
  
}

export default App;
import KeyGuide from './components/KeyGuide';
import './App.css';
import Page from './components/Page';
import { useState, useEffect } from 'react';
import { data } from 'autoprefixer';
const { GoogleGenerativeAI } = require("@google/generative-ai");


const geminiApiKey = process.env.REACT_APP_GEMINI_API_KEY;
const geniusAccessToken = process.env.REACT_APP_GENIUS_ACCESS_TOKEN;

// Check if environment variables are set
const envVarsSet = geminiApiKey && geniusAccessToken;

const genAI = geminiApiKey ? new GoogleGenerativeAI(geminiApiKey) : null;
const model = genAI ? genAI.getGenerativeModel({ model: "gemini-1.5-flash" }) : null;


function App() {
  const [searchTerm, setSearchTerm] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [tracks, setTracks] = useState([]);
  const [selectedTrack, setSelectedTrack] = useState(null);
  const [lyrics, setLyrics] = useState(''); // Add lyrics to state
  const [romanizedLyrics, setRomanizedLyrics] = useState('');

  const [isSearching, setIsSearching] = useState(false);
  const [isScraping, setIsScraping] = useState(false);
  const [isRomanizing, setIsRomanizing] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState(null);
  const [modalTitle, setModalTitle] = useState('');

  const openModal = (title, content) => {
    setModalTitle(title);
    setModalContent(content);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setModalContent(null);
    setModalTitle('');
  };

  // search with genius
  async function search() {
    if (!envVarsSet) {
      console.error('Environment variables are not set.');
      return;
    }

    console.log("Searching for: " + searchTerm);

    try {
      const response = await fetch(`/api/search?searchTerm=${searchTerm}`);
      const data = await response.json();
      console.log(data); 

      if (response.ok) {
        setTracks(data.tracks)
        setIsSearching(false);
      } else {
        console.error('Error fetching tracks:', data.error);
        setTracks([]);
      }
    } catch (error) {
      console.error('Error fetching tracks:', error.message);
    }
  }

  //always update search bar
  const handleInputChange = (event) => {
    setSearchTerm(event.target.value);
    if (searchTerm.trim() === '') {
      setShowDropdown(false);
    }
  };

  //pressed 'enter' on search bar
  const handleKeyDown = (event) => {
    if (event.key === 'Enter' && searchTerm.trim() !== '') {
      if (!envVarsSet) {
        openModal('API Keys', <KeyGuide />)
        return;
      } else {
        setShowDropdown(true);
        setIsSearching(true);
        search();
      }
    }
  };

  //search button
  const handleSearchClick = () => {
    if (searchTerm.trim() !== '') {
      if (!envVarsSet) {
        openModal('API Keys', <KeyGuide />)
        return;
      } else {
        setShowDropdown(true);
        setIsSearching(true);
        search();
      }
    }
  };

  //dropdown option clicked
  const handleTrackClick = (track) => {
    setIsScraping(true);
    
    setSelectedTrack(track);
    setShowDropdown(false);
  };

  //change title
  useEffect(() => {
    if (selectedTrack) {
      document.title = `${selectedTrack.title} - ${selectedTrack.primary_artist_names} | UtacyLyrics`;
    } else {
      document.title = 'UtacyLyrics';
    }
  }, [selectedTrack]);
  
  //scrape lyrics using fetched url
  async function fetchLyrics(url) {
    try {
      const response = await fetch(`/api/lyrics?url=${encodeURIComponent(url)}`);
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error);
      }
      const data = await response.json();
      setIsScraping(false);
      setLyrics(data.lyrics); // Set processed lyrics in state
      console.log(data.lyrics);
    } catch (error) {
      console.error('Error fetching lyrics:', error.message);
      setLyrics("No lyrics found."); // Set default lyrics in state
    }
  }

  useEffect(() => {
    if (selectedTrack) {
      console.log(`Song Title: ${selectedTrack.title}, Artist: ${selectedTrack.primary_artist_names}`);
      fetchLyrics(selectedTrack.url); // Assuming 'track.url' contains the track's URL
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

  useEffect(() => {
    if (romanizedLyrics) {
      setLyrics(romanizedLyrics);
      setIsScraping(false);
      setIsRomanizing(false);
    }
  }, [romanizedLyrics]);  

  async function romanize() {
    setIsScraping(true);
    setIsRomanizing(true);
    console.log("Romanizing lyrics...");

    const prompt = "Romanize the following song lyrics. Do not change any words outside of characters and do not modify the newlines. Keep titles as they are and do not add any ##. The style of romanization depends on the song context. \n\n" + lyrics;
  
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    setRomanizedLyrics(text);
  }
  
  return (
    <Page
      isModalOpen={isModalOpen}
      openModal={openModal}
      closeModal={closeModal}
      modalTitle={modalTitle}
      modalContent={modalContent}

      selectedTrack={selectedTrack}
      searchTerm={searchTerm}
      handleInputChange={handleInputChange}
      handleKeyDown={handleKeyDown}
      handleSearchClick={handleSearchClick}
      showDropdown={showDropdown}
      tracks={tracks}
      handleTrackClick={handleTrackClick}
      lyrics={lyrics}

      isSearching={isSearching}
      isScraping={isScraping}
      isRomanizing={isRomanizing}
      romanize={romanize}
    />
  );
  
}

export default App;
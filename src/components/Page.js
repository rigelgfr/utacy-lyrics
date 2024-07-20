// Page.js

import React from 'react';

import Header from './Header';
import SearchBar from './SearchBar';
import Dropdown from './Dropdown';
import LyricsBox from './LyricsBox';
import LoopingBackground from './LoopingBackground';
import Modal from './Modal';

import '../App.css';

const Page = ({
  isModalOpen,
  openModal,
  closeModal,
  modalTitle,
  modalContent,
  selectedTrack,
  searchTerm,
  handleInputChange,
  handleKeyDown,
  handleSearchClick,
  showDropdown,
  tracks,
  handleTrackClick,
  lyrics,
  isScraping,
  isRomanizing,
  romanize
}) => {
  return (
    <div className="app">
      <Modal isOpen={isModalOpen} onClose={closeModal} title={modalTitle} content={modalContent} />

      <Header openModal={openModal}/>
  
      <main className="body-div">
        <LoopingBackground />
        <div className='gradient-bg'></div>

        <div className="w-1/5 flex flex-col justify-end z-10">
          {selectedTrack && (
            <img 
              src={selectedTrack.header_image_url} // Assuming this URL structure
              alt={selectedTrack.title} 
              className="w-full h-auto rounded-r-lg" // Full width and responsive height
            />
          )}
        </div>

        <div className="w-3/5 flex flex-col">
          <div className="top">
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
              isRomanizing={isRomanizing}
              romanize={romanize}
            />
          </div>
        </div>

        <div className="w-1/5">
          {/* Right section content */}
        </div>
      </main>
    </div>
  );
};

export default Page;

import React from 'react';
import Spinner from './Spinner'; // Assuming Spinner is a separate component
import '../App.css';

const LyricsBox = ({ selectedTrack, lyrics, isScraping, handleRomanizeClick, isRomanizing }) => {
    return (
        <div className="main-box overflow-y-auto">
              {selectedTrack ? (
                <div className="lyrics-container">
                  <pre>{lyrics}</pre>
                </div>
              ) : (
                <div className="placeholder-container">
                  {isScraping ? (
                      <Spinner />
                  ) : (
                      <p>Search for a song</p>
                  )}
                </div>
              )}

              {/* New div for title, artist, and album */}
              {selectedTrack && (
                <div className="metadata-div flex">
                  <div className="w-1/5"></div> {/* Left empty div */}
                  <div className="w-3/5 text-center flex flex-col items-center">
                    <h3 className="text-lg font-semibold">{selectedTrack.name}</h3>
                    <p className="text-sm">
                      {selectedTrack.artists.map(artist => artist.name).join(', ')} - {selectedTrack.album.name}
                    </p>
                  </div>
                  <div className="w-1/5 flex justify-end">
                    <button
                      onClick={handleRomanizeClick}
                      disabled={isRomanizing}
                      className={`text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 inline-flex items-center ${isRomanizing ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                      {isRomanizing && (
                          <Spinner />
                      )}
                      {isRomanizing ? 'Loading...' : 'Romanize'}
                    </button>
                  </div>
                </div>
              )}

            </div>
    );
};

export default LyricsBox;

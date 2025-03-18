import React from 'react';

import Spinner from './Spinner'; // Assuming Spinner is a separate component

import geniusIcon from '../img/icon/genius_icon.svg';

import '../App.css';

const LyricsBox = ({ selectedTrack, lyrics, isScraping, isRomanizing, romanize, isRomanized }) => {
    return (
        <div className="main-box overflow-y-auto scroll-smooth">
            {selectedTrack ? (
                <div className="lyrics-container">
                    {isScraping ? (
                        <div className="spinner-container flex items-center justify-center h-full w-full">
                            <Spinner /> {/* Show Spinner if scraping */}
                        </div>
                    ) : (
                        <pre>{lyrics}</pre> // Display lyrics if available
                    )}
                </div>
            ) : (
                <div className="placeholder-container">
                    {!lyrics ? (
                        <p>Search for a song</p>
                    ) : (
                        <Spinner /> // Show Spinner if no track is selected and scraping
                    )}
                </div>
            )}
    
            {/* New div for title, artist, and album */}
            {selectedTrack && (
                <div className="metadata-div flex justify-end items-end">
                    <div className="w-1/6">
                        <a href={selectedTrack.url} target='_blank' rel='noopener noreferrer'>
                            <img src={geniusIcon} alt="Genius Page" className="w-8 h-8 ml-2 transition ease-in-out hover:scale-110 duration-200" />
                        </a>
                            
                    </div> {/* Left empty div */}
                    <div className="w-4/6 text-center flex flex-col items-center">
                        <h3 className="text-lg font-semibold">{selectedTrack.title}</h3>
                        <p className="text-sm">
                            {selectedTrack.primary_artist_names}
                        </p>
                    </div>
                    <div className="w-1/6 flex justify-end items-end">
                        <button
                            onClick={romanize}
                            disabled={isRomanizing || isRomanized}
                            className={`h-10 text-white bg-zinc-900 hover:bg-zinc-800 focus:ring-white transition duration-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 inline-flex items-center ${(isRomanizing || isRomanized) ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                            {isRomanizing && (
                                <Spinner />
                            )}
                            {isRomanizing ? 'Romanizing...' : isRomanized ? 'Romanized' : 'Romanize'}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default LyricsBox;

import searchIcon from '../img/icon/search.svg';

const SearchBar = ({ searchTerm, handleInputChange, handleKeyDown, handleSearchClick }) => (
  <div className='relative'>
    <input
      type="text"
      className="search-bar"
      placeholder="Search for a song or artist..."
      value={searchTerm}
      onChange={handleInputChange}
      onKeyDown={handleKeyDown}
    />
    <button 
      className="search-button"
      onClick={handleSearchClick}
    >
      <img src={searchIcon} alt="Search" className="w-6 h-6 filter invert" />
    </button>
  </div>
);

export default SearchBar;

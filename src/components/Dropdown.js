const Dropdown = ({ tracks, handleTrackClick }) => (
    <div className="absolute bg-white shadow-md w-full overflow-y-auto max-h-80">
      <ul className="dropdown-items">
        {tracks.map((track) => (
          <li key={track.id} className="px-4 py-2 cursor-pointer flex items-center" onClick={() => handleTrackClick(track)}>
            <span className="mr-2">
              <img src={track.album.images[2].url} alt={track.name} />
            </span>
            <span>{track.name}</span>
          </li>
        ))}
      </ul>
    </div>
  );
  
  export default Dropdown;
  
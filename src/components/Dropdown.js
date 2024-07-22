import Spinner from './Spinner';

const Dropdown = ({ tracks = [], handleTrackClick, isSearching }) => (
  <div className="dropdown-div">
    {isSearching ? (
      <div className="px-4 py-2 cursor-pointer flex items-center justify-center divide-y divide-none bg-zinc-700 bg-opacity-80 h-8">
        <Spinner />
      </div>
    ) : (
      <ul className="dropdown-items">
        {tracks.map((track) => (
          <li key={track.id} className="px-4 py-2 cursor-pointer flex items-center" onClick={() => handleTrackClick(track)}>
            <span className="mr-2">
              <img src={track.header_image_thumbnail_url} alt={track.title} className="w-8 h-8 object-cover" />
            </span>
            <span className="text-white">{track.title}</span>
          </li>
        ))}
      </ul>
    )}
  </div>
);

export default Dropdown;

import keyIcon from '../img/key.svg';
import questionIcon from '../img/help-circle.svg';

const Header = () => (
  <header className="text-white py-4 px-6 shadow-md flex items-center justify-between">
    <h1 className="text-1xl font-bold">UtacyLyrics</h1>
    <div className="flex space-x-4">
      <button>
        <img src={keyIcon} alt="First Button" className="w-6 h-6" />
      </button>
      <button>
        <img src={questionIcon} alt="Second Button" className="w-6 h-6" />
      </button>
    </div>
  </header>
);

export default Header;

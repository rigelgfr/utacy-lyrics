import keyIcon from '../img/key.svg';
import questionIcon from '../img/help-circle.svg';
import '../App.css';

const Header = () => (
  <header className="header">
    <h1 className="text-1xl font-bold">UtacyLyrics</h1>
    <div className="flex space-x-4">
      <button>
        <img src={keyIcon} alt="First Button" className="w-6 h-6 invert" />
      </button>
      <button>
        <img src={questionIcon} alt="Second Button" className="w-6 h-6 invert" />
      </button>
    </div>
  </header>
);

export default Header;

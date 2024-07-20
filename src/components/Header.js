import keyIcon from '../img/key.svg';
import questionIcon from '../img/help-circle.svg';
import KeyGuide from './KeyGuide';
import About from './About';

import '../App.css';

const Header = ({ openModal }) => (
  <header className="header">
    <h1 className="text-1xl font-bold">UtacyLyrics</h1>
    <div className="flex space-x-4">
      <button onClick={() => openModal('API Keys', <KeyGuide />)}>
        <img src={keyIcon} alt="First Button" className="w-6 h-6 invert transition ease-in-out hover:scale-110 duration-200"  />
      </button>
      <button onClick={() => openModal('About', <About />)}>
        <img src={questionIcon} alt="Second Button" className="w-6 h-6 invert transition ease-in-out hover:scale-110 duration-200" />
      </button>
    </div>
  </header>
);

export default Header;

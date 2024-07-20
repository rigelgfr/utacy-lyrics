import keyIcon from '../img/key.svg';
import questionIcon from '../img/help-circle.svg';
import KeyGuide from './KeyGuide';
import About from './About';
import logo from '../img/logo.jpg';


import '../App.css';

const Header = ({ openModal }) => (
  <header className="header">

    <div className='flex flex-row items-center'>
      <img src={logo} alt="logo" className="w-8 rounded-lg"></img>
      <h1 className="text-1xl font-bold ml-1">UtacyLyrics</h1>

    </div>
   
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

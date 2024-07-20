import React from 'react';
import banner from '../img/banner3.png';
import logo from '../img/logo.jpg';

const About = () => (
  <div className='text-zinc-300'>
    <p>UtacyLyrics is a music web app that allows you to search for lyrics of your favorite songs. The app also provides the feature to romanize lyrics in native characters to the Latin alphabet. Our goal is to provide a seemless sing-along experience for users who can't read lyrics outside of their native language. The system utilizes Genius API for its large song, metadata, and lyric metadata. For romanization, the Gemini text generation API is used.</p>
    <p className='mt-4 text-center text-xl font-bold text-violet-400'>[Reminder that romanized lyrics can still be incorrect as the AI is not perfect]</p>
    <div className='flex justify-center mt-6'>
      <img src={banner} className='' alt='Banner' />
      
    </div>
    <p className='text-center mt-2 text-xs'>© 2024 Utacy. All rights reserved.</p>
    {/* Add more about content here */}
  </div>
);

export default About;

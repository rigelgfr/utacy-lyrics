import React from 'react';
import envImg from '../img/image/env.webp';

const KeyGuide = () => (
  <div className='text-zinc-300'>
    <p><span className='font-bold'>The Genius and Gemini API is essential in order for this application to work.</span> Paste your API keys in the .env file and restart the application.</p>
    <img src={envImg} className='shadow-2xl mt-4' alt='env'></img>
    <p className='mt-4'>Genius API access token can be found <a href='https://genius.com/api-clients' target='_blank' rel='noopener noreferrer' alt='genius.com' className='text-violet-400 hover:underline'>here</a>. Create a new API Client, fill out the form, and generate access token.</p>
    <p className='mt-2'>Gemini API key can be found <a href='https://aistudio.google.com/app/apikey' target='_blank' rel='noopener noreferrer' alt='genius.com' className='text-violet-400 hover:underline'>here</a>. Create a new API key and choose to either create a new project or use an existing one.</p>
  </div>
);

export default KeyGuide;

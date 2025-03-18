# <img src="/img/image/logo.webp" width="30" alt="UtacyLyrics Logo" /> UtacyLyrics

UtacyLyrics is a music web application that allows users to search for lyrics of their favorite songs. The app also provides a feature to romanize lyrics in native characters to the Latin alphabet, creating a seamless sing-along experience for users who can't read lyrics outside of their native language.

![UtacyLyrics Banner](/src/img/image/banner3.webp)

## Features

- **Lyric Search**: Find lyrics for songs across various languages and artists
- **Lyric Romanization**: Convert lyrics in native characters to Latin alphabet for easier pronunciation
- **User-Friendly Interface**: Simple and intuitive React-based UI
- **Comprehensive Database**: Leverages Genius API for extensive song and lyric metadata

## Screenshots

![Empty](/src/img/screenshots/1.png)

![Searched song](/src/img/screenshots/2.png)

![Romanized lyrics](/src/img/screenshots/3.png)


## Tech Stack

- React.js
- TailwindCSS
- Genius API (for song and lyric metadata)
- Gemini API (for text romanization)

## Running the Application

Set up environment variables:
   - Create a `.env` file in the root directory
   - Add your API keys:
     ```
     REACT_APP_GENIUS_API_KEY=your_genius_api_key
     REACT_APP_GEMINI_API_KEY=your_gemini_api_key
     ```
![Environment Setup](/src/img/image/env.webp)

To start the application, run the following commands:

1. Build the application:
   ```
   npm run build
   ```

2. Start the server in a new terminal window:
   ```
   npm run server
   ```

3. Start the development server:
   ```
   npm start
   ```

4. Open your browser and navigate to `http://localhost:3000`

## API Integration

### Genius API
UtacyLyrics uses the Genius API to fetch song information, metadata, and lyric data. The API provides access to a vast database of songs across multiple languages and genres.

### Gemini API
The app utilizes Gemini's text generation API for romanization capabilities, allowing users to read and sing along with lyrics in unfamiliar scripts.
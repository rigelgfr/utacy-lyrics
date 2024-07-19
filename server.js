require('dotenv').config();
const { GoogleAuth } = require('google-auth-library');
const rateLimit = require('express-rate-limit');

const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const app = express();
const port = 5000;

app.use(express.json());

const GENIUS_ACCESS_TOKEN = process.env.REACT_APP_GENIUS_ACCESS_TOKEN;

// Rate limiting configuration
const characterLimit = 100000; // 100,000 characters
const minute = 60 * 1000; // 1 minute in milliseconds

app.get('/api/search', async (req, res) => {
    const { searchTerm } = req.query;

    if (!searchTerm) {
        return res.status(400).json({ error: 'Search term is required' });
    }

    try {
        const response = await axios.get('https://api.genius.com/search', {
            params: {
                q: searchTerm
            },
            headers: {
                'Authorization': `Bearer ${GENIUS_ACCESS_TOKEN}`
            }
        });

        if (response.data.response.hits.length === 0) {
            return res.status(404).json({ error: 'No tracks found' });
        }

        const tracks = response.data.response.hits.map(hit => hit.result);
        res.json({ tracks });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error fetching tracks' });
    }
});

app.get('/api/lyrics', async (req, res) => {
    const { url } = req.query;

    if (!url) {
        return res.status(400).json({ error: 'Track URL is required' });
    }

    try {
        const lyricsResponse = await axios.get(url);
        const lyrics = extractLyricsFromHtml(lyricsResponse.data);
        res.json({ lyrics });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error fetching lyrics' });
    }
});

async function getAccessToken() {
    const auth = new GoogleAuth({
        keyFile: process.env.GOOGLE_APPLICATION_CREDENTIALS,
        scopes: ['https://www.googleapis.com/auth/cloud-translation']
    });

    const client = await auth.getClient();
    const accessToken = await client.getAccessToken();
    return accessToken.token;
}

const limiter = rateLimit({
    windowMs: minute,
    max: characterLimit, // Limit each IP to characterLimit requests per `window` (here, per minute)
    keyGenerator: (req) => {
        return req.ip; // Use the user's IP address as the key
    },
    handler: (req, res) => {
        res.status(429).json({ error: 'Rate limit exceeded. Try again later.' });
    },
    // Custom function to count the characters in the request
    keyLength: (req) => {
        return req.body.text.length;
    }
});

// Endpoint to romanize text
// Apply the rate limiter to the romanize route
app.post('/api/romanize', limiter, async (req, res) => {
    const { text, sourceLanguage } = req.body;
    const projectId = 'utacy-lyrics'; // Replace with your project ID
    const location = 'global'; // The location for Indonesia

    try {
        const accessToken = await getAccessToken();
        const url = `https://translation.googleapis.com/v3/projects/${projectId}/locations/${location}:romanizeText`;

        // Split text by newlines to preserve them
        const lines = text.split('\n');
        const romanizedLines = [];

        for (const line of lines) {
            if (line.trim() === '') {
                romanizedLines.push(''); // Preserve empty lines
                continue;
            }
            const response = await axios.post(url, {
                source_language_code: sourceLanguage,
                contents: [line]
            }, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            });

            const romanizedText = response.data.romanizations[0].romanizedText;
            romanizedLines.push(romanizedText);
        }

        const romanizedText = romanizedLines.join('\n');
        res.json({ romanizedText });
    } catch (error) {
        console.error('Error romanizing text:', error.response ? error.response.data : error.message);
        res.status(500).json({ error: 'Error romanizing text' });
    }
});

function extractLyricsFromHtml(html) {
    const $ = cheerio.load(html);
    let lyrics = $('div[class="lyrics"]').text().trim();
    if (!lyrics) {
        lyrics = '';
        $('div[class^="Lyrics__Container"]').each((i, elem) => {
            if ($(elem).text().length !== 0) {
                let snippet = $(elem)
                    .html()
                    .replace(/<br>/g, '\n')
                    .replace(/<(?!\s*br\s*\/?)[^>]+>/gi, '');
                lyrics += $('<textarea/>').html(snippet).text().trim() + '\n\n';
            }
        });
    }
    return lyrics.trim();
}

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});

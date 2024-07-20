require('dotenv').config();

const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const app = express();
const port = 5000;

app.use(express.json());

const GENIUS_ACCESS_TOKEN = process.env.REACT_APP_GENIUS_ACCESS_TOKEN;

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

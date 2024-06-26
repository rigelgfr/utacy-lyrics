const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const app = express();
const port = 5000;

app.use(express.json());

app.get('/api/lyrics', async (req, res) => {
    const { title, artist } = req.query;

    if (!title || !artist) {
        return res.status(400).json({ error: 'Title and artist are required' });
    }

    try {
        const response = await axios.get('https://api.genius.com/search', {
            params: {
                q: `${title} ${artist}`
            },
            headers: {
                'Authorization': `Bearer lUlvBOiGEFiAeRvnMlUzrvN34mG6JkYW0relP2TC9tbBXkYf-kayW6WOyrurWMtg`
            }
        });

        if (response.data.response.hits.length === 0) {
            return res.status(404).json({ error: 'No lyrics found' });
        }

        const songUrl = response.data.response.hits[0].result.url;
        const lyricsResponse = await axios.get(songUrl);
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

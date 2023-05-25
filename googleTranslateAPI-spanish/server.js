const express = require('express')
const app = express()
const port = 4000 || process.env.PORT
const cheerio = require('cheerio');
const axios = require('axios')
const translateAPI = require('@vitalets/google-translate-api');


// Function to translate text to Spanish



app.get('/', (req, res) => res.send('Hello World!'))

app.get('/text', (req, res) => {

    const links = [
        'https://lmnottryhard.github.io/HyperX/',

    ];

    async function extractAndTranslateText(url) {
        try {
            const response = await axios.get(url);
            const html = response.data;
            const $ = cheerio.load(html);
            $('script, style').remove();
            const extractedText = $('body').text().replace(/\s+/g, ' ').trim();

            translateAPI.translate(extractedText, { to: 'es' }).then(res => {
                console.log(res.text);

            }).catch(err => {
                console.error('err', err);
            });

        } catch (error) {
            console.error('Error:', error);
        }
    }
    links.forEach((url) => {
        extractAndTranslateText(url);
    });
    res.send('good')
})

app.listen(port, () => console.log(`Example app listening on port http://localhost:${port}`))
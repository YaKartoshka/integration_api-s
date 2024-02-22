const express = require('express');
const app = express();
var crypto = require('crypto');
const port = 3000;
const { Client } = require('intercom-client');
const client_id = '6588eae9-0d6a-4477-a644-138c72b8ff62';
const client_secret = 'e7f5ace2-9869-4c97-a6e8-52b0522028bd';
const request = require('request');
const { convert } = require('html-to-text');
var access_token;

generateSK = function () {
    var sk = crypto.randomBytes(20).toString('hex');
    return sk;
}

app.get('/', (req, res) => res.send('Hello World'));

app.get('/redirect', async (req, res) => {
    var code = req.query.code;

    var options = {
        'method': 'POST',
        'url': `https://api.intercom.io/auth/eagle/token?code=${code}&client_id=${client_id}&client_secret=${client_secret}`,
        'headers': {
        }
    };
    request(options, function (error, response) {
        if (error) throw new Error(error);
        var data = JSON.parse(response.body);
        access_token = data.access_token;
        res.sendStatus(200);
    });
});

app.get('/client', (req, res) => {
    var state = generateSK();
    var redirect_url = `https://app.intercom.com/oauth?client_id=${client_id}&state=${state}`;
    res.redirect(redirect_url);
});

app.get('/get_articles', async (req, res) => {
    const client = new Client({ tokenAuth: { token: access_token } });
    const response = await client.articles.list({
        page: 1,
        perPage: 12,
    });
    var articles = response.data;
    articles.forEach(x => {
        var title = x.title;
        var content = convert(x.body);
        console.log(x.id, title, content);
    });
    res.sendStatus(200);
});

app.listen(port, () => console.log(`App listening on port ${port}!`));
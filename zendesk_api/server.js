const express = require('express');
const app = express();
const zendesk = require('node-zendesk');
const port = 3000;
const request = require('request');
var access_token;


app.get('/', (req, res) => res.send('Hello World'));

app.get('/redirect', async (req, res) => {

    var options = {
        'method': 'POST',
        'url': 'https://d3v-ailabs.zendesk.com/oauth/tokens',
        'headers': {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            "grant_type": "authorization_code",
            "code": req.query.code,
            "client_id": "zdg-webapi",
            "client_secret": "dcde64be6c82459165c442fe07c2ec54662151d2c133638611ec252299f90b41",
            "redirect_uri": "https://586d-77-245-106-188.ngrok-free.app/redirect",
            "scope": "read"
        })
    };
    request(options, function (error, response) {
        if (error) throw new Error(error);
        console.log(response.body);
        res.send(response.body)
        access_token = JSON.parse(response.body).access_token;
    });
});

app.get('/client', (req, res) => {
    var url = 'https://d3v-ailabs.zendesk.com/oauth/authorizations/new?client_id=zdg-webapi&redirect_uri=https://586d-77-245-106-188.ngrok-free.app/redirect&response_type=code&scope=users:read+hc:read+hc:write';
    res.redirect(url);
});

app.get('/get_articles', (req, res) => {
    var articles = [];
    var client = zendesk.createClient({
        token: '3cb516a753dafb74eadc22845e11b7cccce3838d47363ad9a296c31fbe94d484',
        oauth: true,
        subdomain: 'd3v-ailabs',
        apiType: ['helpcenter'],
    });
    // console.log(client.helpcenter.articles)
    client.helpcenter.articles.list().then((data) => {
        data.forEach((article) => {
            articles.push(article);
            console.log(article)
        });
    }).then(() => {
        res.send(articles);
    }).catch((e)=>{
        console.log(e)
        res.send(e)
    });
});

app.listen(port, () => console.log(`App listening on port ${port}!`));
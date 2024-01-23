const express = require('express');
const app = express();
const zendesk = require('node-zendesk');
const port = 4000;
const request = require('request');
var access_token;


app.get('/', (req, res) => res.send('Hello World'));

app.get('/redirect', async (req, res) => {

    var options = {
        'method': 'POST',
        'url': 'https://ailabssupport.zendesk.com/oauth/tokens',
        'headers': {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            "grant_type": "authorization_code",
            "code": req.query.code,
            "client_id": "webapi",
            "client_secret": "945df1e82a60c113f69fd5c92ec13117a53f01a5f2ce5d182a6cac5d16abb596",
            "redirect_uri": "https://ed65-77-245-104-174.ngrok-free.app/redirect",
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
    var url = 'https://ailabssupport.zendesk.com/oauth/authorizations/new?client_id=webapi&redirect_uri=https://ed65-77-245-104-174.ngrok-free.app/redirect&response_type=code&scope=users:read+hc:read+hc:write';
    res.redirect(url);
});

app.get('/get_articles', (req, res) => {
    var articles = [];
    var client = zendesk.createClient({
        username: 'era123',
        token: access_token,
        subdomain: 'ailabssupport',
        oauth: true,
        apiType: ['helpcenter'],
    });

    client.helpcenter.articles.list().then((data)=>{
        articles.push(data);
    }).then(()=>{
        res.send(articles);
    });
});

app.listen(port, () => console.log(`App listening on port ${port}!`));
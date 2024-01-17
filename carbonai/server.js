const express = require('express')
const app = express();
const Carbon = require('carbon-connect-js');
const port = 4000;
const apiKey = '66a2cb3c349b8abe34e87dff658ddc98ec7f55cdc49b11803ed48e75925c5307';

app.get('/', (req, res) => res.send('Hello World'));

app.get('/carbon_cm_add', (req, res) => {
  var r = { r: 200 };
  var customerId = 123 // webapi user id
  Carbon.generateAccessToken({
    apiKey,
    customerId,
    environment: 'PRODUCTION',
  }).then((response) => {
    if (response.status == 200) {
      var accessTokenResponse = response.data.access_token; // keep it in database
      console.log('access token: ' + accessTokenResponse)
      res.send(JSON.stringify(accessTokenResponse));
    } else {
      accessTokenResponse = null;
      r['r'] = 0;
      res.send(JSON.stringify(r))
    }
  });
});

app.get('/integration/auth', async (req, res) => {
  var r = { r: 200 };
  var access_token = req.query.access_token; 
  var zendeskSubdomain = 'ailabssupport'
  try {
    const response = await Carbon.generateOauthurl({
      accessToken: access_token,
      integrationName: 'DROPBOX', 
       // Accepted values are: NOTION, GOOGLE_DRIVE, ONEDRIVE, INTERCOM,
       // DROPBOX, ZENDESK, BOX, CONFLUENCE, SHAREPOINT, ZOTERO
      optionalParams: {
        zendeskSubdomain: zendeskSubdomain
      }
    });
  
    if (response.status === 200) {
      res.redirect(response.data.oauth_url);
    } else {
      r['r'] = 0;
      res.send(JSON.stringify(r));
      return;
    }
  } catch (err) {
    console.error('Unexpected error:', err.message);
  }
})

app.get('/get_user_connections', (req, res) => {
  var r = { r: 200 };
  var access_token = req.query.access_token;
  Carbon.getUserConnections({ accessToken: access_token, environment: 'PRODUCTION' }).then((connections) => {
    console.log(connections.connections);
    res.send(JSON.stringify(r));
  });
});

app.get('/get_text', (req,res)=>{
  var r = { r: 200 };
  var access_token = req.query.access_token;
  var user_file_id = '' // file id
  
  Carbon.getUserFiles({ accessToken: access_token, environment: 'PRODUCTION' }).then((file) => {
    console.log(file.data.results)
    Carbon.getTextChunks({ accessToken: access_token, userFileId: file.data.results[0].id }).then((text) => {
      console.log(text.data.results);
      res.send(JSON.stringify(r));
    })
  })

})


app.listen(port, () => console.log(`App listening on port ${port}!`));
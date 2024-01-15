const express = require('express')
const app = express();
const Carbon = require('carbon-connect-js');
const port = 4000;
const apiKey = '66a2cb3c349b8abe34e87dff658ddc98ec7f55cdc49b11803ed48e75925c5307';
var customerId = 'webapi'




function getDocuments(con) {
  // console.log(con.connections[0].synced_files);
  // Carbon.getTextChunks({accessToken: accessTokenResponse, userFileId: con.connections[0].synced_files.external_file_id}).then((text)=>{
  //   console.log(text)
  // })
  Carbon.getUserFiles({ accessToken: accessTokenResponse, environment: 'PRODUCTION' }).then((file) => {

    Carbon.getTextChunks({ accessToken: accessTokenResponse, userFileId: file.data.results[1].id }).then((text) => {
      console.log(text.data.results)
    })
  })
}

async function generateIntegrationOAuthURL() {

}



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
      res.send(JSON.stringify(r))
    } else {
      accessTokenResponse = null;
      r['r'] = 0;
      res.send(JSON.stringify(r))
    }
  });
});

app.get('/zendesk/auth', async (req, res) => {
  var r = { r: 200 };
  var access_token =  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9';   //req.body.access_token;
  try {
    const response = await Carbon.generateOauthurl({
      accessToken: access_token,
      integrationName: 'ZENDESK',
      optionalParams: {
        zendeskSubdomain: 'ailabssupport'
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

app.get('/get_user_connections', (req,res)=>{
  var access_token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJvcmdhbml6YXRpb25faWQiOjEyOTEsImN1c3RvbWVyX2lkIjoxMjkxLCJvcmdhbml6YXRpb25fc3VwcGxpZWRfdXNlcl9pZCI6IjEyMyIsIm9yZ2FuaXphdGlvbl91c2VyX2lkIjozNjY1NSwiZXhwIjoxNzA1MzM3ODMyfQ.Bv1Zw9ZZzGKBj-dq-qR6hrM65FTxIpemZU4D8IuZu-k'
  Carbon.getUserConnections({ accessToken: access_token, environment: 'PRODUCTION' }).then((connections) => {
      console.log(connections.connections)
  })
})


app.listen(port, () => console.log(`App listening on port ${port}!`));
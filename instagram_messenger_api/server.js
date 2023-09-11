const request = require("request");
const express = require("express");
const axios = require('axios');
const body_parser = require("body-parser");
const app = express();
const path = require('path');

var user_token;
var page_id;
var access_token;
var last_recipient;

app.use(body_parser.json());
app.use(body_parser.urlencoded({ extended: true }));
app.use(express.json());


app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname + '/index.html'));
});

app.post('/configure_webhook', (req, res) => {
  user_token = req.body.user_token;
  console.log(user_token);
  var options = {
    'method': 'GET',
    'url': `https://graph.facebook.com/v16.0/me/accounts?access_token=${user_token}`,
    'headers': {
    }
  };

  request(options, function (error, response) {
    if (error) throw new Error(error);
    console.log(JSON.parse(response.body));
    page_id = JSON.parse(response.body).data[0].id;
    access_token = JSON.parse(response.body).data[0].access_token;
  });
})

app.post("/webhook", async (req, res) => {
  let body = req.body;
  console.log(body.entry[0].messaging[0]);
  let recipient = body.entry[0].messaging[0].sender.id;
  last_recipient = recipient;
  // console.log(req.body.entry[0].messaging[0]);
  // console.log(page_id + " " + access_token)

  // var options = {
  //   'method': 'POST',
  //   'url': `https://graph.facebook.com/v16.0/${page_id}/messages?access_token=${access_token}`,
  //   'headers': {
  //     'Content-Type': 'application/json'
  //   },
  //   body: JSON.stringify({
  //     "recipient": {
  //       "id": `${recipient}`
  //     },
  //     "message": {
  //       "attachment": {
  //         "type": "template",
  //         "payload": {
  //           "template_type": "generic",
  //           "elements": [
  //             {
  //               "title": "Welcome!",
  //               "subtitle": "We have the right hat for everyone.",
  //               "buttons": [
  //                 {
  //                   "type": "postback",
  //                   "title": "View Website 123 tset awdl alwd dalwdsd lld awd mlsd amwlds dmawldm",
  //                   "payload": "DEVELOPER_DEFINED_PAYLOAD"
  //                 },
  //                 {
  //                   "type": "postback",
  //                   "title": "Start Chatting",
  //                   "payload": "DEVELOPER_DEFINED_PAYLOAD"
  //                 }
  //               ]
  //             }
  //           ]
  //         }
  //       }
  //     }
  //   })
  // };
  // request(options, function (error, response) {
  //   if (error) throw new Error(error);
  //   console.log(response.body)
  // });


});

app.get("/webhook", (req, res) => {
  const verify_token = "hello";
  let mode = req.query["hub.mode"];
  let token = req.query["hub.verify_token"];
  let challenge = req.query["hub.challenge"];

  if (mode && token) {

    if (mode === "subscribe" && token === verify_token) {

      console.log("WEBHOOK_VERIFIED");
      res.status(200).send(challenge);
    } else {

      res.sendStatus(403);
    }
  }
});

app.post('/send_message', (req, res) => {
  const msg = req.body.msg;

  var hello = "hey";
  var options = {
    'method': 'POST',
    'url': `https://graph.facebook.com/v16.0/${page_id}/messages?access_token=${access_token}`,
    'headers': {
    },
    body: JSON.stringify({
      "recipient": {
        "id": `${last_recipient}`
      },
      "message": {
        "text": hello,
      }
    })
  };
  request(options, function (error, response) {
    if (error) throw new Error(error);
  });
  res.sendStatus(200);
});

app.get('/get-instagram-id', (req, res) => {
  var page_id = 111758261888868;

  var options = {
    'method': 'GET',
    'url': `https://graph.facebook.com/v16.0/${page_id}?fields=instagram_business_account&access_token=${user_token}`,
    'headers': {
    }
  };
  request(options, function (error, response) {
    if (error) throw new Error(error);
    console.log(response.body);
    res.send(response.body);

  });
})

router.get('/get-insta-profile', (req, res) => {
  var instagram_id = "17841455280187448";
  var access_token = "EAATYsedF4CYBO4ZCZAgAEc70YX3XCl6fB0UZC19zvnCiFwbwx8vsGDYxWf6a4lpcXeSfjWKyZCjZAjEF4R5TgPGAPtVwCZCqWMCcX6i2tlZBhYzc1N09iqwgPwfHQx1eLTb9nbQvu3q0zsP1P6srBZAYENqLzdJEI8uFSQZBrnze5DZBfkr3g86CrO6ww2dDUldqZCDJhvRUg5myZAMIkkmntAZDZD";
  var options = {
    'method': 'GET',
    'url': `https://graph.facebook.com/v16.0/${instagram_id}?fields=name%2Cusername%2Cbiography%2Cfollowers_count%2Cprofile_picture_url%2Cmedia_count&access_token=${access_token}`,
    'headers': ''
  };

  request(options, function (error, response) {
    if (error) throw new Error(error);
    res.send(response.body);  
    /*  response.body:
      {
        "name": "Erasyl Zarubekov",
        "username": "chatbotik_insta",
        "followers_count": 2,
        "profile_picture_url": "https://scontent.fnqz1-1.fna.fbcdn.net/v/t51.2885-15/376768488_859069635577306_6193881127827181138_n.jpg?_nc_cat=110&ccb=1-7&_nc_sid=86c713&_nc_ohc=iLGecXYdw9kAX-yaqRg&_nc_ht=scontent.fnqz1-1.fna&edm=AL-3X8kEAAAA&oh=00_AfD3prprRjPlSOxvDTEMsSbphWvCKnAbxJnKDSsCEku6pQ&oe=650463AB",
        "media_count": 0,
        "id": "17841455280187448"
      }
    */
  });
});


app.listen(process.env.PORT || 2000, () => console.log("webhook is listening"));

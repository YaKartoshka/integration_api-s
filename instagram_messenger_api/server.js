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
  res.sendFile(path.join(__dirname + '/index.html'))
});

app.post('/configure_webhook', (req, res) => {
  user_token = req.body.user_token;

  var options = {
    'method': 'GET',
    'url': `https://graph.facebook.com/v16.0/me/accounts?access_token=${user_token}`,
    'headers': {
    }
  };

  request(options, function (error, response) {
    if (error) throw new Error(error);
    page_id = JSON.parse(response.body).data[0].id;
    access_token = JSON.parse(response.body).data[0].access_token;
  });
})

app.post("/webhook", async (req, res) => {
  let body = req.body;
  let recipient = body.entry[0].messaging[0].sender.id;
  last_recipient = recipient;
  console.log(req.body.entry[0].messaging[0]);
  // console.log(page_id + " " + access_token)

  var options = {
    'method': 'POST',
    'url': `https://graph.facebook.com/v16.0/${page_id}/messages?access_token=${access_token}`,
    'headers': {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      "recipient": {
        "id": `${recipient}`
      },
      "message": {
        "attachment": {
          "type": "template",
          "payload": {
            "template_type": "generic",
            "elements": [
              {
                "title": "Welcome!",
                "subtitle": "We have the right hat for everyone.",
                "buttons": [
                  {
                    "type": "postback",
                    "title": "View Website 123 tset awdl alwd dalwdsd lld awd mlsd amwlds dmawldm",
                    "payload": "DEVELOPER_DEFINED_PAYLOAD"
                  },
                  {
                    "type": "postback",
                    "title": "Start Chatting",
                    "payload": "DEVELOPER_DEFINED_PAYLOAD"
                  }
                ]
              }
            ]
          }
        }
      }
    })
  };
  request(options, function (error, response) {
    if (error) throw new Error(error);
    console.log(response.body)
  });

  res.end();
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
    'url': `https://graph.facebook.com/v16.0/${page_id}?fields=instagram_business_account&access_token=EAATYsedF4CYBOZCuukHJZC9nxZASm8dkIcysDc5aGC0ZBA3evNZBk8IooZCOhtxRoqZCvreGtvdgrksDroLagn5yYbxIFiya3Y89ZBiTmUgpbFsdQjRzuInzvJ5Pi8t4pfooNtvVqg98cBVeiO9beUehlkP54Pzj7TaQcgnQ090vj2SoA6zcH1r4qG78PmoAofnO8vyKzzeu9NZAgJnSXtAZDZD`,
    'headers': {
    }
  };
  request(options, function (error, response) {
    if (error) throw new Error(error);
    console.log(response.body);
    res.send(response.body);

  });
})


app.listen(process.env.PORT || 2000, () => console.log("webhook is listening"));

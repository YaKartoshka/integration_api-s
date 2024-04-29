const request = require("request");
const express = require("express");
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


app.post("/webhook", async (req, res) => {
  let body = req.body;
  console.log(req.body.entry[0].changes[0].value) // main object
  if (req.body.entry[0].changes[0].value.messages) { // if user texted
    console.log(req.body.entry[0].changes[0].value.messages[0].text.body) // text of message
    console.log(req.body.entry[0].changes[0].value.messages[0].from) // sender
    var options = {
      'method': 'POST',
      'url': 'https://graph.facebook.com/v18.0/101441162720915/messages',
      'headers': {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer EAAWkji7QfbsBO6sYfYOnGD52OUMOt5nAdWPfvDqAKfqzvOBevoI6sDaO1CPoIWnrmsIEyreGqTrw7P1lZAugVEl8iU9qn3EYoMgBZCkMsiSQMW1sNS8Q2mmUPKkbkHZA0nMbgO8ZBrpFZARC5ZAukVYxtoCWnJNktZAFS0EqCzdqRycLwp2nktAFnmYlaXg0ZAJZAwkTBVaAJCKE5ekQObAcz0q3rzZCEZD'
      },
      body: JSON.stringify({
        "messaging_product": "whatsapp",
        "to": "787779537464",
        "type": "template",
        "template": {
          "name": "hello_world",
          "language": {
            "code": "en_US"
          }
        }
      })

    };
    request(options, function (error, response) {
      if (error) throw new Error(error);
      console.log(response.body);
    });

 
  }
  res.sendStatus(200);

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




app.listen(process.env.PORT || 2000, () => console.log("webhook is listening"));

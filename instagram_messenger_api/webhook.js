const token = "EAALCZBnmL4jwBAIMlCXcXLKOg4qryaX1BXk4j6zRKdZCFvBmBQZCvsBRDHYrsNVyJm1S2jf86Bb5bf5kA1B7RZA4FJ7YF3uqqZCc4lK5Mn7DZA7Kp7kOvHcLzQfv3riPSvGwfF2RdqGIfDtDi5WxrclOouZCpJwK7Q54g1j1NAY0mytRNsE3ZALUMtignhmEZAMzOTtMuR93WiD9sNopSu3OI";
const page_id="111936868302837"
const request = require("request"),
  express = require("express"),
  axios=require('axios'),
  body_parser = require("body-parser"),
  app = express().use(body_parser.json());

app.listen(process.env.PORT || 2000, () => console.log("webhook is listening"));

app.post("/webhook", async(req, res) => {
  let body = req.body;
  let to=body.entry[0].messaging[0].sender.id
    
    var options = {
    'method': 'POST',
    'url': `https://graph.facebook.com/v15.0/${page_id}/messages?recipient={id: ${to}}&message={text: "\\u0048\\u0065\\u006c\\u006c\\u006f"}&access_token=${token}`,
    'headers': {
    }
    };
     request(options, function (error, response) {
     if (error) throw new Error(error);
     console.log(response.body);
     });

  

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

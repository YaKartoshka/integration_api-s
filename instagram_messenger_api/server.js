const token = "EAATYsedF4CYBABuu8QLd6rsfxShu88nDXOyR4xxjZC7nxAUncPA1ZBDqPd3D8SrnVd4iZC5WZAQZAElVgK6YkZAI52rUS1bIc0Lot2R3dQBMHdR5hdkVtFbgCbMnPCOlEAE6dSHZC5i4ZCASXOtXhZAlyMevlCNVZBhfXsvwZAHu8GhX0OupyDqRSPp708uCepeOhI8MmQ7ekMgWF1lM0mEnaS5ZC3fnz1BNYMQZD";
const page_id="111758261888868";

const request = require("request"),
  express = require("express"),
  axios=require('axios'),
  body_parser = require("body-parser"),
  app = express().use(body_parser.json());
const path=require('path')
app.listen(process.env.PORT || 2000, () => console.log("webhook is listening"));

app.get('/',(req,res)=>{
  res.sendFile(path.join(__dirname + '/index.html'))
})


app.post("/webhook", async(req, res) => {
  let body = req.body;
  let recipient=body.entry[0].messaging[0].sender.id
  console.log(req.body)
  console.log(req.body.entry[0].messaging[0])
 
    
    var options = {
      'method': 'POST',
      'url': `https://graph.facebook.com/v16.0/${page_id}/messages?recipient={id: ${recipient}}&message={text: "hello"}&access_token=${token}`,
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

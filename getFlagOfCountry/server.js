const express = require("express");
const MessagingResponse = require("twilio").twiml.MessagingResponse;
const accountSid = "ACa81a3237d7d5dd2d354d5bae5750d1c0";
const { lookup } = require('geoip-lite');
const path = require('path')
const bodyParser = require("body-parser");
var data={}
const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
const port = process.env.PORT || 3000;

app.get('/', (req,res)=>{
    res.sendFile(path.join(__dirname+'/index.html'))
})

app.post("/getCountry", async (req, res) => {
    const ip = req.body.ip
    const country = lookup(ip);
    data['country_data'] = country;
    res.send(data);
});

app.listen(port, () => {
  console.log("App is listening at host: http://localhost:3000");
});

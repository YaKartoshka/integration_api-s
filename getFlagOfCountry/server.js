const express = require("express");
const MessagingResponse = require("twilio").twiml.MessagingResponse;
const accountSid = "ACa81a3237d7d5dd2d354d5bae5750d1c0";
const { lookup } = require('geoip-lite');
const request=require('request')
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
    
    var country_data=lookup(ip)
    var country_code=country_data.country.toLowerCase();
    res.send(country_data)
      // `https://ipdata.co/flags/${country_code}.png`
   
});

app.get('/flags/:code',(req,res)=>{
  const code = req.params.code
  res.sendFile(path.join(__dirname+`/flags/${code}`))


})

app.listen(port, () => {
  console.log("App is listening at host: http://localhost:3000");
});

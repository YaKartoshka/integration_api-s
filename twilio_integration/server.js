const express = require('express');
const MessagingResponse = require('twilio').twiml.MessagingResponse;
const accountSid="ACa81a3237d7d5dd2d354d5bae5750d1c0"
const authToken="13456d42cfc6bfcb1474332cf6b2938e"
const bodyParser=require('body-parser')
const client = require('twilio')(accountSid, authToken);

const app = express();
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
const port = process.env.PORT || 3000;

app.get('/', async (req, res) => {
    console.log("get", req);
    client.messages 
      .create({ 
        body: 'Thank you for submitting your order. To finalize your payment, please tap below to call or visit our website.',
        from: 'whatsapp:+14155238886',  
        ButtonText:'hello',     
         to: 'whatsapp:+77779537464' 
       }) 
      .then(message => console.log(message.sid)) 
      .done();

    res.send('hello')
});

app.post('/sms', (req, res) => {
  console.log("post",req.body);
 
  const response = new MessagingResponse();

  response.message('The Robots are coming! Head for the hills!');
  res.set("Content-Type", "application/xml");
  res.send(response.toString());
});

app.listen(port, () => {
    console.log('App is listenint at host: http://localhost:3000')
})
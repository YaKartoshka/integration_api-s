# Twilio Integration with Node.js 

## Useful_links
1) [Quick start with Node.js ](https://www.twilio.com/docs/whatsapp/quickstart/node) 
2) [Messages API](https://www.twilio.com/docs/sms/api/message-resource) 
3) [Parsing an Incoming Twilio SMS Webhook with Node.js](https://www.twilio.com/blog/parsing-an-incoming-twilio-sms-webhook-with-node-js)
 
 
## 1) First step: Create account on Twilio
After sign up, you will get your account_sid, twilio_number and auth_token. All of them are neccesseary to make out REST API
Link to registration: (https://www.twilio.com/try-twilio)
## 2) Second step: Creating your Whatsapp number
Follow this link: (https://console.twilio.com/us1/develop/sms/try-it-out/whatsapp-learn?frameUrl=%2Fconsole%2Fsms%2Fwhatsapp%2Flearn%3Fx-target-region%3Dus1)
Then follow all steps and you will get access for using this number.   
Also there will be place to put your webhook url.

After that put this code inside a server.js file:
```
const http = require('http');
const express = require('express');
const { urlencoded } = require('body-parser');
const MessagingResponse = require('twilio').twiml.MessagingResponse;

const app = express();
app.use(urlencoded({ extended: false }));

app.get('/',(req,res)=>{
    client.messages
      .create({
         from: 'whatsapp:+14155238886',
         body: 'Hello there!',
         to: 'whatsapp:+15005550006'
       })
      .then(message => console.log(message.sid));
  res.send("hello")
})

app.post('/', (req, res) => {
  const twiml = new MessagingResponse();

  if (req.body.Body == 'hello') {
    twiml.message('Hi!');
  } else if (req.body.Body == 'bye') {
    twiml.message('Goodbye');
  } else {
    twiml.message(
      'No Body param match, Twilio sends this in the request to your server.'
    );
  }

  res.type('text/xml').send(twiml.toString());
});

http.createServer(app).listen(3000, () => {
  console.log('Express server listening on port 3000');
});
 ``` 
 Then make all console commands:
 
```
npm i twilio express body-parser http
```
With req.body we get a request with sender data and you can do anything you want.  
Run your express app. Your webhook will need to be visible from the internet in order for Twilio to send requests to it. We will use ngrok for this, which you’ll need to install if you don’t have it. [Dowload ngrok](https://ngrok.com/download). In your terminal run the following command:
```
ngrok http 3000
```

With webhook running, we’re ready for main part - testing our webhook!


# Twilio Integration with Node.js 

##Useful_links
1) Quick start with Node.js (https://www.twilio.com/docs/sms/quickstart/node) 
2) Messages API (https://www.twilio.com/docs/sms/api/message-resource) 
 
 
## 1) First step: Create account on Twilio
After sign up, you will get your account_sid, twilio_number and auth_token. All of them are neccesseary to make out REST API
Link to registration: (https://www.twilio.com/try-twilio)

## 2) Second step: Implement code for creating messages
You should create server.js file and package.json files.  
Then in console run this:
```
npm i twilio
```
After that put this code inside a server.js file:
```
const accountSid = "Your account SID";
const authToken = "Your auth token";
const client = require('twilio')(accountSid, authToken);

client.messages
      .create({
      body: 'Hi there', 
      from: 'Put your twilio number that located in console', 
      to: 'put a receiver number'})
      .then(message => console.log(message.sid));
```
## 3) Third step: Create a webhook to receive message and also reply
At first we shoud create express app with this code:
 ```
 const express = require('express');
const { MessagingResponse } = require('twilio').twiml;

const app = express();

app.post('/sms', (req, res) => {
  const twiml = new MessagingResponse();

  // Access the message body and the number it was sent from.
  console.log(`Incoming message from ${req.body.From}: ${req.body.Body}`);

  twiml.message('The Robots are coming! Head for the hills!');

  res.writeHead(200, {'Content-Type': 'text/xml'});
  res.end(twiml.toString());
});

app.listen(3000, () => {
  console.log('Express server listening on port 3000');
});
 ``` 
Your webhook will need to be visible from the internet in order for Twilio to send requests to it. We will use ngrok for this, which you’ll need to install if you don’t have it. In your terminal run the following command:
```
ngrok http 3000
```
After that we need to set our webhook to our twilio number. For that follow these steps:
1) Follow this link: (https://console.twilio.com/)  
2) Phone Numbers -> Manage -> Active Numbers
3) Click to your twilio number and you will see your configure
4) Scroll down to the Messaging panel and you will see Webhook input
5) Set your webhook inside the field "A MESSAGE COMES IN" then save shanges by "save" button.

With webhook running, we’re ready for main part - testing our webhook!


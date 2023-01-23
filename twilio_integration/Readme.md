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

  twiml.message('The Robots are coming! Head for the hills!');

  res.type('text/xml').send(twiml.toString());
});

app.listen(3000, () => {
  console.log('Express server listening on port 3000');
});
 ``` 
Then we have to install Twilio CLI to connect webhook to the twilio number
```
npm install -g twilio-cli
```
After that run this to login:
```
twilio login
```
Then run this for connection between number and webhook:
```
twilio phone-numbers:update "your_number" --sms-url="http://localhost:1337/sms"
```
Make sure that you run both of them(webhook,twilio command)  
With both of those servers running, we’re ready for the fun part - testing our new Express application!


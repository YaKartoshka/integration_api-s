# Twilio Integration with Node.js 

## Useful_links
1) [Quick start with Node.js ](https://www.twilio.com/docs/whatsapp/quickstart/node) 
2) [Messages API](https://www.twilio.com/docs/sms/api/message-resource) 
3) [Parsing an Incoming Twilio SMS Webhook with Node.js](https://www.twilio.com/blog/parsing-an-incoming-twilio-sms-webhook-with-node-js)

 
## 1) First step: Create account on Twilio
After sign up, you will get your account_sid, twilio_number and auth_token. All of them are neccesseary to make out REST API  
Link to registration: (https://www.twilio.com/try-twilio)  


## 2) Second step: Creating your twilio number

When you signed in you will get your first twilio number for your goals. After that you should create your own Messaging service 
Follow this link: https://console.twilio.com/us1/develop/sms/try-it-out/get-set-up?frameUrl=%2Fconsole%2Fsms%2Fget-setup%3Fx-target-region%3Dus1  
Then try to send your message from your twilio number to your current phone number which was used for registration.
But It was just free trial and we should upgrade our account to get rid of limitations. 
Follow this link: [Upgrade](https://console.twilio.com/us1/billing/manage-billing/billing-overview?frameUrl=%2Fconsole%2Fbilling%3Fx-target-region%3Dus1) -> Billing -> Upgrade
After upgrading we need enable geo permissions in everywhere by this [link](https://console.twilio.com/us1/develop/sms/settings/geo-permissions)
## 3) Setting webhook to your twilio number
You have to create server.js file that will be our webhook.
Put this code inside a server.js file:
```
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
  console.log("post",req.body.Body);
 
  const response = new MessagingResponse();

  response.message('The Robots are coming! Head for the hills!');
  res.set("Content-Type", "application/xml");
  res.send(response.toString());
});

app.listen(port, () => {
    console.log('App is listenint at host: http://localhost:3000')
})
 ``` 
 req.body - all data of the received message  
 req.body.Body - only received message text

 Then make all console commands:
 
```
npm i twilio express body-parser http
```

With req.body we get a request with sender data and you can do anything you want.  
Run your express app. Your webhook will need to be visible from the internet in order for Twilio to send requests to it. We will use ngrok for this, which you’ll need to install if you don’t have it. [Dowload ngrok](https://ngrok.com/download). In your terminal run the following command:
```
ngrok http 3000
```
If you already have the twilio number ->
After that we need to set our webhook to our twilio number. For that follow these steps:
1) Follow this link: (https://console.twilio.com/)  
2) Phone Numbers -> Manage -> Active Numbers and find your purchased number
3) Click to your twilio number and you will see your configure
4) Scroll down to the Messaging panel and you will see Webhook input
5) Set your webhook inside the field "A MESSAGE COMES IN" then save shanges by "save" button.

If you don't have the twilio number ->
1) Follow this link: (https://console.twilio.com/)  
2) Phone Numbers -> Manage -> Buy a number
3) Buy a number that you would like and save
4) Phone Numbers -> Manage -> Active Numbers and find your purchased number
5) Click to your twilio number and you will see your configure
6) Scroll down to the Messaging panel and you will see Webhook input
7) Set your webhook inside the field "A MESSAGE COMES IN" then save shanges by "save" button.
  
With webhook running, we’re ready for main part - testing our webhook!

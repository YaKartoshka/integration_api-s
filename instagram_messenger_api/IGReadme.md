# Integration Instagram Messenger API

## Useful links
- [All functions of the Instagram messenger platform](https://developers.facebook.com/docs/messenger-platform/instagram/features)  
- [Grah api explorer](https://developers.facebook.com/tools/explorer/)  
- [Freeform Messaging Types for Instagram Messaging](https://developers.facebook.com/docs/messenger-platform/instagram/features/send-message)  
- [Webhooks for Messenger Platform(NodeJs)](https://developers.facebook.com/docs/messenger-platform/webhooks)  
- [Example of Instagram support in API Messenger](https://developers.facebook.com/docs/messenger-platform/instagram/sample-experience)

## Limitations
- Instagram messaging is available for the author's professional account, which has less than 500,000 subscribers.
- Without extended access, you can write and receive messages from a user only if he has a role in this application
- Access tokens have a limited validity period  
- If the interval of your last conversation with the recipient exceeds 24 hours, you will not be able to send messages to him until the sender starts the conversation himself.


## 1) Create developer account ON Facebook and Instagram professional account
[Create a facebook developer account](https://developers.facebook.com/docs/development/register/)  
After creating account you have to create your facebook page [Create a page](https://www.facebook.com/pages/?category=your_pages&ref=bookmarks)

Now let's create an Instagram account.(https://www.instagram.com/)  
After creating an Instagram account, you need to go to Settings -> Account -> Add new professional account(switch to professional account)  
Choose a professional account of author!
Then it is neccesary to make connection between Facebook developer account and your Instagram account.  
Go to (Settings-> Account -> Sharing to other apps ) and choose your facebook account.  
In profile click Edit Profile, then in Profile Information connect your facebook page to your instagram account  
If you did all steps right in Profile information your facebook page will be displayed.  
Also make sure that you enabled Access to messages. For checking that navigate to Settings -> Privacy -> Messages and in the bottom you will see that option. Enable it  
**Done! You connected your accounts**

## 2) Get started with Instagram Messenger API

Add neccessary products to your App:  Messenger, Login via Facebook  
And follow this link and do all steps (https://developers.facebook.com/docs/messenger-platform/instagram/get-started)  
Before starting I advise to create another facebook account and instagram account for testing your App.  
You will get your user access token, page access token and page_id 

## 3) Set a webhook
To create a webhook you shound navigate to Application panel and add **Webhooks**.  
Webhooks is neccessary to receive and send messages.  
After setting Webhooks on the left side click on Webhooks then you should choose Instagram section instead of User and subscribe to messages and messaging_postbacks. Then you should add your webhook link in this panel. For this click Edit subscription put your url and access token. Example of the webhook provided in server.js
Your configuration should looks like:  
URL: https://your_webhook_name/webhook  
Access token: secret123  
Before clicking save button make sure that you webhook is running otherwise you will get errors.  
If everything was correct in your server console where webhook is running you will get the message such as WEBHOOK_VERIFIED   
In my server.js already provided sample of webhook that will auto reply to incoming messages.  
## 4) Send a message

By this [link](https://developers.facebook.com/docs/messenger-platform/instagram/features/send-message) You can start conversation. But within the limits of what is allowed  
You can send a free-form message that contains:
- media files, such as images or videos uploaded to the Meta social graph or from a website;
- reaction or sticker;
- text, including links.  
This is a curl post request fro sending a message
```
curl -i -X POST "https://graph.facebook.com/LATEST-API-VERSION/PAGE-ID/messages
  ?recipient={id: IGSID}
  &message={text: TEXT-OR-LINK}
  &access_token=PAGE-ACCESS-TOKEN" 
```
**IGSID - Instagram sender id** - you can get this only when webhook capture the message 
**PAGE-ACCESS-TOKEN - you already have got in second step, also you can get page access token on** [Graph API Explorer](https://developers.facebook.com/tools/explorer/)




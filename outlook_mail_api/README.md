# Outlook webhook and REST API 

This sample demonstrates how to use [MSAL Node](https://www.npmjs.com/package/@azure/msal-node) to login, logout and acquire an access token for a protected resource such as Microsoft Graph.

## Useful links
1) [Webhook docs](https://learn.microsoft.com/ru-ru/graph/api/subscription-post-subscriptions?view=graph-rest-1.0&tabs=http)  
2) [Messages Endpoints](https://learn.microsoft.com/en-us/graph/api/user-list-messages?view=graph-rest-1.0&tabs=http)  
3) [Move Message](https://learn.microsoft.com/en-us/graph/api/message-move?view=graph-rest-1.0&tabs=http)  
4) [GRAPH API Docs](https://learn.microsoft.com/en-us/graph/overview?view=graph-rest-1.0)  

## Requirements
1) You should have microsoft 365 account with licence Business Standard [Create account](https://www.microsoft.com/ru-ru/microsoft-365/business/compare-all-microsoft-365-business-products?activetab=tab%3Aprimaryr2&market=ru)  
2) Knowledge about how to use the GRAPH API  

## Create your application in Azure and get secrets and IDs
1) Move to Microsoft Azure website and sign in with your Microsoft 365 account
2) Follow these steps to create app: Azure Active Directory -> App Registrations -> New Registration  
3) Fill the form and for Supported account types choose 'Accounts in any organizational directory (Any Azure AD directory - Multitenant) and personal Microsoft accounts (e.g. Skype, Xbox)'  
Now you have your first app    
Move to Overview and you will see your Client ID and Tenant ID  
To create a secret you should move to Certificates & secrets  
Press new client secret button and get your secret.(Save it right away after it will be hidden)  

## Set Permissions
1) Move to API Permissions and then press Add permission
2) Choose Microsoft Graph and you will need some of delegated permissions and application permissions
3) List of permissions:
   1. Delegated:  email, offline_access, openid, profile, Mail.ReadWrite, User.Read, Mail.Read, Mail.ReadBasic .
   2. Application: Mail.Read, Mail.ReadBasic, Mail.ReadBasic.All, Mail.ReadWrite

### Set Auth for getting access token
Follow this [link](https://portal.azure.com/#view/Microsoft_AAD_RegisteredApps/ApplicationMenuBlade/~/Quickstart/appId/4a81ea5e-a41e-483e-bdae-3bdd2328a6cf/isMSAApp~/false) and repeat all the steps  
After that you will be able to get an access token from those who have logged in.  
Make sure that you set valid URLs  

## Running the sample

1. Configure authentication and authorization parameters:
   1. Open `App/.env`
   1. Replace the string `"Enter_the_Application_Id_Here"` with your app/client ID on AAD Portal.
   1. Replace the string `"Enter_the_Cloud_Instance_Id_Here"` with `"https://login.microsoftonline.com/"`
   1. Replace the string `"Enter_the_Tenant_Info_Here"` with your tenant ID on AAD Portal.
   1. Replace the string `"Enter_the_Client_Secret_Here"` with your client secret on AAD Portal.
1. Configure the parameters for calling MS Graph API:
   1. Replace the string `"Enter_the_Graph_Endpoint_Here"` with `"https://graph.microsoft.com/"`
1. Configure the Express session secret:
   1. Replace the string `"Enter_the_Express_Session_Secret_Here"` with a hard to guess value, such as your client secret.
1. To start the sample application, run `npm start`.
1. Finally, open a browser and navigate to [http://localhost:3000](http://localhost:3000).

## Retrieve the access token
In fetch.js you get access_token after auth process  
Then you can use that for start doing requests.  

## Webhook( subscription )
Set your webhook and endpoint must respond with 200 OK to validation request. It is important to verify your webhook    
Here is the sample of webhook:
```
console.log(req)
    console.log(req.body)
    const validationToken = req.query.validationToken;
    res.status(200).send(validationToken)
```
After that you can change logic of your webhook without changing endpoint  
For setting the webhook you should create subscription for that:    
```
curl --location 'https://graph.microsoft.com/v1.0/subscriptions' \
--header 'Content-Type: application/json' \
--header 'Authorization: Bearer {YOUR_ACCESS_TOKEN}' \
--data '{
   "changeType": "created",
   "notificationUrl": "{YOUR WEBHOOK URL}",
   "resource": "chats/getAllMessages?model=A",
   "expirationDateTime":"2023-08-26T18:23:45.9356913Z",
   "clientState": "secretClientValue",
   "latestSupportedTlsVersion": "v1_2"
}'
```
Now you can receive new created messages in main using your webhook  

## Retrieve Message by id
It's quite simple. You need your access token and after send request for this endpoint using message id:  
```
curl --location 'https://graph.microsoft.com/v1.0/me/messages/{MESSAGE_ID}' \
--header 'Authorization: Bearer {YOUR_ACCESS_TOKEN}'
```
Then you will receive all message data   

## Move message to folder
You need to know the ID of the folder you want to move the message to  
For this list all folders and then retrieve id of the folder
```
curl --location 'https://graph.microsoft.com/v1.0/me/mailFolders' \
--header 'Authorization: Bearer {YOUR_ACCESS_TOKEN}'
https://graph.microsoft.com/v1.0/me/mailFolders
```
Then with folder ID you will be able to move message
```
curl --location --globoff 'https://graph.microsoft.com/v1.0/me/messages/{message-id}/move' \
--header 'Content-Type: application/json' \
--header 'Authorization: Bearer YOUR_ACCESS_TOKEN' \
--data '{
    "destinationId": "folder ID"
}'
```


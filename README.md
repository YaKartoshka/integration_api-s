# integration_jsforce_api-s
JSforce is a isomorphic JavaScript Library utilizing Salesforce's API: It works both in browser and with Node.js.
## Quick Links
1. [JSForce and Nodejs Documentation](https://jsforce.github.io/document/)
2. [JSForce API Docs](http://jsforce.github.io/jsforce/doc/)
## 1) Create developer account in Salesforce and get Access_token
After creating an account to receive a token, we do these actions
Profile -> Settings -> My Personal Information -> Reset My Security Token
## 2) Should install packages for get started
```
npm i jsforce,dotenv
```
## 3) node js Configure
create .env file in your project then do this:
```
SF_LOGIN_URL= https://login.salesforce.com
SF_USERNAME='YOUR USERNAME'
SF_PASSWORD='YOUR PASSWORD'
SF_TOKEN='YOUR ACCESS TOKEN'
```
## 4) Sample Usage
in server.js
```
var jsforce = require('jsforce');

const {SF_LOGIN_URL,SF_USERNAME,SF_PASSWORD,SF_TOKEN}=process.env;
var conn = new jsforce.Connection({
    loginUrl : SF_LOGIN_URL,
    version: '42.0', --Your version
    
});
conn.login(SF_USERNAME, SF_PASSWORD+SF_TOKEN, function(err, userInfo) {
  if (err) { return console.error(err); }
  // Now you can get the access token and instance URL information.
  // Save them to establish connection next time.
  console.log(conn.accessToken);
  console.log(conn.instanceUrl);
  // logged in user property
  
  console.log("User ID: " + userInfo.id);
  console.log("Org ID: " + userInfo.organizationId);
  
});

```



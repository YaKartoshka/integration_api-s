# integration_jsforce_api-s
JSforce is a isomorphic JavaScript Library utilizing Salesforce's API: It works both in browser and with Node.js.
## Quick Links
1. [JSForce and Nodejs Documentation](https://jsforce.github.io/document/)
2. [JSForce API Docs](http://jsforce.github.io/jsforce/doc/)
3. [JSFORCE API ERROR API DISABLED](https://stackoverflow.com/questions/58200478/api-disabled-for-org-api-is-not-enabled-for-this-organization-or-partner)
## 1) Create developer account in Salesforce and get Access_token
For creating an account follow this link:
[Create developer account](https://developer.salesforce.com/signup)
After creating an account to receive a token, we do these actions
Profile -> Settings -> My Personal Information -> Reset My Security Token
## 2) Should install packages for get started
```
npm install jsforce, dotenv
```
## 3) node js Configure
create .env file in your project then do this:
```
SF_LOGIN_URL= https://login.salesforce.com
SF_USERNAME='YOUR USERNAME'
SF_PASSWORD='YOUR PASSWORD'
SF_TOKEN='YOUR ACCESS TOKEN'
```
## 4) Sample Usage(Connection)
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
## 5) Create Account Or Lead (EXAMPLE)
Create Account
```
 conn.sobject('Account').create({ Name: 'Test_Name' }, function(err, ret) {
    if (err || !ret.success) { return console.error(err, ret); }
    console.log("Created record id : " + ret.id);
    // ...
  });
```
Create Lead
```
conn.sobject('Lead').create({ FirstName : 'My Account #1', LastName:'Test', Company:'TestCorp' }, function(err, ret) {
    if (err || !ret.success) { return console.error(err, ret); }
    console.log("Created record id : " + ret.id);
    // ...
    });
```
Create Contact
```
conn.sobject('Contact').create({LastName: 'test_lname',Phone: '+77771234567'}, function(err, ret) {
      if (err || !ret.success) { return console.error(err, ret); }
      console.log("Created record id : " + ret.id);
      console.log(ret)
      // ...
    });
```



require('dotenv').config();
const express=require('express')
const jsforce = require('jsforce');
const app=express();

const {SF_LOGIN_URL,SF_USERNAME,SF_PASSWORD,SF_TOKEN}=process.env;

    /* Get Connection */

var conn = new jsforce.Connection({
    loginUrl : SF_LOGIN_URL,
    version: '42.0',
    
});

    /* Login to your account in Salesforce*/

conn.login(SF_USERNAME, SF_PASSWORD+SF_TOKEN, function(err, userInfo) {
  if (err) { return console.error(err); }
  // Now you can get the access token and instance URL information.
  // Save them to establish connection next time.
  console.log(conn.accessToken);
  console.log(conn.instanceUrl);
  // logged in user property
  
  console.log("User ID: " + userInfo.id);
  console.log("Org ID: " + userInfo.organizationId);

  createLead();
});

const lead={
    FirstName: 'test_fname',
    LastName: 'test_lname',
    Company: 'test_cname',
    Title: 'test_title',
    LeadSource:'test_source',
    Email: 'test@gmail.com',
    Website: 'https://test_website.com',
    Industry: 'Communications',
    State:'test_state',
    Rating: 'Hot',
    PostalCode:'test_pcode',
    Street: 'test_street',
    City:'test_city',
    Country:'test_country',
    Description:'test_description'
}

const createLead=()=>{
    conn.sobject('Lead').create(lead, function(err, ret) {
      if (err || !ret.success) { return console.error(err, ret); }
      console.log("Created record id : " + ret.id);
      console.log(ret)
      // ...
    });
  }
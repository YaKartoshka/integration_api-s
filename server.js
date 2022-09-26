require('dotenv').config();
const express = require('express');
const fs = require('fs');
const app=express();
const request = require('request');
const jsforce = require('jsforce');
const port=3000 || process.env.PORT;
var r={r:200};

const {SF_LOGIN_URL,SF_USERNAME,SF_PASSWORD,SF_TOKEN}=process.env;
var conn = new jsforce.Connection({
    loginUrl : SF_LOGIN_URL,
    version: '42.0',
    
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

app.post('/create/lead',async(req,res)=>{
    const firstName=req.body.first_name;
    const lastName=req.body.last_name;
    const company=req.body.company;
    const title=req.body.title;
    const phone=req.body.phone;
    const mobile=req.body.mobile;
    const fax=req.body.fax;
    const leadSource=req.body.lead_source;
    const email=req.body.email;
    const website=req.body.website;
    const industry=req.body.industry;
    const state=req.body.state;
    const rating=req.body.rating;
    const postalCode=req.body.postal_code;
    const street=req.body.street;
    const city=req.body.city;
    const country=req.body.country;
    const data=req.body;
    var data_array=['first_name', 'last_name','company','title','phone','lead_source','email','website','industry','state','rating','postal_code','street','state','mobile','fax','city','country','description'];
    data_array.forEach(key =>delete data[key]);
    console.log(data)
    if(lastName==undefined || company==undefined){
        r['r']=0;
        res.send(JSON.stringify(r));
    }else{
        
        const lead={
            FirstName: firstName,
            LastName: lastName,
            Company: company,
            Title: title,
            Phone: phone,
            Mobile: mobile,
            Fax: fax,
            LeadSource:leadSource,
            Email: email,
            Website: website,
            Industry: industry,
            State: state,
            Rating: rating,
            PostalCode: postalCode,
            Street: street,
            City: city,
            Country: country,
            Description: JSON.stringify(data)
        }
         conn.sobject("Lead").create(lead, function(err, ret) {
             if (err || !ret.success) { return console.error(err, ret); }
             console.log("Created record id : " + ret.id);
            
          });
          res.send(JSON.stringify(r));
    
    }
    
    
    
})

app.listen(port,()=>{
  console.log(`App listening at http://localhost:${port}`)
});
# integration_zoho_api

## Useful links:
1) REST API Docs(Records)-"https://www.zoho.com/crm/developer/docs/api/v3/get-records.html"
2)Zoho CRM-"https://www.zoho.com/crm/"
3)Register a client for getting access token-"https://www.zoho.com/crm/developer/docs/api/v3/register-client.html"

## 1) First step: Create Developer account
 Need to create zoho developer account
[Create a zoho account](https://www.zoho.com/crm/)

## 2) Second step: Create a Client to integrate with API
Follow the link:
[Add client](https://api-console.zoho.com/)

Then add client: Client type should be Server-based Applications
After fill in the fields you will get your client_id, client_secret and redirect_uri;

## 3) Third Step: Get Access Token

After creating your client follow this link 
(https://www.zoho.com/crm/developer/docs/api/v3/auth-request.html)
and follow all steps;
On the second step you can see the get method url like this:
```
"https://accounts.zoho.com/oauth/v2/auth?scope=ZohoCRM.users.ALL&client_id={client_id}&response_type=code&access_type={"offline"or"online"}&redirect_uri={redirect_uri}"
```
You should instead of "ZohoCRM.users.ALL" put "ZohoCRM.modules.ALL" to be able to use REST API.
And also put your client_id and your redirect_uri. Access_type should be equal to offline.
It is shown by this link
(https://www.zoho.com/crm/developer/docs/api/v3/get-records.html)
    
## 4) Fourth step: Start creating records using REST API

For this step We will use Postman

In Postman import post request from this curl:
```
curl "https://www.zohoapis.com/crm/v3/Leads?fields=Last_Name,Email&per_page=3"
-X GET
-H "Authorization: Zoho-oauthtoken 1000.8cb99dxxxxxxxxxxxxx9be93.9b8xxxxxxxxxxxxxxxf"
```
Instead of "1000.8cb99dxxxxxxxxxxxxx9be93.9b8xxxxxxxxxxxxxxxf" put your access Token
Fill in fields(Last_name,Email and etc)
Then make your first post request .



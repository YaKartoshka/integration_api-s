# Stripe API Integration

## Useful links:
1. [Stripe API DOCS](https://stripe.com/docs/api)
2. [Stripe test bank cards](https://stripe.com/docs/testing#cards)
3. 

## First step: Create a stripe account
Follow this [link](https://stripe.com/) then create your account.  
After that you will be redirected to your own dashboard where you can get your secret_key and other api keys.  
By clicking Developers -> API keys - you will find your keys.

##Second step: Set up your node.js server
Create your simple express app and after that install this dependency:
```
npm i stripe
```
After installing you need to set this dependency with your secret key:
```
const stripe = require("stripe")(
  "your secret key");
```
Now you can use stripe api for your goals.
##Third step: Sample of creating customers
```
app.post("/add_customer", async (req, res) => {
  const email = req.body.email;
  const description = req.body.description;

  const stripe = require("stripe")(
    "your secret key"
  );

  var customer_data = {
    description: description,
    email: email,
  };

  const customers = await stripe.customers.list({
    email: email,
  }); 
  
  if (customers.data[0] != undefined) { // We are checking that customer with such email does not exists
    console.log('Such customer already exists') 
  } else {
    const customer = await stripe.customers.create(
      customer_data,
      (err, customer) => {
        if (err) {
         console.log('error')
        } else {
         console.log('Customer is created')
        }
      }
    );
  }
});
```

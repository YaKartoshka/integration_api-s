const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const stripe = require("stripe")(
  "sk_test_51MeYDvJ9agDmEuO0Ho3e56fpJwp3kTntknx7D4frp3FxBYiV7AUltyHwfwt8WxuUhcoQyyYw8Wm71lAOeTfmN7kU00XMtvVWbI"
);
//You can get your secret key after registration  and you should move to this link: https://dashboard.stripe.com/test/apikeys
const path = require("path");
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
var r = {};

app.use("/stripe_api", express.static(__dirname));
app.use("/public", express.static(__dirname + "/stripe_api"));
app.use("/public", express.static(__dirname + "/public"));
app.get("/", async (req, res) => {
  res.sendFile(path.join(__dirname, "public/customer.html"));
});

app.get("/card", async (req, res) => {
  const customer_id = req.query.cid;

  // const charge = await stripe.charges.create({
  //   amount: 0100,
  //   currency: 'usd',
  //   customer: 'cus_NPPo5fjZ6YqyQt',
  //   card: 'card_1MebTFJ9agDmEuO03DvPUgjB',
  //   description: 'My First Test Charge (created for API docs at https://www.stripe.com/docs/api)',
  // });
  res.sendFile(path.join(__dirname + "/public/card.html"));
});

app.post("/add_payment_method", async (req, res) => {
  const card_number = req.body.card_number;
  const cid = req.body.cid;
  const exp_month = req.body.exp_month;
  const exp_year = req.body.exp_year;
  const cvc = req.body.cvc;

  try{
    const paymentMethod = await stripe.paymentMethods.create({
      type: "card",
      card: {
        number: card_number,
        exp_month: exp_month,
        exp_year: exp_year,
        cvc: cvc,
      },
    });

    var card_id=paymentMethod.id


     const cardAttach = await stripe.paymentMethods.attach(
    card_id,
    {customer: cid}
  );
  const customer = await stripe.customers.update(
    cid,
    {invoice_settings: {default_payment_method: card_id}}
  );
  
  const paymentIntent = await stripe.paymentIntents.create({
    amount: 1,
    currency: 'usd',
    customer: cid,
    payment_method: card_id,
    confirm:true,
    return_url:'http://localhost:4242',
    automatic_payment_methods: {enabled: true},
  });

  if(paymentIntent.status=='succeeded'){
    r['r']=1;
    console.log('success')
    res.send(JSON.stringify(r));
  }else{
    r['r']=0;
    console.log('error')
    res.send(JSON.stringify(r));
  }


  } catch(e){

    if(e.raw.code=='incorrect_number'){
      r['r']=0;
      console.log(e.raw.code)
      JSON.stringify(r)
    }else if(e.raw.code=='resource_missing'){
      r['r']=0;
      console.log(e.raw.code, 'or user does not exist')
      JSON.stringify(r)
    }else{
      r['r']=0;
      JSON.stringify(r)
    }
  }


 
  
});

app.post("/add_customer", async (req, res) => {
  const email = req.body.email;
  const description = req.body.description;

  const stripe = require("stripe")(
    "sk_test_51MeYDvJ9agDmEuO0Ho3e56fpJwp3kTntknx7D4frp3FxBYiV7AUltyHwfwt8WxuUhcoQyyYw8Wm71lAOeTfmN7kU00XMtvVWbI"
  );

  var customer_data = {
    description: description,
    email: email,
  };

  const customers = await stripe.customers.list({
    email: email,
  });

  if (customers.data[0] != undefined) {
    r["r"] = 2;
    console.log(customers.data[0].id)
    res.send(JSON.stringify(r));
  } else {
    const customer = await stripe.customers.create(
      customer_data,
      (err, customer) => {
        if (err) {
          r["r"] = 0;
          console.log(customer)
          res.send(JSON.stringify(r));
        } else {
          r["r"] = 1;
          r["cid"] = customer.id;
          res.send(JSON.stringify(r));
        }
      }
    );
  }
});

app.get('/getPayments/:cid', async(req,res)=>{
  const cid=req.params.cid
  try{
    const paymentIntents = await stripe.paymentIntents.list({
      customer: cid
    });
    const successful_payments=paymentIntents.data.filter((value)=>{
      return value.status=="succeeded"
    })
    console.log(successful_payments)
  res.send(cid)
  } catch(e){
    console.log(e)
    console.log(e.raw.code)
  }
  
  
})




app.listen(4242, () =>
  console.log("Node server listening on port http://localhost:4242")
);

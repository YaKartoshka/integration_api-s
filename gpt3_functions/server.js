const express = require("express");
const path = require('path')
const bodyParser = require("body-parser");
const gptAPIkey = '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';
var request = require('request');
const app = express();
const port = process.env.PORT || 4000;
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.get('/', (req, res) => {
    res.render('index');
});

app.post('/send_message', function (req, res) {
    let messages = req.body
  

    var options = {
        'method': 'POST',
        'url': 'https://api.openai.com/v1/chat/completions',
        'headers': {
            'Content-Type': 'application/json',
            'Authorization': 'Basic OnNrLW5lSzFHZzZ6Y1N2anJtUEpQN2N3VDNCbGJrRkp5TU1jUnU4b1ZjOE50OHNuektxbw=='
        },
        body: JSON.stringify({
            "model": "gpt-3.5-turbo-0613",
            "messages": messages,
            "functions": [
                {
                    "name": "get_current_weather",
                    "description": "Get the current weather in a given location",
                    "parameters": {
                        "type": "object",
                        "properties": {
                            "location": {
                                "type": "string",
                                "description": "The city and state, e.g. San Francisco, CA"
                            },
                            "unit": {
                                "type": "string",
                                "enum": [
                                    "celsius",
                                    "fahrenheit"
                                ]
                            }
                        },
                        "required": [
                            "location"
                        ]
                    }
                },
                {
                    "name": "application_form",
                    "description": "Collect name and email data of user",
                    "parameters": {
                        "type": "object",
                        "properties": {
                            "name": {
                                "type": "string",
                                "description": "Person's first and last name"
                            },
                            "email": {
                                "type": "string",
                                "description": "Person's electronic mail"
                            }
                        },
                        "required": [
                            "email", "name"
                        ]
                    }
                },
                {
                    "name": "check-order",
                    "description": "Check order status and details by ID or only Email",
                    "parameters": {
                        "type": "object",
                        "properties": {
                            "order_id": {
                                "type": "string",
                                "description": "Id of the specific order"
                            },
                            "email": {
                                "type": "string",
                                "description": "Email that related to order"
                            }
                        },
                        "required": [
                            "order_id"
                        ]
                    }
                },
                {
                    "name": "cancel-order",
                    "description": "Cancel order by id",
                    "parameters": {
                        "type": "object",
                        "properties": {
                            "order_id": {
                                "type": "string",
                                "description": "Id of the specific order"
                            },
                            "confirmed": {
                                "type": "boolean",
                                "description": "If order is found and user confirmed cancelling"
                            }
                        },
                        "required": [
                            "order_id", "confirmed"
                        ]
                    }
                }
            ]
        })

    };
    request(options, function (error, response) {
        if (error) throw new Error(error);
        res.send(response.body);
    });


})




app.listen(port, () => {
    console.log("App is listening at host: http://localhost:4000");
});
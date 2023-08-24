/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */


var express = require('express');
var router = express.Router();

router.get('/', function (req, res, next) {
    res.render('index', {
        title: 'MSAL Node & Express Web App',
        isAuthenticated: req.session.isAuthenticated,
        username: req.session.account?.username,
    });
});

router.get('/webhook', (req,res)=>{
    console.log("GET: " + req)
    res.sendStatus(200)
})

router.post('/webhook', (req,res)=>{
    console.log(req)
    console.log(req.body.value[0])
    const validationToken = req.query.validationToken;
    res.status(200).send(validationToken)
})

module.exports = router;

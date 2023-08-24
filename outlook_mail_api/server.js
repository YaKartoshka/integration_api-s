const express = require('express')
const app = express()
const port = process.env.PORT || 4000

app.get('/webhook', (req, res) => {
    console.log(req)
    res.send('GET: Webhook launched!')
})

app.post('/webhook', (req, res) => {
    console.log(req)
    res.send('POST: Webhook launched!')
})

app.get('/', (req,res)=>{
    res.send('Hello')
})

app.listen(port, () => console.log("App is listening at host: http://localhost:" + port));
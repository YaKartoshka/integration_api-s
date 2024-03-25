const express = require('express');
const app = express();
const port = 3000;



app.get('/doc/:id', (req, res) => {
    var doc_id = req.params.id;
    var url = `https://firebasestorage.googleapis.com/v0/b/webapi-ai.appspot.com/o/documents%2F${doc_id}.png?alt=media&token=62d9bb2d-b6ec-4924-b55a-f40991194023`
    res.redirect(url)
});


app.listen(port, () => console.log(`App listening on port ${port}!`));
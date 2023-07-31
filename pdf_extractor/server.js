const express = require("express");
const path = require('path')
const bodyParser = require("body-parser");
const multer = require('multer');
const fs = require('fs')

const textract = require('@vtfk/pdf-text-reader');

const app = express();
const port = process.env.PORT || 4000;
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use('/files', express.static(path.join(__dirname, 'files')));

const multer_storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, "./pdf_extractor/files")
  },
  filename(req, file, cb) {

    cb(null, `${file.size}`)
  }
})

const limits = {
  fileSize: 1024 * 1024 * 50
}

const upload = multer({
  storage: multer_storage,
  limits: limits
})

var data = {
  text: ''
}

app.get('/', (req, res) => {
  console.log(req)
  res.render('index', {
    data: data
  })
})


app.post('/extractText', upload.single('input_file'), async (req, res) => {
  if (!req.file) {
    res.send('none')
  } else {
    const input_file = req.file
    console.log(input_file)
    var url="https://1015-45-86-82-147.ngrok-free.app/"

    const axios = require('axios');
    // let data = JSON.stringify({
    //   "url": "https://pdfobject.com/pdf/sample.pdf",
    //   "inline": true,
    //   "async": false
    // });

    // let config = {
    //   method: 'post',
    //   maxBodyLength: Infinity,
    //   url: 'https://api.pdf.co/v1/pdf/convert/to/text',
    //   headers: {
    //     'Content-Type': 'application/json',
    //     'x-api-key': 'era.dev404@gmail.com_2dc43c38d17699d0b98d4cff482ff946e8c0253b7a58cf9e93f96c50e3b8d3bbebd69e77'
    //   },
    //   data: data
    // };

    // axios.request(config)
    //   .then((response) => {
    //     let d = {
    //       text : response.data.body
    //     }
    //     res.send(d);
        
    //   })
    //   .catch((error) => {
    //     console.log(error);
    //   });
  }

})


app.listen(port, () => {
  console.log("App is listening at host: http://localhost:4000");
});
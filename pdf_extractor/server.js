const express = require("express");

const path = require('path')
const bodyParser = require("body-parser");
const pdfjs = require('pdfjs-dist/legacy/build/pdf');
const multer = require('multer');
const fs = require('fs')
const cookieParser = require("cookie-parser");

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser())
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));




var CloudmersiveConvertApiClient = require('cloudmersive-convert-api-client');
var defaultClient = CloudmersiveConvertApiClient.ApiClient.instance;
var Apikey = defaultClient.authentications['Apikey'];
Apikey.apiKey = '6f1ad11e-9e39-4a47-8e39-e22afc9f2f3f';
var apiInstance = new CloudmersiveConvertApiClient.ConvertDocumentApi();
const port = process.env.PORT || 3000;

const multer_storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, './pdf_extractor/files')
  },
  filename(req, file, cb) {

    cb(null, `${file.originalname}`)
  }
})

const limits = {
  fileSize: 1024 * 1024 * 50
}

const upload = multer({
  storage: multer_storage,
  limits: limits
})

var data={
  text: ''
}

app.get('/', (req, res) => {
  res.render('index', {
    data: data
  })

})

app.post('/extractText', upload.single('input_file'), async (req, res) => {
  const input_file = req.file
  console.log(input_file)
  const data = new Uint8Array(fs.readFileSync(`${input_file.path}`));
  let text = '';
  // Parse the PDF file
  pdfjs.getDocument(data).promise
  .then(function(pdf) {
    // Get the number of pages in the PDF file
    const numPages = pdf.numPages;

    // Loop through each page and extract the text
    for(let i = 1; i <= numPages; i++) {
      pdf.getPage(i).then(function(page) {
        page.getTextContent().then(function(textContent) {
          

          // Concatenate the text items for this page
          for(let j = 0; j < textContent.items.length; j++) {
            text += textContent.items[j].str + ' ';
          }

          if(i==numPages){
            data['text']=text
            res.render('index',{
              data: data
            })
            fs.unlink(`${input_file.path}`, (err) => { // Delete file after extracting teext
                if (err) throw err;
                console.log('deleted');
              });
          }
        }).catch(function(err) {
          console.error('Error getting text content:', err);
        });
      }).catch(function(err) {
        console.error('Error getting page:', err);
      });
    }
  }).catch(function(err) {
    console.error('Error loading PDF:', err);
  });
  


})

app.listen(port, () => {
  console.log("App is listening at host: http://localhost:3000");
});
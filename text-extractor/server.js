const express = require("express");
const path = require('path')
const bodyParser = require("body-parser");
var textract = require('textract')
const multer = require('multer');
const fs=require('fs')
const cookieParser = require("cookie-parser");

const app = express();
const pdfjs = require('pdfjs-dist');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser())
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const port = process.env.PORT || 3000;

const multer_storage=multer.diskStorage({
    destination(req,file,cb){
        cb(null,'./text-extractor/files')
    },
    filename(req,file,cb){
   
        cb(null, `${file.originalname}`)
    }
})

const limits = {
    fileSize: 1024*1024*50
}

const upload = multer({
    storage: multer_storage,
    limits:limits
})

app.get('/', (req,res)=>{
    res.sendFile(path.join(__dirname+'/index.html'))
    
})


app.post('/extractText', upload.single('input_file'),(req,res)=>{
    const input_file=req.file
    console.log(input_file);
    const pdfPath = path.join(__dirname, '/files/'+input_file.filename);
    const data = new Uint8Array(fs.readFileSync(pdfPath));
    const loadingTask = pdfjs.getDocument(data);
    loadingTask.promise.then(function(pdf) {
        // Load the first page
        pdf.getPage(1).then(function(page) {
          // Get the text content
          page.getTextContent().then(function(textContent) {
            // Extract the text
            const textItems = textContent.items;
            let text = '';
            for (let i = 0; i < textItems.length; i++) {
              text += textItems[i].str + ' ';
            }
            console.log(text);
          });
        });
      });
  
 
})
 

app.listen(port, () => {
  console.log("App is listening at host: http://localhost:3000");
});

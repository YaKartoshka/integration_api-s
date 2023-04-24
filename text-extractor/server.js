const express = require("express");
const MessagingResponse = require("twilio").twiml.MessagingResponse;
const accountSid = "ACa81a3237d7d5dd2d354d5bae5750d1c0";
const { lookup } = require('geoip-lite');
const request=require('request')
const path = require('path')
const bodyParser = require("body-parser");
const textract = require('textract');
const multer = require('multer');
const fs=require('fs')
const moment=require('moment');
const cookieParser = require("cookie-parser");

const app = express();
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
        const date = moment().format('DDMMYYYY-HHmmss SSS')
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
    console.log(input_file)
    textract.fromFileWithPath(`${input_file.path}`, function( error, text ) {
        res.cookie('text',`${text}`)
        console.log(text)
      
        res.redirect('back')
        fs.unlink(`${input_file.path}`, (err) => { // Delete file after extracting teext
            if (err) throw err;
            console.log('path/file.txt was deleted');
          });
    })
    
 
})

app.listen(port, () => {
  console.log("App is listening at host: http://localhost:3000");
});

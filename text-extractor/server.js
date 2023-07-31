const express = require("express");

const path = require('path')
const bodyParser = require("body-parser");
const textract = require('textract');
const multer = require('multer');
const fs = require('fs')
const cookieParser = require("cookie-parser");
const app = express();
const port = process.env.PORT || 3001;

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser())
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const multer_storage = multer.diskStorage({
    destination(req, file, cb) {
        cb(null, './text-extractor/files')
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

var data = {
    text: ''
}

app.get('/', (req, res) => {
    console.log(req)
    res.render('index', {
        data: data
    })
})

app.get('/test', (req,res)=>{
    console.log(req)
    res.redirect('back')
})

app.post('/extractText', upload.single('input_file'), (req, res) => {
    const input_file = req.file
    console.log(input_file)
    textract.fromFileWithPath(`${input_file.path}`, function (error, text) {
        data['text'] = text
        
        res.send(data)
        
        fs.unlink(`${input_file.path}`, (err) => { // Delete file after extracting teext
            if (err) throw err;
            console.log('deleted');
        });
    })


})

app.listen(port, () => {
    console.log("App is listening at host: http://localhost:3001");
});
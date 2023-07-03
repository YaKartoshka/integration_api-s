const express = require("express");
const path = require('path')
const bodyParser = require("body-parser");
const multer = require('multer');
const fs = require('fs')
const cookieParser = require("cookie-parser");
const extract = require('pdf-text-reader')

const app = express();
const port = process.env.PORT || 4000;
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser())
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

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

var data = {
  text: ''
}

app.get('/', (req, res) => {
  res.render('index', {
    data: data
  })
})


app.post('/extractText', upload.single('input_file'), async (req, res) => {
  const input_file = req.file
  const pages = await extract.readPdfText(input_file.path);
  data['text'] = pages.map(page => page.lines.join(' ')).join(' ')
  res.redirect('back')
})

app.listen(port, () => {
  console.log("App is listening at host: http://localhost:4000");
});
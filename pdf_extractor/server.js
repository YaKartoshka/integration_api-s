const express = require("express");
const path = require('path')
const bodyParser = require("body-parser");
const multer = require('multer');
const fs = require('fs')
const cheerio = require('cheerio')
const { convert } = require('html-to-text');
const { exec } = require('child_process');
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
  var r = { r: 1 };
  if (!req.file) {
    res.send('none')
  } else {
    const input_file = req.file
    const convertedFile = input_file.originalname + Math.random().toString(4)
    exec(`py pdf_extractor/extractor.py ${input_file.path} ${input_file.originalname}`, (error, content, stderr) => {
      if (error) {
        console.log("urlExtract.ERR->", error);
        return res.send(JSON.stringify(r));
      }

      fs.readFile(`${input_file.path}.html`, 'utf8', (err, data) => {
        
        const $ = cheerio.load(data);
        $('img').each((index, element) => {
          element.attribs['src'] = '';
        });
        $('a').each((index, element) => {
          const text = $(element).text();
          const href = $(element).attr('href');
          if (text && href) {
            $(element).text(`(${text})`);
          }
        });
        const text = convert($.html(), {
          formatters: {
            // Create a formatter.
            'fooBlockFormatter': function (elem, walk, builder, formatOptions) {

              if (elem.name == 'a' && elem.attribs && elem.children.length) {


                builder.openBlock({ leadingLineBreaks: formatOptions.leadingLineBreaks || 1 });
                walk(elem.children, builder);

                builder.addInline(`[${elem.attribs.href}]`);
                builder.closeBlock({ trailingLineBreaks: formatOptions.trailingLineBreaks || 1 });
              }
            }
          },
          selectors: [
            {
              selector: 'a',
              format: 'fooBlockFormatter',
              options: { leadingLineBreaks: 0, trailingLineBreaks: 0 }
            }
          ]
        });
        console.log(text)
        res.send(text);

        fs.unlink(`${input_file.path}.html`, (err) => {
          if (err) console.log("pdfExtract.ERR->", err);
        });
        fs.unlink(`${input_file.path}`, (err) => {
          if (err) console.log("pdfExtract.ERR->", err);
        });
    
      });

    });
    
  

  }
});


app.listen(port, () => {
  console.log("App is listening at host: http://localhost:4000");
});
const express = require("express");
const path = require('path')
const bodyParser = require("body-parser");
const multer = require('multer');
const fs = require('fs')
var request = require('request');
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
        var options = {
            'method': 'POST',
            'url': 'https://api.cloud.llamaindex.ai/api/parsing/upload',
            'headers': {
                'accept': 'application/json',
                'Authorization': 'Bearer llx-w8rsixVac8YybYtzQYItz49alzeKw1gUh85ts9iQZDxnQ8CW'
            },
            formData: {
                'file': {
                    'value': fs.createReadStream(input_file.path),
                    'options': {
                        'filename': input_file.originalname,
                        'contentType': null
                    }
                }
            }
        };
        request(options, function (error, response) {
            if (error) throw new Error(error);
            var result = JSON.parse(response.body);
            const intervalId = setInterval(async () => {
                var parse_options = {
                  'method': 'GET',
                  'url': `https://api.cloud.llamaindex.ai/api/parsing/job/${result.id}/result/markdown`,
                  'headers': {
                    'accept': 'application/json',
                    'Authorization': 'Bearer llx-w8rsixVac8YybYtzQYItz49alzeKw1gUh85ts9iQZDxnQ8CW'
                  }
                };
                request(parse_options, function (error, response) {
                  if (error) throw new Error(error);
                  var parse_data = JSON.parse(response.body);
                  console.log(parse_data);
                  if (parse_data.markdown) {
                    res.send(JSON.parse(response.body));
                    clearInterval(intervalId);
                    return;
                  }
                });
              }, 2000);
        });
    }
});


async function getResultParser(result, cb) {

}

app.listen(port, () => {
    console.log("App is listening at host: http://localhost:4000");
});
const express = require("express");
const cheerio = require('cheerio')
const path = require('path')
const bodyParser = require("body-parser");
const textract = require('textract');
const multer = require('multer');
const mammoth = require('mammoth');
const fs = require('fs');
var https = require('https');
const cookieParser = require("cookie-parser");
const { convert } = require('html-to-text');
const { exec } = require('child_process');
const pdfReader = require('@vtfk/pdf-text-reader');
const app = express();
const port = process.env.PORT || 3001;
const request = require('request');


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



app.get('/', (req, res) => {

    res.render('index')
})

app.get('/test', (req, res) => {
    res.redirect('back')
})

app.post('/extractText', upload.single('input_file'), (req, res) => {
    const input_file = req.file;

    mammoth.convertToHtml({ path: `${input_file.path}` })
        .then(function (result) {
            var html = result.value;
            const $ = cheerio.load(html);
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
            res.send(text);
        })
        .catch(function (error) {
            console.error(error);
        });
    fs.unlink(`${input_file.path}`, (err) => {
        if (err) console.log("pdfExtract.ERR->", err);
    });
});

app.post('/text_from_url', async (req, res) => {
    const url = req.body.url;
    const fileType = await getFileTypeFromUrl(url);

    if (fileType == 'application/pdf') {
        var filePath = `./text-extractor/files/pdfFile${Math.random().toString(8)}.pdf`;
        var file = fs.createWriteStream(filePath);

        https.get(url, response => {
            response.pipe(file);
            file.on('finish', () => {
                file.close(async () => {
                    const pdfData = await pdfReader(filePath);
                    const text = pdfData.textContent.map(obj => obj.str).join(' ');
                    res.send(text);

                    fs.unlink(filePath, (err) => {
                        if (err) console.log("pdfExtract.ERR->", err);
                    });
                });
            });
        });
    }

    else

    if (fileType == 'text/html') {
        exec(`trafilatura -u "${url}" --links --no-comments --no-tables`, (error, content, stderr) => {
            if (error) {
                console.log("urlExtract.ERR->", error);
                r['r'] = 0;
                return res.send(JSON.stringify(r));
            }
            res.send(content);
        });
    }
});

function getFileTypeFromUrl(url) {
    return new Promise((resolve, reject) => {
        request.head(url, (err, res, body) => {
            if (err) {
                reject(err);
            } else {
                const contentType = res.headers['content-type'];
                resolve(contentType);
            }
        });
    });
}


app.listen(port, () => {
    console.log("App is listening at host: http://localhost:3001");
});
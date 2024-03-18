const express = require("express");
const mysql = require('mysql')
const app = express();
const port = process.env.PORT || 3001;
const { OpenAIEmbeddings } = require("@langchain/openai");
var openai_api_key = "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";
const { CustomVectorStore } = require('./vectorStore')
const { RecursiveCharacterTextSplitter } = require("langchain/text_splitter");
const { Document } = require("@langchain/core/documents");
const async_func = require('async');
const { HNSWLib } = require("@langchain/community/vectorstores/hnswlib");

const embeddings = new OpenAIEmbeddings({
    openAIApiKey: openai_api_key
});
const textSplitter = new RecursiveCharacterTextSplitter({ chunkSize: 1000 });
const customvectorstore = new CustomVectorStore(embeddings);// should be retrieved from database
var vectorStore;

const pool = mysql.createPool({
    connectionLimit: 10,
    host: "localhost",
    user: 'root',
    password: '',
    database: 'aicc2_demo4',
    multipleStatements: true,
    timezone: 'pst',
    dateStrings: true,
    charset: 'utf8mb4'
});

function getConnection() {
    return pool;
}

async function addChunk(id, content) {
    await customvectorstore.addDocuments([
        new Document({
            pageContent: content,
            metadata: { id: id }
        })
    ]);

    var query = 'UPDATE documents SET chunks = ? WHERE id = ?'; // should be insert like in documentSave
    var connection = getConnection()
    connection.query(query, [JSON.stringify(customvectorstore.memoryVectors[0]), id], async function (err, results) {
        customvectorstore.memoryVectors.length = 0;
    });

    // console.log(customvectorstore.memoryVectors[0]) 
    // {
    //     content: 'Hello World',
    //     embedding: [
    //        -0.0071169836,  0.0034469902,  -0.007148841, -0.029156057,
    //         -0.013061608,  0.0109462645,  -0.020274164,  0.005253315,
    //         -0.00856....
    //     metadata: {id: 1}
}

// addChunk(74, 'Hello World')


// async function searchQueryByContent(status, question) {
//     var connection = getConnection()
//     var query = 'SELECT content FROM documents';

//     if (status) { // create new vectorstore
//         connection.query(query, async function (err, results) {
//             if (err) throw err;

//             var docs = [];

//             async_func.eachSeries(results, async function (doc, cb) {
//                 var doc = await textSplitter.createDocuments([doc.content]);
//                 docs.push(doc)
//             }, async function done() {
//                 var combined_docs = [].concat(...docs);
//                 vectorStore = await HNSWLib.fromDocuments(combined_docs, embeddings);
//                 // console.log(vectorStore)
//                 const vectorStoreRetriever = vectorStore.asRetriever();
//                 const result = await vectorStoreRetriever.getRelevantDocuments(
//                     question
//                 );

//                 // console.log(result);
//             });
//         });
//     } else { // use previous vectorstore

//         const vectorStoreRetriever = vectorStore.asRetriever();
//         console.log(vectorStore)
//         const result = await vectorStoreRetriever.getRelevantDocuments(
//             question
//         );
//         // console.log(result);
//     }

// }

async function searchQueryByDocs() {
    var connection = getConnection();
    var query = 'SELECT chunks FROM documents WHERE id IN (64, 65, 76); '; // 64,65,76 are updated documents which have new format of chunks
    var vectorStoreQuery = 'SELECT vectorstore FROM somewhere';

    connection.query(query, async function (err, results) {
        if (err) throw err;

        results.forEach((chunk) => {
            customvectorstore.memoryVectors.push(JSON.parse(chunk.chunks))
        });
        // console.log(customvectorstore)
        const res = await customvectorstore.similaritySearch("What is the IEEE?");
        console.log(res);
    });
}

searchQueryByDocs();

// app.get('/action', (req, res) => {
//     var question = req.query.question;

//     if (req.query.status == 1) {
//         searchQueryByContent(1, question); // new vectorstore
//     } else {
//         searchQueryByContent(0, question); // old vectorstore
//     }
//     res.sendStatus(200);
// })


app.listen(port, () => {
    console.log("App is listening at host: http://localhost:3001");
});
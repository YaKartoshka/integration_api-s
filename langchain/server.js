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

const vectorstore = new CustomVectorStore(embeddings);

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

async function searchQueryByContent() {
    var connection = getConnection()
    var query = 'SELECT content FROM documents';
    var allchunks = [];

    connection.query(query,async function (err, results) {
        if (err) throw err;
        results.forEach(doc => {
            allchunks.push(doc.content);
        });

        const textSplitter = new RecursiveCharacterTextSplitter({ chunkSize: 1000 });
        const docs = await textSplitter.createDocuments([allchunks.join('\n')]);
        const vectorStore = await HNSWLib.fromDocuments(docs, embeddings);
        const vectorStoreRetriever = vectorStore.asRetriever();
        const res = await vectorStoreRetriever.getRelevantDocuments(
            "what is ChatGPT ?"
        );
        console.log(res);
    });
}

async function searchQueryByDocs() {
    var connection = getConnection()
    var query = 'SELECT content, id FROM documents';

    connection.query(query, function (err, results) {
        if (err) throw err;
        async_func.eachSeries(results, async function (doc, cb) {
            await vectorstore.addDocuments([
                new Document({
                    pageContent: doc.content,
                    metadata: { id: doc.id }
                })
            ]);
        }, async function done() {
            const res = await vectorstore.similaritySearch("What is the ChatGPT?");
            console.log(res);
        });
    });
}

searchQueryByDocs();

app.listen(port, () => {
    console.log("App is listening at host: http://localhost:3001");
});
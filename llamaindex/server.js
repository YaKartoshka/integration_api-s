require('dotenv')
const express = require("express");
const mysql = require('mysql');
const fs = require("fs");
const { Document, VectorStoreIndex } = require("llamaindex");
var openai_api_key = "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";

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


async function main() {

    fs.readFile('llamaindex/index.txt', 'utf-8', async (err, essay) => {
        if (err) {
            console.error('Error reading file:', err);
            return;
        }
        console.log(essay); // Print the contents of the file
        const document = new Document({ text: essay });
        const index = await VectorStoreIndex.fromDocuments([document]);

        const queryEngine = index.asQueryEngine();
        const response = await queryEngine.query({
            query: "Что такое CS GO?",
        });

        console.log(response.toString());
    });


}

main();

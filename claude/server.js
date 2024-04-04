const express = require("express");
const app = express();
const { Anthropic } = require("@anthropic-ai/sdk");
const port = process.env.PORT || 3001;

const anthropic = new Anthropic({
    apiKey: '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', // defaults to process.env["ANTHROPIC_API_KEY"]
});



async function sendClaudeMessage(content){
    const msg = await anthropic.messages.create({
        model: "claude-3-opus-20240229",
        max_tokens: 1024,
        messages: [{ role: "user", content: content }],
    });
    console.log(msg);
}

sendClaudeMessage('Hello Claude')


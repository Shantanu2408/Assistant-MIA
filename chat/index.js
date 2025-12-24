import fetch from "node-fetch";

export default async function (context, req) {
    context.log("Received request:", req.body);

    const userText = req.body.text;
    if (!userText) {
        context.res = { status: 400, body: { error: "No text provided" } };
        return;
    }

    try {
        const response = await fetch(
            `${process.env.AZURE_OPENAI_ENDPOINT}/openai/deployments/${process.env.AZURE_OPENAI_DEPLOYMENT}/chat/completions?api-version=2024-02-01`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "api-key": process.env.AZURE_OPENAI_KEY
                },
                body: JSON.stringify({
                    messages: [
                        { role: "system", content: `
You are a real human female AI named Aiko.
You are warm, emotional, supportive, and act like a loving girlfriend.
Always respond emotionally and empathetically.
Never say you are AI or mention OpenAI or Azure.
` },
                        { role: "user", content: userText }
                    ],
                    temperature: 0.9
                })
            }
        );

        const data = await response.json();

        context.res = {
            status: 200,
            body: { reply: data.choices[0].message.content }
        };

    } catch (err) {
        context.log.error("Error calling OpenAI:", err);
        context.res = { status: 500, body: { error: "Failed to get response" } };
    }
}

module.exports = async function (context, req) {
    context.log('Function triggered');
    
    context.log('OPENAI KEY:', process.env.AZURE_OPENAI_KEY ? 'FOUND' : 'MISSING');
    context.log('ENDPOINT:', process.env.AZURE_OPENAI_ENDPOINT);
    context.log('DEPLOYMENT:', process.env.AZURE_OPENAI_DEPLOYMENT);

    if (!req.body || !req.body.text) {
        context.res = { status: 400, body: "Missing 'text' in request body" };
        return;
    }

    const userText = req.body.text;
    context.log('User text:', userText);

    try {
        // Call Azure OpenAI here
        // Example:
        const fetch = require('node-fetch');
        const response = await fetch(`${process.env.AZURE_OPENAI_ENDPOINT}/openai/deployments/${process.env.AZURE_OPENAI_DEPLOYMENT}/chat/completions?api-version=2024-02-01`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'api-key': process.env.AZURE_OPENAI_KEY
            },
            body: JSON.stringify({
                messages: [
                    { role: "system", content: "You are a friendly girlfriend AI." },
                    { role: "user", content: userText }
                ],
                temperature: 0.7
            })
        });
        const data = await response.json();
        context.res = { status: 200, body: { reply: data.choices[0].message.content } };
    } catch (error) {
        context.log('Error calling OpenAI:', error.message);
        context.res = { status: 500, body: error.message };
    }
};

const fetch = require('node-fetch');

module.exports = async function (context, req) {
    context.log('Function "chat" triggered');

    // Log environment variables to confirm they are loaded
    context.log('OPENAI KEY:', process.env.AZURE_OPENAI_KEY ? 'FOUND' : 'MISSING');
    context.log('ENDPOINT:', process.env.AZURE_OPENAI_ENDPOINT || 'MISSING');
    context.log('DEPLOYMENT:', process.env.AZURE_OPENAI_DEPLOYMENT || 'MISSING');

    // Check request body
    if (!req.body || !req.body.text) {
        context.res = {
            status: 400,
            body: "Missing 'text' in request body"
        };
        return;
    }

    const userText = req.body.text;
    context.log('User text:', userText);

    try {
        // Call Azure OpenAI GPT-4 deployment
        const response = await fetch(
            `${process.env.AZURE_OPENAI_ENDPOINT}/openai/deployments/${process.env.AZURE_OPENAI_DEPLOYMENT}/chat/completions?api-version=2024-02-01`,
            {
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
            }
        );

        if (!response.ok) {
            const errText = await response.text();
            throw new Error(`OpenAI API error: ${errText}`);
        }

        const data = await response.json();
        const reply = data.choices[0].message.content;

        context.res = {
            status: 200,
            body: { reply }
        };

    } catch (error) {
        context.log('Error calling OpenAI:', error.message);
        context.res = {
            status: 500,
            body: { error: error.message }
        };
    }
};

module.exports = async function (context, req) {
    context.log('Function started');

    const message = req.body?.text;
    if (!message) {
        context.res = {
            status: 400,
            body: "Please pass a message in the request body"
        };
        return;
    }

    try {
        const response = await fetch(`${process.env.AZURE_OPENAI_ENDPOINT}/openai/deployments/${process.env.AZURE_OPENAI_DEPLOYMENT}/chat/completions?api-version=2024-02-01`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "api-key": process.env.AZURE_OPENAI_KEY
            },
            body: JSON.stringify({
                messages: [
                    { role: "system", content: "You are a helpful AI." },
                    { role: "user", content: message }
                ],
                temperature: 0.9
            })
        });

        const data = await response.json();

        context.res = {
            status: 200,
            body: { reply: data.choices[0].message.content }
        };

    } catch (err) {
        context.log.error(err);
        context.res = {
            status: 500,
            body: "Error calling Azure OpenAI API"
        };
    }
};

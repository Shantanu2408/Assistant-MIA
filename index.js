const fetch = require("node-fetch");

module.exports = async function (context, req) {
    const userText = req.body.text;

    const response = await fetch(
        "https://YOUR_OPENAI_RESOURCE.openai.azure.com/openai/deployments/YOUR_DEPLOYMENT/chat/completions?api-version=2024-02-01",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "api-key": "YOUR_OPENAI_KEY"
            },
            body: JSON.stringify({
                messages: [
                    { role: "system", content: "You are a loving, caring AI girlfriend." },
                    { role: "user", content: userText }
                ],
                temperature: 0.9
            })
        }
    );

    const data = await response.json();

    context.res = {
        body: { reply: data.choices[0].message.content }
    };
};

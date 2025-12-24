const OpenAI = require("openai");

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
    apiBaseUrl: process.env.OPENAI_API_BASE,
    apiVersion: "2023-07-01-preview" // Azure OpenAI version
});

module.exports = async function (context, req) {
    context.log('Function started');

    try {
        // Check if request body exists and has 'text'
        const input = req.body?.text;
        if (!input) {
            context.res = {
                status: 400,
                body: { error: "Please provide 'text' in the request body" }
            };
            return;
        }

        // Call Azure OpenAI Chat Completions
        const response = await openai.chat.completions.create({
            model: process.env.OPENAI_API_DEPLOYMENT, // deployment name in Azure
            messages: [
                { role: "user", content: input }
            ]
        });

        // Safely access the reply
        const reply = response?.choices?.[0]?.message?.content;
        if (!reply) {
            throw new Error("No response from OpenAI API");
        }

        // Return successful response
        context.res = {
            status: 200,
            body: { reply }
        };

    } catch (error) {
        context.log.error("Error in function:", error);

        context.res = {
            status: 500,
            body: {
                error: "Error calling Azure OpenAI API",
                details: error.message
            }
        };
    }
};

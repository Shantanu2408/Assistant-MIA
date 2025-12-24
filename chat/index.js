import axios from "axios";

export default async function (context, req) {
  context.log("Function started");

  const text = req.body?.text;
  if (!text) {
    context.res = { status: 400, body: "Missing 'text' in request body" };
    return;
  }

  const apiKey = process.env.OPENAI_API_KEY;
  const endpoint = process.env.OPENAI_API_BASE;
  const deployment = process.env.OPENAI_API_DEPLOYMENT;

  if (!apiKey || !endpoint || !deployment) {
    context.res = { status: 500, body: "Environment variables not set" };
    return;
  }

  try {
    const response = await axios.post(
      `${endpoint}/openai/deployments/${deployment}/chat/completions?api-version=2023-07-01-preview`,
      {
        messages: [{ role: "user", content: text }],
        max_tokens: 200
      },
      {
        headers: {
          "Content-Type": "application/json",
          "api-key": apiKey
        }
      }
    );

    const reply = response.data.choices?.[0]?.message?.content || "No reply";
    context.res = { status: 200, body: { reply } };
  } catch (err) {
    context.log("Azure OpenAI API error:", err.message);
    context.res = { status: 500, body: "Error calling Azure OpenAI API" };
  }
}

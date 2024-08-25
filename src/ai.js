const { GoogleGenerativeAI } = require("@google/generative-ai");

require('dotenv').config();

const apiKey = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);
const model = genAI.getGenerativeModel({ model: "gemini-pro" });

async function gemini(prompt) {

  const chat = model.startChat();

  const result = await chat.sendMessage(prompt);
  const response = await result.response;

  const geminiRes = response.text()

  return geminiRes;
}

module.exports = { gemini }

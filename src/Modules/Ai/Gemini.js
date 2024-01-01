const { GoogleGenerativeAI } = require("@google/generative-ai");
const genAI = new GoogleGenerativeAI(process.env.Gemini_API_Key);

const model = genAI.getGenerativeModel({ model: "gemini-pro" });

async function generateContent(prompt) {
  const result = await model.generateContent(prompt);
  const response = await result.response;
  const text = response.text();
  return text;
}

// async function generateContent(prompt) {
//   const result = await model.generateContent(prompt);
//   const response = await result.response;
//   const text = response.text();
//   return text;
// }

module.exports = {generateContent}
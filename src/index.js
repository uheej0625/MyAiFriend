require("dotenv").config();

const { generateContent } = require("./Modules/Gemini");

(async () => {
  const result = await generateContent("심심한데 할 거 없을까? 답변은 반말로 해 줘");
  console.log(result);
})();

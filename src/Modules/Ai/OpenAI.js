const { OpenAI } = require("openai");
const openai = new OpenAI({
  apiKey: process.env.OpenAI_API_KEY,
});

const sleep = (ms) => {
  return new Promise(resolve => setTimeout(resolve, ms));
}

const threadMap = {};

async function Get_ThreadId(discordThreadId) {
  try {
    return threadMap[discordThreadId];

  } catch(error) {
    console.log(error);
  }
}

async function Add_ThreadToMap(discordThreadId, openAiThreadId) {
  try {
    threadMap[discordThreadId] = openAiThreadId;

  } catch(error) {
    console.log(error);
  }
}

const terminalStates = ["cancelled", "failed", "completed", "expired"];
async function Check_Status(openAiThreadId, runId) {
  try {
    const run = await openai.beta.threads.runs.retrieve(
      openAiThreadId,
      runId
    );

    if(terminalStates.indexOf(run.status) < 0){
      await sleep(1000);
      return Check_Status(openAiThreadId, runId);
    }

    return run.status;

  } catch(error) {
    console.log(error);
  }
}

async function Add_Message(threadId, content) {
  try {
    return openai.beta.threads.messages.create(
      threadId,
      { role: "user", content }
    )
  } catch(error) {
    console.log(error);
  }
}

async function Add_System_Message(threadId, content) {
  try {
    return openai.beta.threads.messages.create(
      threadId,
      { role: "system", content }
    )
  } catch(error) {
    console.log(error);
  }
}

module.exports = { openai, Get_ThreadId, Add_ThreadToMap, Check_Status, Add_Message, Add_System_Message };
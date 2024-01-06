const { openai, Get_ThreadId, Add_ThreadToMap, Check_Status, Add_Message, Add_System_Message } = require("../Modules/Ai/OpenAI.js");

module.exports = {
  name: "messageCreate",
  once: false,
  async execute(message, client) {
    if (message.author.bot || !message.content || message.content === '') return; //Ignore bot messages
    const discordThreadId = message.channel.id;
    let openAiThreadId = await Get_ThreadId(discordThreadId);
    
    let messagesLoaded = false;
    if(!openAiThreadId){
        const thread = await openai.beta.threads.create();
        openAiThreadId = thread.id;
        Add_ThreadToMap(discordThreadId, openAiThreadId);
        if(message.channel.isThread()){
            //Gather all thread messages to fill out the OpenAI thread since we haven't seen this one yet
            const starterMsg = await message.channel.fetchStarterMessage();
            const otherMessagesRaw = await message.channel.messages.fetch();

            const otherMessages = Array.from(otherMessagesRaw.values())
                .map(msg => msg.content)
                .reverse(); //oldest first

            const messages = [starterMsg.content, ...otherMessages]
                .filter(msg => !!msg && msg !== '')

            // console.log(messages);
            await Promise.all(messages.map(msg => Add_Message(openAiThreadId, msg)));
            messagesLoaded = true;
        }
    }

    // console.log(openAiThreadId);
    if(!messagesLoaded){ //If this is for a thread, assume msg was loaded via .fetch() earlier
        await Add_Message(openAiThreadId, message.content);
    }

    const run = await openai.beta.threads.runs.create(
        openAiThreadId,
        { assistant_id: process.env.ASSISTANT_ID }
    )
    const status = await Check_Status(openAiThreadId, run.id);

    const messages = await openai.beta.threads.messages.list(openAiThreadId);
    let response = messages.data[0].content[0].text.value;
    response = response.substring(0, 1999) //Discord msg length limit when I was testing
    
    console.log(response);
    // 끊어 보내기 --스트리밍 기능 나오면 뜯어 고쳐야 함
    const text = response.split(/(?<=[.?!])/);
    for (let i = 0; i < text.length; i++) {
        console.log(text[i])
        client.users.cache.get(message.author.id).send(text[i]);
    }
    //if (inter)
    //message.reply(response);
  },
};
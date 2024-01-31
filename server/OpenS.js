import { ChatOpenAI } from "@langchain/openai";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";

const prompt = ChatPromptTemplate.fromMessages([
  ["human", "{topic}についてジョークを言って"],
]);
const model = new ChatOpenAI({
    modelName: "gpt-4-1106-preview",
    
    streaming: true,
    callbacks: [
      {
        handleLLMNewToken(token) {
          console.log({ token });
        },
      },
    ],
});


const chain = prompt.pipe(model);

const response = await chain.invoke({
  topic: "アイスクリーム",
});
console.log(response);
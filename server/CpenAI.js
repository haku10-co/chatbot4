const { ChatOpenAI } = require("@langchain/openai");
const {
  ChatPromptTemplate,
  MessagesPlaceholder,
} = require("@langchain/core/prompts");
const { BufferMemory } = require("langchain/memory");
const { LLMChain } =require( "langchain/chains");

const chatModel = new ChatOpenAI({ temperature: 0 });

const chatPrompt = ChatPromptTemplate.fromMessages([
  ["system", "You are a nice chatbot having a conversation with a human.Tell me in Japnese"],
  new MessagesPlaceholder("chat_history"),
  ["human", "{question}"],
]);

const chatPromptMemory = new BufferMemory({
  memoryKey: "chat_history",
  returnMessages: true,
  maxMessages: 1, // 最新の質問と応答のみを保持
});

const chatConversationChain = new LLMChain({
  llm: chatModel,
  prompt: chatPrompt,
  verbose: true,
  memory: chatPromptMemory,
});

// async関数を定義
async function runChat() {
  // `question`変数を渡す - `chat_history`はメモリによって自動的に埋められる
  await chatConversationChain.invoke({ question: "僕の名前は舶斗" });
  await chatConversationChain.invoke({ question: "天気は晴れ" });
  await chatConversationChain.invoke({ question: "僕の名前は？" });
}

// 定義した関数を実行
runChat().catch(console.error);
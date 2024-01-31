// パッケージをインポート
import { ChatOpenAI } from "@langchain/openai";
import { HumanMessage, AIMessage } from "@langchain/core/messages";
import { ChatPromptTemplate, MessagesPlaceholder } from "@langchain/core/prompts";
import { ChatMessageHistory } from "langchain/stores/message/in_memory";
import { RunnableWithMessageHistory } from "@langchain/core/runnables";

// ChatOpenAIのインスタンスを作成
const chat = new ChatOpenAI({
  modelName: "gpt-3.5-turbo-1106",
});

// メッセージをチャットモデルに渡す
const prompt = ChatPromptTemplate.fromMessages([
  [
    "system",
    "You are a helpful assistant. Answer all questions to the best of your ability.",
  ],
  new MessagesPlaceholder("messages"),
]);

const chain = prompt.pipe(chat);

// メッセージ履歴クラスを使用してメッセージを保存およびロード
const demoEphemeralChatMessageHistory = new ChatMessageHistory();

// RunnableWithMessageHistoryクラスを使用してメッセージの自動管理
const demoEphemeralChatMessageHistoryForChain = new ChatMessageHistory();

const chainWithMessageHistory = new RunnableWithMessageHistory({
  runnable: chain,
  getMessageHistory: (_sessionId) => demoEphemeralChatMessageHistoryForChain,
  inputMessagesKey: "input",
  historyMessagesKey: "chat_history",
});

// 非同期関数を定義
const main = async () => {
  await chain.invoke({
    messages: [
      new HumanMessage(
        "翻訳して."
      ),
      new AIMessage("J'adore la programmation."),
      new HumanMessage("What did you just say?"),
    ],
  });

  await demoEphemeralChatMessageHistory.addMessage(
    new HumanMessage(
      "Translate this sentence from English to French: I love programming."
    )
  );

  await demoEphemeralChatMessageHistory.addMessage(
    new AIMessage("J'adore la programmation.")
  );

  await demoEphemeralChatMessageHistory.getMessages();
};

// 非同期関数を呼び出す
main();
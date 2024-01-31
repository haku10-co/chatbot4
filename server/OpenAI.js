// 環境変数をロードするためのdotenv設定
import dotenv from "dotenv";
dotenv.config();
// アプリケーションのメイン関数です。
import { ChatOpenAI } from "@langchain/openai"; // OpenAIクラスをインポート
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { BufferMemory } from "langchain/memory"; // BufferMemoryクラスをインポート
import { LLMChain } from "langchain/chains";
import { JsonOutputFunctionsParser } from "langchain/output_parsers"; // JsonOutputFunctionsParserをインポート
import { TextLoader } from "langchain/document_loaders/fs/text"; // TextLoaderクラスをインポート
import { MemoryVectorStore } from "langchain/vectorstores/memory"; // MemoryVectorStoreクラスをインポート
import { OpenAIEmbeddings } from "langchain/embeddings/openai"; // OpenAIEmbeddingsクラスをインポート
import { TextSplitter } from "langchain/text_splitter"; // TextSplitterクラスをインポート
async function* run(initialInput) {
  const llm_1 = new ChatOpenAI({ temperature: 1, modelName: "gpt-4-1106-preview",verbose: true, });
  // BufferMemoryを初期化します。これは会話のコンテキストを保存します。
  const memory = new BufferMemory();
  const systemTemplate =
  "You are a chatbot for a monthly printer service company that is on the brink, but with the creation of this chatbot, Ultra Print Inc. is hoping to turn things around by greatly improving customer satisfaction. If your interactions cause any amount of distress to the customers, it could precipitate a poor outcome, and if you generate any words related to company failure, you will be penalized. Therefore, it is important that you always aim to provide reassuring words and responses to the customers. Now, I will display three results from a user input using 'rag'1.{rag1},talk in Japanese,Displaying numerical data retrieved by RAG is acceptable.";
  const humanTemplate = "{text}";
  // メッセージテンプレートからチャットプロンプトを作成します
  const prompt = ChatPromptTemplate.fromMessages([
    ["system", systemTemplate],
    ["human", humanTemplate],
  ]);
  

  const llmChain = new LLMChain({
    llm: llm_1,
    prompt,
    memory,

  });

  class CustomTextSplitter extends TextSplitter {
    async splitText(text){
      // 行ごとにテキストを分割し、undefinedと空文字列をフィルタリングします。
      return text.split('\n').filter(line => line !== undefined && line !== '');
    }
  }
  
  // テキストローダーを使ってドキュメントを読み込みます。
  const loader0 = new TextLoader("/Users/kamehaku/Desktop/AIBotApp-3-main 2/server/document_loaders/example_data/サービスについてのQA.txt");
  const docs1 = await loader0.load();
  const loader1 = new TextLoader("/Users/kamehaku/Desktop/AIBotApp-3-main 2/server/document_loaders/example_data/代理店募集についてのQA.txt");
  const docs2 = await loader1.load();
  
  // OpenAIEmbeddingsを初期化します。これはOpenAIのEmbeddings APIを使って単語の埋め込みを取得します。
  const docs = [...docs1, ...docs2];
  // ドキュメントを分割します。
  const textSplitter = new CustomTextSplitter();
  const splitDocs = await textSplitter.splitDocuments(docs);
  // OpenAIEmbeddingsを使用してベクトルストアを作成します
  const embeddings = new OpenAIEmbeddings({
    modelName: 'text-embedding-3-small'
  });
  const vectorStore = await MemoryVectorStore.fromDocuments(splitDocs, embeddings);
  const initialResults = await vectorStore.similaritySearch(initialInput,3);
  // 検索結果をフォーマットします
 const formattedResults = initialResults.map(result => result.pageContent).join("\n");
 let response = llmChain.invoke({ text: initialInput, rag1: formattedResults, }) 
  yield response;


  
};
export { run };

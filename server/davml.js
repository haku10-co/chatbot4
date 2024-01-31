const { MemoryVectorStore } = require("langchain/vectorstores/memory");
const { OpenAIEmbeddings, ChatOpenAI } = require("@langchain/openai");
const { ChatPromptTemplate } = require("@langchain/core/prompts");
const { StringOutputParser } = require("@langchain/core/output_parsers");
const { TextLoader } = require("langchain/document_loaders/fs/text");
const { TextSplitter } = require("langchain/text_splitter");
const { BufferMemory } = require("langchain/memory"); // BufferMemoryクラスをインポート

// カスタムテキストスプリッタークラスを定義します
class LineByLineTextSplitter extends TextSplitter {
  async splitText(text) {
    // 改行でテキストを分割して配列にします
    return text.split(/\r?\n/);
  }
}
// メッセージテンプレートを定義します
const systemTemplate =
  "You are a chatbot for a monthly printer service company that is on the brink, but with the creation of this chatbot, Ultra Print Inc. is hoping to turn things around by greatly improving customer satisfaction. If your interactions cause any amount of distress to the customers, it could precipitate a poor outcome, and if you generate any words related to company failure, you will be penalized. Therefore, it is important that you always aim to provide reassuring words and responses to the customers. Now, I will display three results from a user input using 'rag'1.{rag1},talk in Japanese,Displaying numerical data retrieved by RAG is acceptable";
const humanTemplate = "{text}";

// メッセージテンプレートからチャットプロンプトを作成します
const chatPrompt = ChatPromptTemplate.fromMessages([
  ["system", systemTemplate],
  ["human", humanTemplate],
]);

// モデルを作成します
// ConversationSummaryMemory インスタンスを作成します
const model = new ChatOpenAI({
    modelName: "gpt-4-1106-preview", 
    temperature: 0,
    verbose: true,
    streaming: true,
});
// 出力パーサーを作成します
const outputParser = new StringOutputParser();


// チャットプロンプト、モデル、出力パーサーをチェーンします
const chain = chatPrompt.pipe(model).pipe(outputParser).pipe(memory);

// メッセージをフォーマットし、モデルに渡し、結果をパースします
  const loader1 = new TextLoader("/Users/kamehaku/Desktop/AIBotApp-3-main 2/server/document_loaders/example_data/サービスについてのQA.txt");
  const docs1 = await loader1.load();
  const loader2 = new TextLoader("/Users/kamehaku/Desktop/AIBotApp-3-main 2/server/document_loaders/example_data/代理店募集についてのQA.txt");
  const docs2 = await loader2.load();
  const docs = [...docs1, ...docs2];
  // カスタムテキストスプリッターをインスタンス化します
  const splitter = new LineByLineTextSplitter();
  // docsの各要素が文字列であることを確認し、それぞれを分割します
  const splitDocs = [];
  for (const doc of docs) {
    if (doc.pageContent && typeof doc.pageContent === 'string') {
      const lines = await splitter.splitText(doc.pageContent);
      splitDocs.push(...lines); // 分割された行をsplitDocsに追加
    } else {
      // doc.pageContentが文字列でない場合のエラーハンドリング
      console.error('Document pageContent is not a string:', doc);
    }
  }
  // OpenAIEmbeddingsを使用してベクトルストアを作成します
  const embeddings = new OpenAIEmbeddings({
    modelName: 'text-embedding-3-small'
  });
  const vectorStore = await MemoryVectorStore.fromTexts(
    splitDocs, // splitDocsは分割されたテキストの配列です
    splitDocs.map((_, index) => ({ id: index })), // 各テキストに一意のIDを割り当てます
    embeddings
  );

 // ユーザーの入力をベクトル化し、類似性検索を行います
 const searchResults = await vectorStore.similaritySearch(initialInput, 3); // 上位3つの結果を取得します
 console.log(searchResults);
 // 検索結果をフォーマットします
 const formattedResults = searchResults.map(result => result.pageContent).join("\n");

 
  // ユーザーの入力を処理し、会話の要約を更新します
  // チェーンを使用してモデルに問い合わせ、ストリーミング応答を取得
  response = chain.invoke({ text: initialInput, rag1: formattedResults }) 

  

module.exports = { run };
// readlineインターフェースの設定
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
  
  // ユーザーからの入力を受け取る関数
  const askQuestion = (query) => {
    return new Promise(resolve => {
      rl.question(query, (answer) => {
        resolve(answer);
      });
    });
  };
  
  // メインロジック
  const main = async () => {
    // ユーザーからの入力を取得
    const userInput = await askQuestion('入力してください: ');
  
    // ここでrun関数を実行
    const generator = run(userInput);
    for await (const response of generator) {
      console.log(response);
    }
  
    // readlineインターフェースを閉じる
    rl.close();
  };
  
  // プログラムの実行
  main();
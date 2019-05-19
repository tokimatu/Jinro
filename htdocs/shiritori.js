const functions = require('firebase-functions'); // Cloud Functions for Firebase library
const DialogflowApp = require('actions-on-google').DialogflowApp; // Google Assistant helper library
const admin = require("firebase-admin");
admin.initializeApp(functions.config().firebase);
const db = admin.database();
const kuromoji = require('kuromoji');
const kuromojiBuilder = kuromoji.builder({dicPath: 'node_modules/kuromoji/dict/'});
 
exports.dialogflowFirebaseFulfillment = functions.https.onRequest((request, response) => {
  if (request.body.result) {
    processRequest(request, response);
  } else {
    return response.status(400).end('Invalid Webhook Request');
  }
});
 
function processRequest (request, response) {
  let action = request.body.result.action; // https://dialogflow.com/docs/actions-and-parameters
  const app = new DialogflowApp({request: request, response: response});
  //db reference
  const statusRef = db.ref("/shiritori/status");
  const dictionaryPath = "/shiritori/dictionary/";
  let tell = "";
  let status = {
    lastChar: 'め', preWords: [ 'しりとりはじめ' ]
  }
  const actionHandlers = {
    'input.welcome': () => {
      statusRef.set(status);
      tell += "本気のしりとりですね。私から行きます。しりとり始め。";
      response.json({"speech": tell, "displayText": tell});
    },
    'shiritoriOwari': () => {
      let shiritoriWord = app.getArgument("shiritoriWord");
      statusRef.once("value", function(snapshot){
        status = snapshot.val();
        if(status['lastChar'] == 'し' && shiritoriWord == 'しりとり終わり'){
          shiritoriEnd(2,0);
        }else{
          shiritoriEnd(3,0);
        }
      });
    },
    'shiritori': () => {
      //しりとりワード
      let shiritoriWord = app.getArgument("shiritoriWord");
      const shiritoriWordOrigin = shiritoriWord;
      console.log("shiritoriWord");
      console.log(shiritoriWord);
      //形態素解析
      kuromojiBuilder.build(function(err, tokenizer){
        if (err) {
          console.log(err);
          tell += err;
          response.json({"speech": tell, "displayText": tell});
          response.status(200).end();
        }
        console.log("tokenize start");
        const tokens = tokenizer.tokenize(shiritoriWord);  
        console.log("tokenize end");
        if(checkToken(tokens.length, tokens[0]['word_type']) === false) shiritoriEnd(0,1);
        // 読み仮名に変換、以降読み仮名で扱う
        shiritoriWord = tokens[0]['reading'];
        // 末尾の長音記号を削除
        if(shiritoriWord.slice(-1) == "ー"){
          shiritoriWord = shiritoriWord.slice(0,-1);
        }
        // ひらがなに変換
        shiritoriWord = katakanaToHiragana(shiritoriWord);
        console.log('shiritoriWord to hiragana');
        console.log(shiritoriWord);
 
        // ステータス取得
        statusRef.once("value", function(snapshot){
          status = snapshot.val();
          //人間
          console.log("ningen");
          console.log(status['lastChar']);
          //チェック
          if (status['lastChar'] == 'し' && shiritoriWord == 'しりとり終わり') shiritoriEnd(2,0);
          if (checkWord(shiritoriWord,status,0) === false) shiritoriEnd(0,0);
          status['preWords'].unshift(shiritoriWord);
          status['lastChar'] = komojiToOmoji(shiritoriWord.slice(-1));
          //ステータス更新
          console.log(status);
          statusRef.set(status);
 
          //googlehome
          console.log("google home ");
          tell += shiritoriWordOrigin+"の、「"+status['lastChar']+"」、ですね。私の番です。";
          //辞書検索
          db.ref(dictionaryPath+status['lastChar']).once("value",function(snapshot){
            const dw = snapshot.val();
            console.log(dw);
            if (dw === null) {
              tell += "うーん。思いつかないです。";
              shiritoriEnd(1,0);
            }
            dw.sort(function(){ return Math.random() - .5;});
            console.log(dw);
            const dictWord = dw[0];
            console.log("dictword");
            console.log(dictWord);
            tell += dictWord+"。";
            //チェック
            if (checkWord(dictWord,status,1) === false) shiritoriEnd(1,0);
            status['preWords'].unshift(dictWord);
            status['lastChar'] = dictWord.slice(-1);
            //ステータス更新
            console.log(status);
            statusRef.set(status);
            response.json({"speech": tell, "displayText": tell});
          });
        });
      });
    }
  }
  actionHandlers[action]();
  //チェック
  const checkToken = (length, word_type) => {
    console.log('checkToken');
    console.log(length);
    console.log(word_type);
    if(length > 1 || word_type === 'UNKNOWN'){
      tell += "すみません、私が知らない言葉のようです。わかり易い「名詞」でお願いします。"
      return false;
    }
    return true;
  }
  const katakanaToHiragana = (st) => {
    return st.replace(/[\u30a1-\u30f6]/g, function(match) {
      const chr = match.charCodeAt(0) - 0x60;
      return String.fromCharCode(chr);
    });
  }
  const komojiToOmoji = (st) => {
    komojiMap = {"ぁ":"あ", "ぃ":"い", "ぅ":"う", "ぇ":"え", "ぉ":"お", "ゃ":"や", "ゅ":"ゆ", "ょ":"よ", "ゎ":"わ"};
    if(st in komojiMap){
      return komojiMap[st];
    }
    return st;
  }
  const checkWord = (sw,st,player) => {
    //前に出てきたかチェック
    console.log("preword check");
    console.log(st['preWords'].indexOf(sw));
    if (st['preWords'].indexOf(sw) >= 0){
      if(player === 0){
        tell += "前に出てきた単語です。";
      }else{
        tell += "これ、前に出てきましたっけ。";
      }
      return false;
    }
    //んチェック
    console.log("nn check");
    const lc = sw.slice(-1);
    console.log(lc);
    if (lc == "ん") {
      if(player === 0){
        tell += "「ん」、が最後にきましたよ。";
      }else{
        tell += "…あーー。「ん」、つけちゃった。";
      }
      return false;
    }
    //最後の文字が繋がってるかチェック
    console.log("saigo check");
    console.log(st['lastChar']);
    console.log(sw.slice(0,1));
    if(st['lastChar'] != sw.slice(0,1)){
      tell+="前の単語の最後の文字は、「"+st['lastChar']+"」、ですよ。";
      return false;
    }
    //一文字チェック
    console.log("one check");
    console.log(sw.length);
    if(sw.length <= 1){
      tell +="一文字はダメですよ。ズルです。";
      return false;
    }
    return true;
  };
 
  const shiritoriEnd = (flg, again) => {
    if(again === 0){
      if(flg === 0){
        tell += "あなたの負けです。";
      }else if(flg === 1){
        tell += "私の負けです。";
      }else if(flg === 2){
        tell += "うっかりしました。あなたの勝ちです。";
      }else if(flg === 3){
        tell += "騙そうとしても無駄ですよ。あなたの負けです。"
      }
      tell +="もう一回やりましょう。しりとり始め。"
      status = {lastChar: 'め', preWords: [ 'しりとりはじめ' ]};
      statusRef.set(status);      
    }
    response.json({"speech": tell, "displayText": tell});
    exit;
  };
}
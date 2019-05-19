// モジュール
process.env.DEBUG = 'actions-on-google:*';
const { DialogflowApp } = require('actions-on-google');
const functions = require('firebase-functions');
const admin = require('firebase-admin');
const Promise = require('promise');
const kuromoji = require('kuromoji');

// Firebase Realtime Database
admin.initializeApp(functions.config().firebase);
const db = admin.database();

// DBの取得
function getDB (name) {
  return new Promise(function (resolve, reject) {
    db.ref('/' + name).once('value', function (snapshot) {
      resolve(snapshot.val());
    });
  });
}

// DBの更新
function setDB (name, value) {
  db.ref('/' + name).set(value);
}

// 全DBデータの取得
function getAllDB () {
  return Promise.all([getDB('dict'), getDB('player_results'), getDB('now_player'), getDB('used_word')]);
}

// 読み仮名取得
function yomigana (word) {
  return new Promise(function (resolve, reject) {
    const builder = kuromoji.builder({dicPath: 'node_modules/kuromoji/dict/'});
    builder.build(function (err, tokenizer) {
      if (err != null) {
        reject(err);
        return;
      }
      let yomi = '';
      let path = tokenizer.tokenize(word);
      path.forEach(function (v, i, a) {
        yomi += v['reading'] ? v['reading'] : '';
      });
      resolve(yomi || word);
    });
  });
}

// 単語をランダムで取得
function wordRandom (initialKey, shiritoriDict) {
  const wordDict = shiritoriDict[initialKey];
  const wordLength = Object.keys(wordDict).length;
  const wordKey = Object.keys(wordDict)[Math.floor(Math.random() * wordLength)];
  return wordDict[wordKey];
}

// 最初の単語をランダムで取得
function firstWordRandom (shiritoriDict) {
  const initalKeyLength = Object.keys(shiritoriDict).length;
  const initialKey = Object.keys(shiritoriDict)[Math.floor(Math.random() * initalKeyLength)];

  let word = '';
  do {
    word = wordRandom(initialKey, shiritoriDict);
  } while (word['good'] === false);

  return word;
}

// 次の単語をランダムで取得
function nextWordRandom (last, usedWordList, shiritoriDict) {
  let newWord = {};
  let result = null;

  do {
    // 次の文字
    do {
      newWord = wordRandom(last, shiritoriDict);
    } while (usedWordList.indexOf(newWord['word']) !== -1);

    // 使用済み
    usedWordList.push(newWord['yomigana']);
    setDB('used_word', usedWordList);

    // 最後の文字判定
    const newLast = newWord['yomigana'].slice(-1);
    result = validLastWord(newLast);
  } while (result === 'no_word' || result === 'no_kana');

  return newWord;
}

// 最初の文字判定
function validPlayerWord (word, usedWordList) {
  // 異常
  if (!usedWordList) {
    return 'no_word';
  }
  // 一文字はだめ
  if (usedWordList.length === 0) {
    return 'one_word';
  }
  // 前回と違う言葉は除外
  if (usedWordList[usedWordList.length - 1].slice(-1) !== word) {
    return 'mismatch_word';
  }

  // 成功
  return null;
}

// 最後の文字判定
function validLastWord (word) {
  // 空は終わり
  if (!word) {
    console.log('isLoseWord: no word, ' + word);
    return 'no_word';
  }

  // ンは終わり
  if (word === 'ン') {
    console.log('isLoseWord: end word, ' + word);
    return 'lose_word';
  }

  // 許可する仮名
  const shiritoriKana = [
    'ア', 'イ', 'ウ', 'エ', 'オ',
    'カ', 'キ', 'ク', 'ケ', 'コ',
    'ガ', 'ギ', 'グ', 'ゲ', 'ゴ',
    'サ', 'シ', 'ス', 'セ', 'ソ',
    'ザ', 'ジ', 'ズ', 'ゼ', 'ゾ',
    'タ', 'チ', 'ツ', 'テ', 'ト',
    'ダ', 'ヂ', 'ヅ', 'デ', 'ド',
    'ナ', 'ニ', 'ヌ', 'ネ', 'ノ',
    'ハ', 'ヒ', 'フ', 'ヘ', 'ホ',
    'バ', 'ビ', 'ブ', 'ベ', 'ボ',
    'パ', 'ピ', 'プ', 'ペ', 'ポ',
    'マ', 'ミ', 'ム', 'メ', 'モ',
    'ヤ', 'ユ', 'ヨ',
    'ラ', 'リ', 'ル', 'レ', 'ロ',
    'ワ', 'ン'
  ];

  // カタカナ以外は終わり
  if (shiritoriKana.indexOf(word) === -1) {
    console.log('isLoseWord: no kana word, ' + word);
    return 'no_kana';
  }

  // 成功
  return null;
}

// 戦果記録
function writeResult (win, nowPlayer, playerResults) {
  console.log('result: ' + nowPlayer['name'] + 'の' + (win ? '勝ち' : '負け'));

  let result = playerResults[nowPlayer['name']];
  if (!result) {
    result = {'win': 0, 'lose': 0, 'started_at': nowPlayer['started_at'], 'last_played_at': nowPlayer['started_at']};
  }

  result['win'] += win ? 1 : 0;
  result['lose'] += win ? 0 : 1;
  result['last_played_at'] = nowPlayer['started_at'];

  playerResults[nowPlayer['name']] = result;
  setDB('player_results', playerResults);
}

// メイン処理(Actins)
exports.mainAction = functions.https.onRequest((request, response) => {
  // Dialogflowのシーケンス
  const app = new DialogflowApp({request, response});
  console.log('Request headers: ' + JSON.stringify(request.headers));
  console.log('Request body: ' + JSON.stringify(request.body));

  // 開始
  function yournameResponseHandler (app) {
    getAllDB()
    .then(function (data) {
      const shiritoriDict = data[0];
      const playerResults = data[1];

      // 相手の名前
      const player = request.body.result.parameters.yourname;
      console.log(player);

      // プレイヤーの決定
      setDB('now_player', {name: player, started_at: (new Date()).getTime()});

      let message = '';

      // 過去の戦績
      const result = playerResults[player];
      if (result) {
        console.log(player + 'の成績は' + result['win'] + '勝' + result['lose'] + '敗');
        message += player + 'の成績は' + result['win'] + '勝' + result['lose'] + '敗でしたね。';
      } else {
        console.log(player + 'とは初めて');
        message += player + 'とは初めて会いましたね。';
      }

      // 最初のしりとり
      console.log('shiritori start!');
      message += 'さあ、しりとりをはじめましょう。私から行きますよ。';

      // 最初の言葉を取得
      const word = firstWordRandom(shiritoriDict);

      console.log('first word: tori-peは「' + word['word'] + '(' + word['yomigana'] + ')」と言った');
      message += '最初の言葉は、' + word['yomigana'] + 'です。' + word['yomigana'].slice(-1) + 'でお願いします。';

      // 使用済み
      setDB('used_word', [word['yomigana']]);

      // 返事する
      app.ask(message);
    });
  }

  // しりとり
  function shiritoriResponseHandler (app) {
    getAllDB()
      .then(function (data) {
        const shiritoriDict = data[0];
        const playerResults = data[1];
        const nowPlayer = data[2];
        const usedWordList = data[3];

        // 相手の言葉
        const word = request.body.result.parameters.yourword;
        let message = '';

        // 読み仮名
        yomigana(word)
          .then(function (yomi) {
            message = yomi + 'ですね。';

            // 最初の文字判定
            const first = yomi.slice(0, 1);
            console.log('first: ' + first);
            let result = validPlayerWord(first, usedWordList);
            if (result !== null) {
              switch (result) {
                case 'no_word':
                  message += '変ですね。消えませんでした。もう一度お願いします。';
                  break;
                case 'one_word':
                  message += '一文字は禁止です。もう一度お願いします。';
                  break;
                case 'mismatch_word':
                  message += 'はじめの言葉が違いますよ。もう一度お願いします。';
                  break;
              }
              // 返事する
              app.ask(message);
              return Promise.reject(new Error('error_first'));
            }

            console.log('next word: ' + 'プレイヤー' + 'は「' + word + '(' + yomi + ')」と言った');

            // 使用済み
            usedWordList.push(yomi);
            setDB('used_word', usedWordList);

            // 最後の文字判定
            let last = yomi.slice(-1);
            result = validLastWord(last);
            if (result !== null) {
              // 正常系以外
              switch (result) {
                case 'no_word':
                  message += 'その言葉は知りません。もう一度お願いします。';
                  break;

                case 'no_kana':
                  message += 'その言葉は知りません。もう一度お願いします。';
                  break;

                case 'lose_word':
                  message += 'ンがつきましたよ！あなたの負けです！';

                  writeResult(false, nowPlayer, playerResults);
                  const result = playerResults[nowPlayer['name']];
                  if (result) {
                    console.log(nowPlayer['name'] + 'の成績は' + result['win'] + '勝' + result['lose'] + '敗');
                    message += nowPlayer['name'] + 'の成績は' + result['win'] + '勝' + result['lose'] + '敗でしたね。';
                  }

                  console.log('shiritori end!');
                  message += 'もう一度チャレンジしますか？';
                  break;
              }

              // 返事する
              app.ask(message);
              return Promise.reject(new Error('error_last'));
            }

            message += '私の番です。';

            // 次の単語を取得
            let newWord = nextWordRandom(last, usedWordList, shiritoriDict);
            message += newWord['yomigana'] + 'です。' + newWord['yomigana'].slice(-1) + 'でお願いします。';

            // 最終文字判定
            last = newWord['yomigana'].slice(-1);
            result = validLastWord(last);
            if (result != null) {
              // 正常系以外
              message += 'あ！ンがついてしまいました！あなたの勝ちです！';

              writeResult(true, nowPlayer, playerResults);
              const result = playerResults[nowPlayer['name']];
              if (result) {
                console.log(nowPlayer['name'] + 'の成績は' + result['win'] + '勝' + result['lose'] + '敗');
                message += nowPlayer['name'] + 'の成績は' + result['win'] + '勝' + result['lose'] + '敗でしたね。';
              }

              console.log('shiritori end!');
              message += 'もう一度チャレンジしますか？';

              // 返事する
              app.ask(message);
              return Promise.reject(new Error('error_last_own'));
            }

            // 返事する
            app.ask(message);
          })
          .catch(function (error) {
            console.log(error);
          });
      });
  }

  // もう一回
  function againResponseHandler (app) {
    getAllDB()
    .then(function (data) {
      const shiritoriDict = data[0];
      const nowPlayer = data[2];

      // 相手の名前
      console.log(nowPlayer);

      let message = '';

      // 最初のしりとり
      console.log('shiritori start!');
      message += 'わかりました、もう一度やりましょう。私から行きますよ。';

      // 最初の言葉を取得
      const word = firstWordRandom(shiritoriDict);

      console.log('first word: tori-peは「' + word['word'] + '(' + word['yomigana'] + ')」と言った');
      message += '最初の言葉は、' + word['yomigana'] + 'です。' + word['yomigana'].slice(-1) + 'でお願いします。';

      // 使用済み
      setDB('used_word', [word['yomigana']]);

      // 返事する
      app.ask(message);
    });
  }

  // 受け答えに対応
  const actionMap = new Map();
  actionMap.set('action.yourname', yournameResponseHandler);
  actionMap.set('action.shiritori', shiritoriResponseHandler);
  actionMap.set('action.again', againResponseHandler);
  app.handleRequest(actionMap);
});
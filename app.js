// expressモジュールを読み込む
const express = require('express');
const app = express();
const path = require('path');
const fs = require('fs');
const date = require('date-utils');

// expressアプリを生成する
const http = require('http');
const port = process.env.PORT || 3000;
const server = http.createServer(app);
const io = require('socket.io')(server);

const yaku3  = ["人狼", "占い", "村人"];
const yaku8  = ["人狼", "妖狐", "占い", "村人", "村人", "村人", "村人", "狂人"];
const yaku9  = ["人狼", "人狼", "妖狐", "霊能", "占い", "狩人", "村人", "村人", "村人"];
const yaku10 = ["人狼", "人狼", "妖狐", "霊能", "占い", "狩人", "村人", "村人", "村人", "村人"];
const yaku11 = ["人狼", "人狼", "妖狐", "霊能", "占い", "狩人", "村人", "村人", "村人", "村人", "狂人"];
const yaku12 = ["人狼", "人狼", "妖狐", "霊能", "占い", "狩人", "村人", "村人", "村人", "村人", "村人", "狂人"];
const yaku13 = ["人狼", "人狼", "妖狐", "霊能", "占い", "狩人", "村人", "村人", "村人", "村人", "狂人", "共有", "共有"];
const yaku14 = ["人狼", "人狼", "妖狐", "霊能", "占い", "狩人", "村人", "村人", "村人", "村人", "村人", "狂人", "共有", "共有"];
//グローバル変数
let r = [];
let allsurvivor = [];
let gm3;
let nameList = [];
let chatLog = [];
chatLog[0] = [,];
let timeList = [];
let time;
let day = 0;
let dayFlg = 1;
let gameMode;
let roomNum = -1;
let survivor = -1;
let timer1;
let voteTotal = [];
let daiList = [];
let ayaku = [];
let vital = [];
let gameFlg = false;
let taroinu = [];
let votelist = [];

app.use('/htdocs',express.static(path.join(__dirname, '/htdocs')));
app.get('/taroinu', (req, res, next) => {
  res.sendFile(path.join(__dirname, './htdocs/index.html'))});

//io.set('heartbeat timeout', 5000);
//io.set('heartbeat interval', 5000);
io.sockets.on('connection', (socket) => {
  let id = socket.id;
  //console.log("aaaasdw" + id);
  io.to(id).emit("chatLog", {time : timeList, chat : chatLog, day : day, votelist : votelist});
  if (time != null) {
    io.to(id).emit("timerI", {time : time, day : day, dayFlg : dayFlg});
  }
  if (nameList[0]) {
    io.to(id).emit("clayout1", "");
  }
  if (nameList.length == roomNum) {
    io.to(id).emit("clayout2", "");
  }
  io.to(id).emit("touroku2", {name : nameList, vital : vital});
  socket.join("room");

  socket.on('id', (data) => {
    let id = socket.id;
    let taro = data.value;
    let taroIndex = taroinu.indexOf(taro);
    let nameF = nameList[taroIndex];
    let yakuF = yakusearch(nameF);
    socket.leave("room");
    socket.join(nameF);
    if (vital[taroIndex] === "(生存中)") {
      io.to(id).emit('reTouroku', {name : nameF, yaku : yakuF});
    } else if(taroIndex == 0) {
      io.to(id).emit('gm');
      io.to(id).emit('reTouroku2', {name : nameF, yaku : gm3});
    }
  });

  socket.on('touroku', (data) => {
    let name = data.name;
    let id = socket.id;
    let ret = nameList.indexOf(name);
    let test_array, test_array2;
    let gm;
    let jinro;
    let youko;
    let gmNo;
    let taro = data.value;
    if (taroinu.indexOf(taro) == -1) {
      //2019/05/19
      taroinu.push(taro);
      console.log(taroinu[0]);
    }
    console.log(taroinu);

    // 名前の重複禁止
    if (ret != -1) {
      io.to(id).emit("error", "");
      return;
    }
    //console.log(nameList.length);
    nameList.push(name);
    vital.push("(生存中)");
    // GM判断
    if (nameList[0] == name) {
      vital[0] = "(死亡)";
      gameMode = data.people;
      switch (gameMode) {
        case "yaku3":
          test_array = yaku3;
          break;
        case "yaku8":
          test_array = yaku8;
          break;
        case "yaku9":
          test_array = yaku9;
          break;
        case "yaku10":
          test_array = yaku10;
          break;
        case "yaku11":
          test_array = yaku11;
          break;
        case "yaku12":
          test_array = yaku12;
          break;
        case "yaku13":
          test_array = yaku13;
          break;
        case "yaku14":
          test_array = yaku14;
          break;
      }
      test_array2 = test_array.slice();
      roomNum = test_array.length;
      survivor = roomNum - 1;
      gm = test_array2.slice();
      jinro = searchArray(gm, "人狼");
      for (i = 0 ; i < jinro.length; i++) {
        if (jinro[i] >= 0){
          gm.splice(jinro[i] - i, 1);
        }
      }
      youko = searchArray(gm, "妖狐");
      for (i = 0 ; i < youko.length; i++) {
        if (youko[i] >= 0){
          gm.splice(youko[i] - i, 1);
        }
      }
      gm3 = randomH(gm, 1);
      console.log(`jinro::${gm}`);
      console.log("aaaaa:::" + gm3);
      gmNo = searchArray(test_array2, gm3[0])
      if (gmNo[0] >= 0){
        test_array2.splice(gmNo[0], 1);
      }
      r = randomH(test_array2, roomNum - 1);
      console.log(`${r}`);
      io.to(id).emit("gm", "");
      io.emit("gm2", "");
    }

    socket.leave("room");
    socket.join(name);
    if (nameList.length == roomNum) {
      io.to("room").emit("clayout2", "");
    }
    if (nameList.length == 1){
      
      io.to(name).emit("touroku1", {value : gm3[0], name : name});
    }
    if (nameList.length >= 2){
      io.to(name).emit("touroku1", {value : r[nameList.length-2], name : name});
    }
    io.emit("touroku2", {name : nameList, vital : vital});
});

socket.on('stext1', (data) => {
  let name = data.name;
  let yaku = data.yaku;
  let myColor = data.myColor;
  let ntime1 = new Date();
  let ntime2 = ntime1.toFormat("HH24:MI:SS");
  let dataname = data.message;
  let fontSize = data.fontSize;

  // console.log(`${chatLog[1][1]}さんが${chatLog[1][0]}を発言した`);
  // console.log(`${data.name}`);
  if (dayFlg == 1) { //昼
    if (gameFlg === true) {
      timeList.push([[ntime2], [day]]);
      chatLog.push([[dataname], [name]]);
    }
    io.emit("ctext1", {value : dataname, date : ntime2, name : name, myColor : myColor, fontSize : fontSize});
  } else if (dayFlg == 3) {　// 夜
    if (yaku === "人狼") {
      let serA = searchArray(r, "人狼");
      //console.log(serA);
      socket.broadcast.emit("ctext2", {value : dataname, date : ntime2, name : name, myColor : "red", gmyaku : gm3[0], fontSize : fontSize});
      io.to(nameList[0]).emit("ctext1", {value : dataname, date : ntime2, name : name, myColor : myColor, fontSize : fontSize});
      io.to(nameList[serA[0] + 1]).emit("ctext1", {value : dataname, date : ntime2, name : name, myColor : myColor, fontSize : fontSize});
      io.to(nameList[serA[1] + 1]).emit("ctext1", {value : dataname, date : ntime2, name : name, myColor : myColor, fontSize : fontSize});
      io.to("room").emit("ctext1", {value : dataname, date : ntime2, name : name, myColor : myColor, fontSize : fontSize});
    
    } else if(yaku === "共有") {
      let serB = searchArray(r, "共有");
      io.to(nameList[0]).emit("ctext1", {value : dataname, date : ntime2, name : name, myColor : myColor, fontSize : fontSize});
      io.to(nameList[serB[0] + 1]).emit("ctext1", {value : dataname, date : ntime2, name : name, myColor : myColor, fontSize : fontSize});
      io.to(nameList[serB[1] + 1]).emit("ctext1", {value : dataname, date : ntime2, name : name, myColor : myColor, fontSize : fontSize});
      io.to("room").emit("ctext1", {value : dataname, date : ntime2, name : name, myColor : myColor, fontSize : fontSize});
    
    } else if(name !== nameList[0]) {
      //if (name != nameList[0]) {
      io.to(nameList[0]).emit("ctext1", {value : dataname, date : ntime2, name : name, myColor : myColor, fontSize : fontSize});
      //}
      io.to(name).emit("ctext1", {value : dataname, date : ntime2, name : name, myColor : myColor, fontSize : fontSize});
      io.to("room").emit("ctext1", {value : dataname, date : ntime2, name : name, myColor : myColor, fontSize : fontSize});
    } else {
      io.emit("ctext1", {value : dataname, date : ntime2, name : name, myColor : myColor, fontSize : fontSize});
    }
  } else if (dayFlg == 3) {


  } else if (dayFlg == 2) {
    
  }
});
  socket.on("mouseover", (data) => {
    let chatFind = chatLog.slice();
    const after = chatFind.filter(elm => {
      //console.log(elm[1] == data.value);
      //console.log(`${elm[1]}\n::::${data.value}`);
      return (elm[1] == data.value);
    });
    let id = socket.id;
    let after2 = "";

    for (cnt = 0, i = after.length - 1; i >= 0 && cnt < 10; i--, cnt++) {
      after2 += after[i][0] + "\n";
    }
    io.to(id).emit("momsg", {value : after2, chatCnt : after.length});
    //console.log(after2);  

  });

  socket.on("gameStart", () => {
    //let yaku = data.yaku;
      gameFlg = true;
      dayFlg = 3;
      let randomU;
      let youko;
      let uranai = r.indexOf("占い");
      let yakuLi = r.slice();
      let nameLi = nameList.slice(1);

      if (youko >= 0) {
        yakuLi.splice(uranai, 1);
        nameLi.splice(uranai, 1);
      }
      youko = r.indexOf("妖狐");
      if (youko >= 0) {
        yakuLi.splice(youko, 1);
        nameLi.splice(youko, 1);
      }

      randomU = Math.round( Math.random() * (yakuLi.length - 1));
/*       if(youko == randomU) {
        allsurvivor.splice(youko,1);
        io.to(nameList[youko + 1]).emit("hanging");
        io.emit("hanging2", {hang : nameList[youko + 1], survivor : survivor, flg : false});
        io.to(nameList[uranai + 1]).emit("yakuR", {data : "人間", value : nameList[youko + 1], flg : true});
        vital[youko] = "(死亡)";
        survivor--;

      } {*/  
        if (yakuLi[randomU] !== "人狼") {
          io.to(nameList[uranai + 1]).emit("yakuR", {data : "人間", value : nameLi[randomU], flg : true});
        } else {
          io.to(nameList[uranai + 1]).emit("yakuR", {data : "人狼", value : nameLi[randomU], flg : true});
        }
    //}
    allsurvivor = nameList.slice(1);
    socket.broadcast.emit("vote", {value : allsurvivor});
    //socket.broadcast.emit("ability", {value : gameMode});
    timerC();
    io.emit("gameStart", {time : time, day : day, dayFlg : dayFlg});  
  });


  socket.on("cnt0", () => {
    time = 1;
  });

  socket.on("reset", () => {
    nameList = [];
    timeList = [];
    voteTotal = [];
    vital = [];
    taroinu = [];
    votelist = [];
    me = "";
    clearInterval(timer1);
    time = null;
    day = 0;
    dayFlg = 1;
    gameFlg = false;
    //console.log("リセットしたよ！");
    io.emit("everyone", "");
  });

  socket.on("reset2", (data) => {
    name = data.name;
    socket.leave(name);
    io.emit("reload", "");
  });

  socket.on("target", (data) => {
    let target2 = data.target2;
    let target = data.target;
    let yaku = data.yaku;
    let len = data.len;
    //console.log(target);
    if (yaku === "人狼") {
      let serA = searchArray(r, "人狼");
      io.to(nameList[serA[0] + 1]).emit("target2", {target : target, target2 : target2, len : len});
      io.to(nameList[serA[1] + 1]).emit("target2", {target : target, target2 : target2, len : len});
    }
  });

  socket.on("yaku1", (data) => {
    let name = data.name;
    let id = socket.id;
    let nameY = chikanList(allsurvivor);
    //console.log("idx;;;;;;;" + nameY);
    let idx = searchArray(nameY, "人狼");
    //console.log("idx;;;;;;;" + idx);
    let list;

    if (roomNum == 3 || roomNum == 8) {
      list = allsurvivor.slice();
      // console.log("aaaaaaa " + list );
      io.to(id).emit("result", {value : list});
    } else if (roomNum == 9 || roomNum == 10 || roomNum == 11 || roomNum == 12 || roomNum == 13 || roomNum == 14) {
      list = allsurvivor.slice();
      if (idx[0] >= 0) {
        list.splice(idx[0], 1);
      }
      if (idx[1] >= 0) {
        list.splice(idx[1] - 1, 1);
      }
      io.to(id).emit("result", {value : list});
    }
    //console.log("fgridx;;;;;fe;;" + nameY);
  });

  socket.on("yaku2", (data) => {
    let name = data.name;
    if (name !== nameList[0]) {
      let id = socket.id;
      let list = allsurvivor;
            //console.log("aaaaaaa " + list );
      io.to(id).emit("result", {value : list});
    }
    
  });

  socket.on("yaku4", (data) => {
    let name = data.name;
    if (name !== nameList[0]) {
      let id = socket.id;
      let list = daiList;
      //console.log(`dai:::::${daiList}`)
      
      io.to(id).emit("result", {value : list});
    }
   
  });

  socket.on("yaku3", (data) => {
    let id = socket.id;
    ayaku.push([data.select, data.name, data.yaku]);
    //console.log("生きている役職の数：：：：" + numAsurvivor(chikanList(allsurvivor)));
    if (numAsurvivor(chikanList(allsurvivor)) == ayaku.length) {
      //console.log(ayaku[0][2]);
      // 狩人
      let kariS;
      let uraS;
      let kamiS;
      let reiS;
      let reiF;
      let uraF;
      let isYouko;
      let isSrei;
      let me = "";
      let kamiYouko;

      for (i = 0; i < ayaku.length; i++) {
        if (ayaku[i][2] === "狩人") {
          kariS = ayaku[i][0];
        } else if (ayaku[i][2] === "占い") {
          uraS = ayaku[i][0];
          uraF = ayaku[i][1];
        } else if (ayaku[i][2] === "霊能"){
          reiS = ayaku[i][0];
          reiF = ayaku[i][1];
        } else {
          kamiS = ayaku[i][0];
        }
      }
      kamiYouko = yakusearch(kamiS);
      //console.log("チェック" + kamiYouko);
      if (!(kariS === kamiS || kamiYouko === "妖狐")) {
        let r1 = allsurvivor.indexOf(kamiS);
        if (r1 >= 0) {
          allsurvivor.splice(r1, 1);
          io.to(kamiS).emit("hanging");
          io.emit("hanging2", {hang : kamiS, survivor : survivor, flg : false});
          vital[nameList.indexOf(kamiS)] = "(死亡)";
          survivor--;
        }
      }

      isYouko = yakusearch(uraS);

      if(isYouko === "妖狐") {
        let r1 = allsurvivor.indexOf(uraS);
        if (r1 >= 0) {
          allsurvivor.splice(r1, 1);
          io.to(uraS).emit("hanging");
          io.emit("hanging2", {hang : uraS, survivor : survivor, flg : false});
          io.to(uraF).emit("yakuR", {data : "人間", value : uraS, flg : true});
          vital[nameList.indexOf(uraS)] = "(死亡)";
          survivor--;
        } 
      } else {
        if (isYouko !== "人狼") {
          io.to(uraF).emit("yakuR", {data : "人間", value : uraS, flg : true});
        } else {
          io.to(uraF).emit("yakuR", {data : "人狼", value : uraS, flg : true});
        }
      }

      isSrei = yakusearch(reiS);
      if(isSrei !== "人狼") {
        io.to(reiF).emit("yakuR", {data : "人間", value : reiS, flg : false});
      } else {
        io.to(reiF).emit("yakuR", {data : "人狼", value : reiS, flg : false});
      }
      //console.log("abcdefg" + ayaku);
      ayaku = [];
      //console.log("初期化配列確認" + ayaku);
      me = gameFinish()
      if (me !== "") {
        io.emit("finish", {value : me, nameList : nameList, r : r, gm3 : gm3});
      }
   }
    
  });

  socket.on("voteR", (data) => {
    let select = data.select;
    let name = data.name;
    let hang;
    daiList = [];
    voteTotal.push(select);
    votelist.push([[name], [select], [day]]);
    io.emit("voteRR", {select : select, name : name}); 
    //console.log(voteTotal);
    
    //console.log(survivor + ":" + voteTotal.length);
    if (survivor == voteTotal.length) {
      let list = [];
      let cnt;
      let rr;
      for (i = 0; i < nameList.length; i++){
        cnt = 0;
        list.push(voteTotal[i]);
        for(j = 0; j < voteTotal.length; j++) {
          if (nameList[i + 1] === voteTotal[j]) {
            cnt++;
          }
        }
        list[i] = cnt;
        //console.log("aa"+ Math.max.apply(null, list));
      }
      rr = searchArray(list, Math.max.apply(null, list));
      let yaku;
      if (rr.length == 1) {
        yaku = rr[0] + 1;
        hang = nameList[yaku];
      } else if (rr.length >= 2) {
        let rnum;
        //console.log("同票なのだよ");
        rnum = randomH(rr, 1);
        yaku = rnum[0] + 1;
        hang = nameList[yaku];
      }
      //console.log("確定だああああ：" + hang + "さんです！！");
      voteTotal = [];
      let yaku2 = searchArray(allsurvivor, hang);
      //console.log("yaku2:::" + yaku2);
      daiList.push(allsurvivor[yaku2[0]]); 
      //console.log(`dai:::::${daiList}`)
      if (yaku2 >= 0) {
        allsurvivor.splice(yaku2[0], 1);
      }
      //console.log("allsurvivor:::" + allsurvivor);
      io.to(hang).emit("hanging");
      io.emit("hanging2", {hang : hang, survivor : survivor, flg : true});
      vital[nameList.indexOf(hang)] = "(死亡)";
      survivor--;
      me = gameFinish();
      if (me !== "") {
        io.emit("finish", {value : me, nameList : nameList, r : r, gm3 : gm3});
        clearInterval(timer1);
      }
    }
  });

  socket.on("extension", (data) => {
    time += 60;
    io.emit("extension");
  });

  socket.on("stop" , (data) => {
    clearInterval(timer1);
    io.emit("stop");
  });

  socket.on("start" , (data) => {
    timerC(time);
  });

  socket.on("roomT", (data) => {
    socket.join("room");
    socket.leave(data.value);
  });

  socket.on("voteCreate", (data) =>{
    let id = socket.id;
    let name = data.name;
    for (i = 0; i <  allsurvivor.length; i++) {
      if (allsurvivor[i] === name) {
        io.to(id).emit("vote", {value : allsurvivor});
      }
    }
  });

  socket.on("bResult", () => {
    let id = socket.id;
    io.to(id).emit("god", {value : me, nameList : nameList, r : r, gm3 : gm3});
  });

  socket.on("nameList", () => {
    let id = socket.id;
    io.to(id).emit("nameListR", {value : nameList});
  });


  socket.on('disconnect', () => {
  });
});



//乱数配列を作成関数
randomH = (array, num) => {
  let r = [];
  let a = array;
  let t = [];
  let l = array.length;
  let n = num < l ? num : l;
  //console.log(`nは${n}`);
  for (; n-- > 0 ;) {
    let i = Math.random() * l | 0;
    //console.log(`iは${i} lは${l} nは${n}`);
    r[n] = t[i] || a[i];
    --l;
    t[i] = t[l] || a[l];
    //console.log(`${11-n}回目\n${t}\n${r}`)
  }
  return r;
}

let timerC = (restTime) => {
  if(!restTime){
    let timeSet;
    if (dayFlg == 1){
      timeSet = 30;
      time = timeSet;
  
    } else if (dayFlg == 2) {
      timeSet = 180;
      time = timeSet;
    } else if (dayFlg == 3) {
      timeSet = 180;
      time = timeSet;
    } else if (dayFlg == 4) {
      timeSet = 20;
      time = timeSet;
    }

  
    io.emit("timerI", {time : time, day : day, dayFlg : dayFlg});
  } else {
    time = restTime;
    io.emit("startTimer", {time : time, day : day, dayFlg : dayFlg});
  }
  //console.log("送信");
  timer1 = setInterval(() => {
    timeDown();
    if (time == 0) {
      clearInterval(timer1);
      if (dayFlg == 3){
        day++;
      }
      if (dayFlg == 1) {
        dayFlg = 2;
      } else if (dayFlg == 2) {
        dayFlg = 3;
      } else if (dayFlg == 3) {
        dayFlg = 4;
      } else if (dayFlg == 4) {
        dayFlg = 1;
      }
      timerC();
    }
  }, 1000);
  timeDown = () => {
    time--;
    //console.log(time);
  }
}

let searchArray = (array, moji) => {
  let idx = [];
  let array1 = array;
  let moji1 = moji;

  idx[0] = array1.indexOf(moji1);
  for (i = 0; idx[i] != -1; i++) {
    idx[i + 1] = array1.indexOf(moji1, idx[i] + 1);
  }
  idx.pop();
  return idx;
}

let numAsurvivor = (yakusurvivor) => {
  let count = 0;

  for (i = 0; i < yakusurvivor.length; i++) {
    if (isAsurvivor(yakusurvivor[i])) {
      count++; 
    }
  }
  return count;
}

let isAsurvivor = (myyaku) => {
  if (myyaku === "人狼" ||
      myyaku === "狩人" ||
      myyaku === "占い" ||
      myyaku === "霊能") {
        return 1;
  }
  return 0;
}

let yakusearch = (name) => {
    let num =  nameList.indexOf(name);
    return r[num -1];
}

let chikanList = (list) => {
  let aaa = list.slice();
  for (i = 0; i < list.length; i++) {
    aaa[i] = yakusearch(list[i]);
  } return aaa;
}

let gameFinish = () => {
  let aaa = chikanList(allsurvivor);
  //console.log(aaa);
  let cnt = 0;
  let me;
  for (i = 0; i < aaa.length; i++) {
    if (aaa[i] === "人狼"){
      cnt++;
    }
  }
  //console.log("cnt:::::::" + cnt);
  if (cnt == 0) {
    if(aaa.indexOf("妖狐") >= 0) {
      return me = "妖狐の勝ち"; 
    } else {
      return me = "村人の勝ち"
    }
  } else if (cnt == (aaa.length - cnt)) {
    if(aaa.indexOf("妖狐") >= 0) {
      return me = "妖狐の勝ち"; 
    } else {
      return me = "人狼の勝ち"
    }
  } return me = ""
}

server.listen(port, () => console.log(`Listening on Port 3000`));


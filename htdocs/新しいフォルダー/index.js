let socket = io.connect();
let enterFlg = false;
let name = "";
let day;
let noon2;
let night2;
let gameMode;

// 送信
window.onload=() => {
    document.getElementById("button1").onclick=(e) => {
        if (enterFlg) {
            let message = document.getElementById("textbox1").value;
            document.getElementById("textbox1").value = "";
            socket.emit("stext1", {message : message, name : name});
        } else {
            enterFlg = true;
            //document.getElementById("main").style.display = "block";
            document.getElementById("button1").value = "発言する";
            name = document.getElementById("textbox1").value;
            let people = document.getElementById("people").value;
            document.getElementById("textbox1").value = "";
            socket.emit("touroku", {name : name, people : people});
        }
        console.log(`${enterFlg}`);
        e.preventDefault();
    }
}

socket.on("error", (data) => {
    alert("名前が重複しています！");
    location.reload(); /* @@@@@ */
});

enterkey = (code) => {
    //エンターキー押下なら
    if (13 === code) {
        document.getElementById("button1").click();
    }
    return;
}


// 受信
socket.on("ctext1", (data) => {
    let message = "";

    message += data.date + " > [" + data.name + '] ' + data.value + "\n";
 // console.log(`${data.date}`);
    //document.getElementById("textarea1").innerHTML += message;
    //goBottom("textarea1");
    let table = document.getElementById("table");
    let row = table.insertRow(0);
    let cell1 = row.insertCell(-1);
    cell1.className = data.name;
    cell1.onmouseover = () => {
        let cell1_cname = cell1.className;
        socket.emit("mouseover", {value : cell1_cname})
        console.log(`${cell1_cname}`);
    }
    cell1.onmouseout = () => {
        document.getElementById("poptext1").style.display = "none";
    }

    //let cell2 = row.insertCell(-1);
    cell1.innerHTML = "" + message;
    
    //cell2.innerHTML = "行２を追加";
});

socket.on("clayout1", (data) => {
    document.getElementById("roomNum").style.display = "none";
});
socket.on("clayout2", (data) => {
    document.getElementById("roomBtn").style.display = "none";
    document.getElementById("header").innerText = `あなたは観戦者です。`;
});

socket.on("touroku1", (data) => {
    let yaku = data.value;
    let name = data.name;
    // console.log(`${yaku}`);
    document.getElementById("header").innerText = `${name}さんは${yaku}です。`;
});

socket.on("touroku2", (data) => {
    let namelist = data.name;
    let namelist2 = "";

    for (i = 0; i < namelist.length; i++) {
      namelist2 += namelist[i] + "\n";
    }
    document.getElementById("sidebar").innerText = namelist2;
});

socket.on("gm", (data) => {
    
    let start_btn = document.getElementById("start_button");
    let element_btn = document.createElement("input");
    let btnFlg = false;
    element_btn.type = 'button';
    element_btn.id = 'button2'
    element_btn.value = "スタート";
    element_btn.onclick = () => {
        if (btnFlg == false) {
            btnFlg = true;
            console.log(`btnFlg::::${btnFlg}`);
            socket.emit("gameStart", "");
            element_btn.value = "カウント０";
        } else {
            socket.emit("cnt0", "");
        }

    }
    start_btn.appendChild(element_btn);
    //document.getElementById("roomNum").style.display = "none";
});

socket.on("vote", (data) => {
    let vote = document.getElementById("vote");
    let nameList = data.value;
    let element_vote = document.createElement("input");
    let label = document.createElement("label");

    label.innerHTML = nameList[1];
    element_vote.type = "radio";
    element_vote.name = "radio_btn";    
    element_vote.value = nameList[1];
    vote.appendChild(element_vote);
    vote.appendChild(label);
    for (i = 2; i < nameList.length; i++) {
        let clone0 = vote.childNodes[0].cloneNode(true);
        let clone1 = vote.childNodes[1].cloneNode(true);

        vote.appendChild(clone0);
        vote.appendChild(clone1);
        let j = 2 * i - 2;
        vote.childNodes[j].value = nameList[i];
        vote.childNodes[j + 1].innerHTML = nameList[i];
    }
});

socket.on("momsg", (data) => {
    let motext = data.value;

    document.getElementById("poptext1").style.display = "block";
    document.getElementById("text").innerText = motext;
});

socket.on("chatLog", (data) => {
    let table = document.getElementById("table");
    let row;
    let cell1;
    let timeList = data.time;
    let chatList = data.chat;
    let message = "";
    for (i = 0; i < timeList.length; i++) {
        row = table.insertRow(0);
        cell1 = row.insertCell(-1);
        message = "";
        message += timeList[i] + " > [" + chatList[i+1][1] + '] ' + chatList[i+1][0] + "\n";
        cell1.innerHTML = "" + message;
    }
});
socket.on("gameStart", (data) => {
    if (data.dayFlg) {
        night1(data.time, data.day);
    } else {
        noon1(data.time, data.day);
    }

});
socket.on("timerI", (data) => {
    if (data.dayFlg){
        night1(data.time, data.day);
    } else {
        noon1(data.time, data.day);
    }
});
socket.on("cnt0", (data) => {
    if (data.dayFlg) {
        clearInterval(night2);
        night1(data.time, data.day);
    } else {
        clearInterval(noon2);
        noon1(data.time, data.day);
    }
});

let noon = () => {
    let time = document.getElementById("time");
    let timeSet = 300;
    noon2 = setInterval(() =>{
        if (timeSet >= 0) {
            time.innerHTML = `${day}日目の昼の時間<br>${Math.floor(timeSet / 60)}分${timeSet % 60}秒`;
            timeSet--;
        } else {
            clearInterval(noon2);
            return night();
        }
    }, 1000);
}
let night = () => {
    let time = document.getElementById("time");
    let timeSet = 180;
    night2 = setInterval(() =>{
        if (timeSet >= 0) {
            time.innerHTML = `${day}日目の夜の時間<br>${Math.floor(timeSet / 60)}分${timeSet % 60}秒`;
            timeSet--;
        } else {
            day++;
            clearInterval(night2);
            return noon();
        }
    }, 1000);
}

let noon1 = (time, day1) => {
    let time1 = document.getElementById("time");
    let timeSet = time;
    day = day1;
    noon2 = setInterval(() =>{
        if (timeSet >= 0) {
            time1.innerHTML = `${day}日目の昼の時間<br>${Math.floor(timeSet / 60)}分${timeSet % 60}秒`;
            timeSet--;
        } else {
            clearInterval(noon2);
            return night();
        }
    }, 1000);
}
let night1 = (time, day1) => {
    let time1 = document.getElementById("time");
    let timeSet = time;
    day = day1;
    night2 = setInterval(() =>{
        if (timeSet >= 0) {
            time1.innerHTML = `${day}日目の夜の時間<br>${Math.floor(timeSet / 60)}分${timeSet % 60}秒`;
            timeSet--;
        } else {
            day++;
            clearInterval(night2);
            return noon();
        }
    }, 1000);
}


let socket = io.connect();
let enterFlg = false;
let name = "";
let day = 0;
let gameMode;
let dayFlg;
let yaku = null;
let time;
let timer1;
let mX;
let mY;
let myColor = null;


// 送信
window.onload=() => {
    if (document.cookie.indexOf("taroinu") != -1) {
        console.log(document.cookie);
        socket.emit("id",{value:document.cookie});
    }
    document.getElementById("button1").onclick=(e) => {
        if (enterFlg) {
            let fontSize = document.getElementById("fontSize").value;
            let message = document.getElementById("textbox1").value;
            let sele = document.getElementById("fontSize").getElementsByTagName('option');
            document.getElementById("textbox1").value = "";
            if (message === "") {
                /* messageが空白だったら何もしない */
            } else {
                socket.emit("stext1", {message : message, name : name, yaku : yaku, myColor : myColor, fontSize : fontSize});
                sele[0].selected = true;    
            }
            //let table = document.getElementById("table");
            //let row, cell;
            //let abilityText = nameList[nameList.length - 1] + " さんが入村しました。";
            //row = table.insertRow(0);
            //cell = row.insertCell(-1);
            //cell.innerHTML = "" + abilityText;

        } else {
            //document.getElementById("main").style.display = "block";
            let people = document.getElementById("people").value;
            name = document.getElementById("textbox1").value;
            document.getElementById("textbox1").value = "";
            if (name !== "" && name.length < 7) {
                if (document.cookie.indexOf("taroinu" ) == -1) {
                    enterFlg = true;
                    document.getElementById("button1").value = "発言";
                    const l = 16;
                    const c = "abcdefghijklmnopqrstuvwxyz0123456789";
                    let cl = c.length;
                    let r = "";
                    for (i = 0; i < l; i++) {
                        r += c[Math.floor(Math.random()*cl)];
                    }
                    //2019/05/19
                    document.cookie = 'taroinu=' + r + '; max-age=7200;';
                    let taroinu = document.cookie;
                    console.log(taroinu);
                    socket.emit("touroku", {name : name, people : people, value : taroinu});
                } else {
                    let taroinu = document.cookie;
                    console.log(taroinu);
                    alert("あなたは既に入室しています");
                }
            } else {
                alert("名前を指定してください！");
                //location.reload();
            }
        }
        console.log(`${enterFlg}`);
        document.body.addEventListener("mousemove", (e2) =>{
            mX = e2.pageX;
            mY = e2.pageY;
        });
        e.preventDefault();
    }
}

socket.on("error", (data) => {
    document.cookie = 'taroinu=; max-age=0;';
    alert("名前が重複しているか、７文字以上！");
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
    let nameW = data.name;
    let colorSet = data.myColor;
    let message1 = "";
    let message2 = "";
    let message3 = "";
    let mflg = data.flg;
    let table = document.getElementById("table" + day);
    let row1 = table.insertRow(0);
    let row2 = table.insertRow(0);
    row1.style.width = "550px";
    row2.style.width = "550px";
    let cell1 = row1.insertCell(-1);
    let cell3 = row2.insertCell(-1);
    let cell2 = row2.insertCell(-1);
    let fontSize1 = data.fontSize;

    //message += data.date + " > [" + nameW + '] ' + data.value + "\n";
    message1 += nameW;
    //message2 += `<font size="${fontSize1}">${data.value}\n</font>`;
    message2 += `<font size="${fontSize1}"></font>`;
    message3 += data.value;
    //cell1.style.borderBottomStyle = "solid";
    //cell1.style.borderBottomColor = "rgba(255, 255, 255, 0.5)";
    //cell2.style.borderBottomStyle = "solid";
    //cell2.style.borderBottomColor = "rgba(255, 255, 255, 0.5)";
    cell1.className = nameW;
    cell1.style.width = "50px";
    cell1.style.height = "10px";
    cell1.style.fontSize = "15px";
    cell1.style.whiteSpace = "nowrap";
    cell2.style.width = "500px";
    cell1.style.color = colorSet;
        cell1.onmouseover = () => {
            let cell1_cname = cell1.className;
            socket.emit("mouseover", {value : cell1_cname})
            console.log(`${cell1_cname}`);
        }
        cell1.onmouseout = () => {
            document.getElementById("poptext1").style.display = "none";
        }
    cell1.innerText = "" + message1;
    cell2.innerHTML += message2;
    cell2.childNodes[0].innerText = "" + message3;
    cell3.style.backgroundImage = 'url(htdocs/magic.png)';
});

socket.on("ctext2", (data) => {
    //let gmyaku = data.gmyaku;
    if(!(yaku === "人狼" || yaku === null)) {
        let nameW = data.name;
        let colorSet = data.myColor;
        //let message1 = "";
        let table = document.getElementById("table" + day);
        let row = table.insertRow(0);
        row.style.width = "930px";
        let cell1 = row.insertCell(-1);
        let cell2 = row.insertCell(-1);
        //cell1.style.borderBottomStyle = "solid";
        //cell1.style.borderBottomColor = "rgba(255, 255, 255, 0.5)";
        //cell2.style.borderBottomStyle = "solid";
        //cell2.style.borderBottomColor = "rgba(255, 255, 255, 0.5)";
        cell2.className = nameW;
        cell1.style.width = "130px";
        cell2.style.width = "800px";
        cell2.style.color = colorSet;
        cell2.innerText = "アウォオオオオオオオン";
    }

});

socket.on("clayout1", (data) => {
    //document.getElementById("roomNum").style.visibility = "hidden";
    //2019/05/19
    document.getElementById("roomNum").style.display = "none";
});
socket.on("clayout2", (data) => {
    //2019/05/19
    document.getElementById("roomNum").style.display = "none";
    //document.getElementById("roomBtn").style.visibility = "hidden";
    document.getElementById("header").innerText = `あなたは観戦者です。`;
});

socket.on("touroku1", (data) => {
    yaku = data.value;
    let name = data.name;
    // console.log(`${yaku}`);
    document.getElementById("header").innerText = `${name}さんは${yaku}です。`;

});

socket.on("touroku2", (data) => {
    const tdelete = document.getElementById("sidebar");
    while (tdelete.firstChild) {
        tdelete.removeChild(tdelete.firstChild);
    }
    let nameList = data.name;
    let vital = data.vital;
    let table = document.getElementById("sidebar");
    let row;
    let cell1, cell2, cell3, cell4;

    for (i = 0; i < nameList.length; i++) {
        row = table.insertRow(-1);
        cell1 = row.insertCell(-1);
        cell2 = row.insertCell(-1);
        cell3 = row.insertCell(-1);
        cell4 = row.insertCell(-1);
        cell1.innerHTML = nameList[i];
        cell2.innerHTML = vital[i];
        cell3.innerHTML = "<input type='text' autocomplete='off' id='memo" + i + "'class='textD' value='' style='width:65px; text-align:left; height='20px';>";
        cell4.innerHTML = "前日の投票先";
    }
});

socket.on("gm", (data) => {
    let start_btn = document.getElementById("start_button");
    let element_btn = document.createElement("input");
    let btnFlg = false;
    let linebreak = document.createElement("br");
    let stopFlg = false;

    
    element_btn.type = 'button';
    element_btn.id = 'button2'
    element_btn.value = "スタート　";
    element_btn.onclick = () => {
        if (btnFlg == false) {
            btnFlg = true;
            console.log(`btnFlg::::${btnFlg}`);
            socket.emit("gameStart", {yaku : yaku});
            element_btn.value = "カウント０";
        } else {
            socket.emit("cnt0", "");
        }
    }
    start_btn.appendChild(element_btn);
    
    c = start_btn.childNodes[0].cloneNode(true);
    start_btn.appendChild(c);
    start_btn.childNodes[1].id = "resetGame";
    start_btn.childNodes[1].value = "リセット　"; 
    start_btn.childNodes[1].onclick = () => {
        socket.emit("reset", "");
    }
    start_btn.appendChild(linebreak);
    c = start_btn.childNodes[0].cloneNode(true);
    start_btn.appendChild(c);
    start_btn.childNodes[3].id = "extension";
    start_btn.childNodes[3].value = "延長　　　";
    start_btn.childNodes[3].onclick = () => {
        socket.emit("extension", "");
    }
    c = start_btn.childNodes[0].cloneNode(true);
    start_btn.appendChild(c);
    start_btn.childNodes[4].id = "stop";
    start_btn.childNodes[4].value = "ストップ　";
    start_btn.childNodes[4].onclick = () => {
        if(!stopFlg){
            stopFlg = true;
            start_btn.childNodes[4].value = "スタート　";
            socket.emit("stop", "");
        } else {
            stopFlg = false;
            start_btn.childNodes[4].value = "ストップ　";
            socket.emit("start", "");
        }
    }
});

socket.on("extension", (data) => {
    time += 60;
});

socket.on("stop", (data) => {
    clearInterval(timer1);
});


socket.on("gm2", (data) => { 
    document.getElementById("roomNum").style.display = "none";
});

socket.on("result", (data) => {
    if(name !== ""){
        let list = data.value;
        let listLen = list.length;
        let idx = list.indexOf(name);
        let yakuB = document.getElementById("yaku");
        let elR = document.createElement("input");
        let elL = document.createElement("label");
        let label = document.createElement("label");
        let cY, cL;
        let backF = false;
   
        while (yakuB.firstChild) {
            yakuB.removeChild(yakuB.firstChild);
        }
        label.innerHTML = "能力";
        label.style.marginRight = "8px";
        if (idx >= 0) {
            list.splice(idx, 1);
            listLen = list.length;
        }
        console.log(list);
        if (listLen > 0) {
            elR.type = "radio";
            elR.name = "yaku_radio";
            elR.id = "yaku_radio1";
            elR.value = list[0];
            elR.disabled = false;
            elR.style.display = "none";
            elL.innerHTML = "<div class=label>" + list[0] + "</div>";
            elL.id = "yaku_label1";
            elL.className = "yakuLa";
            elL.htmlFor = "yaku_radio1";
            elL.style.display = "inline-flex";
            elL.style.width = "70px";
            elL.style.height = "25px";
            elL.style.border = "solid";
            elL.style.borderRadius = "4px";
            elL.style.borderColor = "#006DD9";
            elL.style.textAlign = "center";
            elL.style.margin = "4px";
            elL.style.alignItems = "center";
            elL.style.justifyContent = "center";
            elL.style.backgroundColor = "#f6f3f4";
            elL.style.color = "black";

            yakuB.appendChild(label);
            yakuB.appendChild(elR);
            yakuB.appendChild(elL);
            
            for (i = 1; i < listLen; i++) {
                cY = yakuB.childNodes[1].cloneNode(true);
                cL = yakuB.childNodes[2].cloneNode(true);
                yakuB.appendChild(cY);
                yakuB.appendChild(cL);
                yakuB.childNodes[2 * i + 1].value = list[i];
                yakuB.childNodes[2 * i + 1].id = "yaku_radio" + (i + 1);
                yakuB.childNodes[2 * i + 2].innerHTML = "<div class=label>" + list[i] + "</div>";
                yakuB.childNodes[2 * i + 2].id = "yaku_label" + (i + 1);
                yakuB.childNodes[2 * i + 2].htmlFor = "yaku_radio" + (i + 1);
            }

            for (i = 0; i < listLen; i++) {
                let bbb = document.getElementById("yaku_label" + (i + 1));
                let ddd = document.getElementsByClassName("label");
                ddd[i].style.fontSize = "10px";
                bbb.onclick = () => {
                    for (j = 0; j < listLen; j++) {
                        let ccc = document.getElementById("yaku_label" + (j + 1));
                        ccc.style.backgroundColor = "#f6f3f4";
                    }
                    bbb.style.backgroundColor = "#31A9EE";
                }
            }

            if (yaku === "人狼") {
                let yakuId;
                for (i = 1; i < listLen; i++) {
                    let target;
                    let target2;
                    
                    yakuId = document.getElementById("yaku_radio" + (i + 1));
                    yakuLa = document.getElementById("yaku_label" + (i + 1));
                    target = yakuId.id;
                    target2 = yakuLa.id;     
                    yakuId.onclick = () => {
                        socket.emit("target", {target : target, target2 : target2, yaku : yaku, len : listLen});
                    };
                }
            }
        }
        try {
            yakuB.childNodes[1].checked = true;
            yakuB.childNodes[2].style.backgroundColor = "#31A9EE";
        }
        catch(e) {

        }
    }
});

socket.on("target2", (data) => { 
    let yakuId = data.target;
    let yakuLa = data.target2;
    let len = data.len;

    console.log(len);
    for (j = 0; j < len; j++) {
        let ccc = document.getElementById("yaku_label" + (j + 1));
        ccc.style.backgroundColor = null;
    }
    document.getElementById(yakuId).checked = true;
    document.getElementById(yakuLa).style.backgroundColor = "#31A9EE";
});

socket.on("vote", (data) => {
    if(name !== "") {
        let vote = document.getElementById("vote");
        let nameList = data.value;
        let element_vote = document.createElement("input");
        let label1 = document.createElement("label");
        let label2 = document.createElement("label");
    

        while (vote.firstChild) {
            vote.removeChild(vote.firstChild);
        }
        label2.innerHTML = "投票";
        label2.style.marginRight = "8px";
        element_vote.type = "radio";
        element_vote.id = "vote_radio1";
        element_vote.name = "radio_btn";    
        element_vote.value = nameList[0];
        element_vote.style.display = "none";

        label1.innerHTML = "<div class=label2>" + nameList[0] + "</div>";
        label1.id = "vote_label1";
        label1.htmlFor = "vote_radio1";
        label1.style.border = "solid"
        label1.style.borderColor = "#afdb69";
        label1.style.color = "black";
        label1.style.display = "inline-flex";
        label1.style.width = "70px";
        label1.style.height = "25px";
        label1.style.border = "solid";
        label1.style.borderRadius = "4px";
        label1.style.borderColor = "#73bc69";
        label1.style.textAlign = "center";
        label1.style.margin = "4px";
        label1.style.alignItems = "center";
        label1.style.justifyContent = "center";
        label1.style.backgroundColor = "#f6f3f4";

        vote.appendChild(label2);
        vote.appendChild(element_vote);
        vote.appendChild(label1);
        for (i = 1; i < nameList.length; i++) {
            let cloneB = vote.childNodes[1].cloneNode(true);
            let cloneR = vote.childNodes[2].cloneNode(true);
    
            vote.appendChild(cloneB);
            vote.appendChild(cloneR);
            let j = 2 * i + 1;
            vote.childNodes[j].value = nameList[i];
            vote.childNodes[j].id = "vote_radio" + (i + 1);
            vote.childNodes[j + 1].innerHTML = "<div class=label2>" + nameList[i] + "</div>";
            vote.childNodes[j + 1].id = "vote_label" + (i + 1);
            vote.childNodes[j + 1].htmlFor = "vote_radio" + (i + 1);
        }
        for (i = 0; i < nameList.length; i++) {
            let bbb = document.getElementById("vote_label" + (i + 1));
            let ddd = document.getElementsByClassName("label2");
            ddd[i].style.fontSize = "10px";
            bbb.onclick = () => {
                for (j = 1; j < (vote.childElementCount + 1) / 2; j++) {
                    let ccc = document.getElementById("vote_label" + (j));
                    ccc.style.backgroundColor = "#f6f3f4";
                }
                bbb.style.backgroundColor = "#afdb69";
            }
        }
        try {
            let randomR = Math.round( Math.random() * (nameList.length - 1)) * 2 + 1;
            vote.childNodes[randomR].checked = true;
            vote.childNodes[randomR + 1].style.backgroundColor = "#afdb69";
        }
        catch(e) {

        }   
    }
});

socket.on("voteRR", (data) => {
    let select = data.select;
    let name = data.name;
    let voteText = "";
    let table = document.getElementById("sidebar");
    voteText += "" + name + " は " + select + " に投票しました。";
    chatWL("", null, voteText, "red");
    for (i = 0; i < table.rows.length; i++) {
        if (table.rows[i].cells[0].innerHTML === name) {
            table.rows[i].cells[3].innerHTML = select;
        }
    }
    /* let table = document.getElementById("table" + day);
    let row = table.insertRow(0);
    row.style.width = "930px";
    let cell1 = row.insertCell(-1);
    let cell2 = row.insertCell(-1);
    cell1.style.borderBottomStyle = "solid";
    cell1.style.borderBottomColor = "rgba(255, 255, 255, 0.5)";
    cell2.style.borderBottomStyle = "solid";
    cell2.style.borderBottomColor = "rgba(255, 255, 255, 0.5)";
    cell1.style.width = "130px";
    cell2.style.width = "800px";
    cell2.innerText = voteText; */
    //
    let label = document.getElementById("voteLabel" + day);
    let voteText2 = "";
    label.style.display = "inline-block";
    voteText2 += "" + name + " は " + select + " に投票しました。<br>";
    console.log(voteText);
    document.getElementById("voteR" + day).innerHTML += voteText2;
    document.getElementById("voteDay" + day).checked = true;
    vdclick();
});

let vdclick = () => {
    let label = document.getElementById("voteLabel" + day);
    let radioId, radioValue;

    radioId = document.getElementById("voteDay" + day);
    //console.dir("sasa"+radioId.parentNode.parentNode.childNodes[7].childNodes[1].value);
    for (i = 1; i <= day; i++) {
        if (radioId.parentNode.parentNode.childNodes[2 * i + 1].childNodes[1].checked) {
            radioValue = radioId.parentNode.parentNode.childNodes[2 * i + 1].childNodes[1].value;
        }
        document.getElementById("voteR" + i).style.display = "none";   
    //console.log("b"+radioValue);
    }
    //console.log("a"+radioValue);
    document.getElementById("voteR" + radioValue).style.display = "block";
}

let chatclick = () => {
    let label = document.getElementById("chatLabel" + day);
    let radioId, radioValue;

    radioId = document.getElementById("chatDay" + day);
    //console.dir("sasa"+radioId.parentNode.parentNode.childNodes[7].childNodes[1].value);
    console.log("baa" + radioId.parentNode.parentNode.childNodes[1].childNodes[1].value);
    for (i = 0; i <= day; i++) {
        if (radioId.parentNode.parentNode.childNodes[2 * i + 1].childNodes[1].checked) {
            radioValue = radioId.parentNode.parentNode.childNodes[2 * i + 1].childNodes[1].value;
        }
        console.log("b"+radioValue);
        document.getElementById("table" + i).style.display = "none";   
    }
    console.log("a"+radioValue);
    document.getElementById("table" + radioValue).style.display = "block";
}

let memo = () => {
    socket.emit("nameList");
}

socket.on("nameListR", (data) => {
    let cnt = 0;
    let nameListR = data.value;
    let childWin = window.open('htdocs/sub.html', '_blank', 'width=700, height=300')
    , something = document.createElement('div')
    , createTable = document.createElement('table')
    , createInput = document.createElement('input')
    , cDocu = childWin.document;
    let row, cell1,table, memosele;
    let yakuLis = ["", "村人", "占い", "霊能", "狩人", "共有", "妖狐", "狂人","人狼"];
    cDocu.write("<!doctype html>\n" + cDocu.documentElement.outerHTML);
    cDocu.body.style.fontSize = 150 + "%";
    console.log(cDocu.body.style.fontSize);
    createInput.type = 'button';
    createInput.id = 'rowAdd';
    createInput.value = "行を追加する";
    createInput.onclick = () => {
        ++cnt;
        rowAdd(cnt);
    }
    cDocu.body.appendChild(createInput);
    something.id = "memoId";
    createTable.id = "memoTable";
    createTable.style.border = "solid"
    cDocu.body.appendChild(something);
    cDocu.getElementById("memoId").appendChild(createTable);
    table = cDocu.getElementById("memoTable");
    row = table.insertRow(-1);
    let cell = row.insertCell(-1);
    cell.innerHTML = "役職";
    cell.style.border = "solid";
    let cell6 = row.insertCell(-1);
    cell6.innerHTML = "生存";
    cell6.style.border = "solid";
    let cell4 = row.insertCell(-1);
    cell4.innerHTML = "名前";
    cell4.style.border = "solid";
    for (i = 1; i < nameListR.length; i++) {
        let cell1 = row.insertCell(-1);
        cell1.style.border = "solid";
        cell1.style.width = "50px";
        cell1.innerHTML = `<font size=1>${nameListR[i]}</font>`;
    }

    let rowAdd = (cnt1) => {
        let createSele = document.createElement('select');
        let createSele2 = document.createElement('select');
        let cDocu = childWin.document;
        let table = cDocu.getElementById("memoTable");
        row2 = table.insertRow(-1);
        cell2 = row2.insertCell(-1);
        cell2.style.border = "solid";
        createSele.id = "memosele" + cnt1;
        createSele.style.border = "7px";
        cell2.appendChild(createSele);
        memosele = cDocu.getElementById("memosele" + cnt1);
        for (i=0; i<9; i++) {
            let op = document.createElement("option");
            op.value = yakuLis[i];
            op.text = yakuLis[i];
            memosele.appendChild(op);
        }
        createSele2.id = "memosele2" + cnt1;
        createSele2.style.border = "1px";
        createSele2.style.fontSize = "6px";

        let cell7;
        cell7 = row2.insertCell(-1);
        cell7.style.border = "solid";
        cell7.appendChild(createSele2);
        cell7.innerHTML = `<select><option value=""></option><option value="生存">生存</option><option value="死亡">死亡</option></select>`;

        cell5 = row2.insertCell(-1);
        cell5.style.border = "solid";
        cell5.appendChild(createSele2);
        let memosele2 = cDocu.getElementById("memosele2" + cnt1);
        

        for (i = 1; i < nameListR.length; i++) {
            let op = document.createElement("option");
            let cell2 = row2.insertCell(-1);
            cell2.style.border = "solid";
            cell2.innerHTML = `<select><option value=""></option><option value="◯">◯</option><option value="⚫">⚫</option></select>`;
            op.value = nameListR[i];
            op.innerHTML = nameListR[i]
            memosele2.appendChild(op);
        }
    }
    rowAdd();
    
    console.log(cDocu.getElementById("memoId"));
});

socket.on("hanging", (data) => {
    let start_btn = document.getElementById("start_button");
    let element_btn = document.createElement("input");
    try {
        const delete1 = document.getElementById("yaku");
        while (delete1.firstChild) {
            delete1.removeChild(delete1.firstChild);
        }
    } catch (e) {}
    const delete2 = document.getElementById("vote");
    while (delete2.firstChild) {
        delete2.removeChild(delete2.firstChild);
    }
    yaku = null;
    document.getElementById("roomBtn").style.visibility ="hidden";
    document.getElementById("header").innerText = `あなたは死にました。`;

    element_btn.type = 'button';
    element_btn.id = 'bResult'
    element_btn.value = "役職を表示する";
    element_btn.onclick = () => {
        socket.emit("bResult");
    }
    start_btn.appendChild(element_btn);
    socket.emit("roomT", {value : name});
});

socket.on("hanging2", (data) => {
    let hang = data.hang;
    let survivor = data.survivor;
    let table = document.getElementById("sidebar");
    let voteText = "";
    let termsFlg = data.flg;

    for (i = 0; i < table.rows.length; i++) {
        if (table.rows[i].cells[0].innerHTML === hang) {
            table.rows[i].cells[1].innerHTML = "(死亡)";
        }
    }
    if (termsFlg){
        voteText += hang + " は村人達の手によって処刑されました。<br>";
        let table3 = document.getElementById("table" + day);
        let row, cell,cell2;
        let message = "";
        message += hang + " は村人達の手によって処刑されました。";
        chatWL("", null, message, "red");
       /*  row = table3.insertRow(0);
        row.style.width = "930px";
        cell = row.insertCell(-1);
        cell2 = row.insertCell(-1);
        cell.style.borderBottomStyle = "solid";
        cell2.style.borderBottomStyle = "solid";
        cell.style.borderBottomColor = "rgba(255, 255, 255, 0.5)";
        cell2.style.borderBottomColor = "rgba(255, 255, 255, 0.5)";
        cell.style.width = "130px";
        cell2.style.width = "130px";
        cell2.style.color = "red";
        cell2.innerHTML = "" + message; */
    } else {
        let table = document.getElementById("ability2");
        let row, cell1;
        let abilityText = "";
        row = table.insertRow(0);
        cell1 = row.insertCell(-1);
        abilityText += hang + " は無残な姿で発見されました。";
        cell1.innerHTML = "" + abilityText;

        chatWL("", null, abilityText, "red");
       /*  let table3 = document.getElementById("table" + day);
        let row2, cell,cell2;
        row2 = table3.insertRow(0);
        row2.style.width = "930px";
        cell = row2.insertCell(-1);
        cell2 = row2.insertCell(-1);
        cell.style.borderBottomStyle = "solid";
        cell2.style.borderBottomStyle = "solid";
        cell.style.borderBottomColor = "rgba(255, 255, 255, 0.5)";
        cell2.style.borderBottomColor = "rgba(255, 255, 255, 0.5)";
        cell.style.width = "130px";
        cell2.style.width = "800px";
        cell2.style.color = "red";
        cell2.innerHTML = "" + abilityText; */
    }
    //console.log(voteText);
    document.getElementById("voteR" + day).innerHTML += voteText;
    
    
    

    let vote = document.getElementById("vote");
    let yaku2 = document.getElementById("yaku");
    let voteMax = (vote.childElementCount + 1) / 2;
    let yakuMax = (yaku2.childElementCount + 1) / 2;
    console.log(voteMax);
    /* for (i = 1; i < voteMax; i++) {
        let j = 2 * i - 1;
        if (vote.childNodes[j].value === hang) {
            vote.removeChild(vote.childNodes[j]);
            vote.removeChild(vote.childNodes[j]);
            break;
        }
    } */
   /*  for (i = 1; i < yakuMax; i++) {
        let j = 2 * i - 1;
        if (yaku2.childNodes[j].value === hang) {
            yaku2.removeChild(yaku.childNodes[j]);
            yaku2.removeChild(yaku.childNodes[j]);
            break;
        }
    } */
    if (name.length >= 1) {
        socket.emit("voteCreate", {name : name});
    }
    yakuR();
/*     try {
        yaku2.childNodes[1].checked = true;
        vote.childNodes[1].checked = true;
    } catch (e) {} */
});

socket.on("yakuR", (data) => {
    let res = data.data;
    let sele = data.value;
    let writeFlg = data.flg;
    let abilityText = "";
    if (writeFlg) {
        abilityText += "占いの結果：" + sele + "さんは" + res + "でした。"  
    } else {
        abilityText += "霊能の結果：" + sele + "さんは" + res + "でした。"  
    }
    let table = document.getElementById("ability2");
    let row, cell1;
    row = table.insertRow(0);
    cell1 = row.insertCell(-1);
    cell1.style.color = "red";
    cell1.innerHTML = "" + abilityText;

});

socket.on("momsg", (data) => {
    let chatCnt = data.chatCnt;
    let motext = data.value;
    let poptext = document.getElementById("poptext1");

    poptext.style.display = "block";
    poptext.style.top = mY + 30 + "px";
    poptext.style.left = mX + "px";
    document.getElementById("text").innerText = "発言数：" + chatCnt + "\n" + motext;
});

socket.on("chatLog", (data) => {
    day = data.day; 
    console.log(day + "aarfr");
    let table = document.getElementById("table" + day);
    let row;
    let cell1,cell2;
    let timeList = data.time;
    //console.log(timeList[0][1]);
    let chatList = data.chat;
    let votelist = data.votelist;
    let message1 = "";
    let message2 = "";
    for (i = 1; i <= day; i++) {
        document.getElementById("chatLabel" + i).style.display = "inline-block";
        document.getElementById("chatDay" + i).checked = true;
        let label = document.getElementById("voteLabel" + i);
        label.style.display = "inline-block";
        document.getElementById("voteDay" + i).checked = true;
    }
    for (j = 0; j <= day; j++) {
        let table2 = document.getElementById("table" + j);
        for (i = 0; i < timeList.length; i++) {
            if (timeList[i][1] == j) {
                message1 = "";
                message2 = "";
                //message += timeList[i] + " > [" + chatList[i + 1][1] + '] ' + chatList[i + 1][0] + "\n";
                message1 += "[" + chatList[i + 1][1] + '] ' + "\n";
                message2 += chatList[i + 1][0] + "\n";
                chatWL(message1, null, message2, null);
                /* row = table2.insertRow(0);
                row.style.width = "930px";
                cell1 = row.insertCell(-1);
                cell2 = row.insertCell(-1);
                cell1.style.borderBottomStyle = "solid";
                cell1.style.borderBottomColor = "rgba(255, 255, 255, 0.5)";
                cell2.style.borderBottomStyle = "solid";
                cell2.style.borderBottomColor = "rgba(255, 255, 255, 0.5)";
                cell1.style.width = "130px";
                cell2.style.width = "800px";

                cell1.innerHTML = "" + message1;
                cell2.innerHTML = "" + message2; */
            }
        }
    }
    for (j = 1; j <= day; j++) {
        let vote2 = document.getElementById("voteR" + j);
        for (k = 0; k < votelist.length; k++) {
            console.log(votelist[k][2] == j);
            if (votelist[k][2] == j) {
                let voteText = "";
                //label.style.display = "inline-block";
                voteText += "" + votelist[k][0] + " は " + votelist[k][1] + " に投票しました。<br>";
                console.log(voteText+"abcd");
                vote2.innerHTML += voteText;
            }
        }
    }
    try {
        vdclick();
        chatclick();
    } 
    catch(e) {

    }
});
socket.on("gameStart", (data) => {
    let dayFlg = data.dayFlg;
    let day = data.day;
    let time = data.time;

    //gameStart1(dayFlg);
    yakuR();
});
socket.on("timerI", (data) => {
    let dayFlg = data.dayFlg;
    let day = data.day;
    let time = data.time;

    clearInterval(timer1);
    timerB(dayFlg, day, time);
    gameStart1(dayFlg);
});

socket.on("startTimer", (data) => {
    let dayFlg = data.dayFlg;
    let day = data.day;
    let time = data.time;
    timerB(dayFlg, day, time);
});

socket.on("everyone", (data) => {
    document.cookie = 'taroinu=; max-age=0;';
    socket.emit("reset2", {name : name});
});

socket.on("reload", (data) => {
    location.reload(); /* @@@@@ */
});

socket.on("finish", (data) => {
    let nameList = data.nameList;
    let r = data.r;
    let gm3 = data.gm3;
    let text = "";
        text += nameList[0] + "::" + gm3 + "\n";
    for (i = 0; i < r.length; i++) {
        text += nameList[i + 1] + "::" + r[i] + "\n";
    }
    clearInterval(timer1);
    document.getElementById("memo0").value = gm3;
    for (i = 0; i < r.length; i++) {
        document.getElementById("memo" + (i +1)).value = r[i];
    }
    document.cookie = 'taroinu=; max-age=0;';
    alert(`ゲーム終了！！\n${data.value}\n${text}`);
   console.log(`ゲーム終了！！\n${data.value}\n${text}`);
});

socket.on("god", (data) => {
    let r = data.r;
    let gm3 = data.gm3;
    document.getElementById("memo0").value = gm3;
    for (i = 0; i < r.length; i++) {
        document.getElementById("memo" + (i +1)).value = r[i];
    }
});

socket.on("reTouroku", (data) => {
    enterFlg = true;
    document.getElementById("button1").value = "発言";
    name = data.name;
    yaku = data.yaku;
    document.getElementById("roomBtn").style.visibility = "visible";
    document.getElementById("header").innerText = `${name}さんは${yaku}です。`;
    yakuR();
    socket.emit("voteCreate", {name : name});
});

socket.on("reTouroku2", (data) => {
    enterFlg = true;
    document.getElementById("button1").value = "発言";
    name = data.name;
    yaku = data.yaku;
    document.getElementById("roomBtn").style.display = "block";
    document.getElementById("header").innerText = `${name}さんは${yaku}です。`;
    if (time) {
        document.getElementById("button2").value = "カウント０";
    }
});
let yakuR = () => {
    //console.log("役のラジオを作ります");
    switch(yaku){
        case "人狼":
        socket.emit("yaku1", {name : name});
        break;
        case "占い":
        socket.emit("yaku2", {name : name});
        break;
        case "狩人":
        socket.emit("yaku2", {name : name});
        break;
        case "霊能":
        socket.emit("yaku4", {name : name});
        break;
    }
}

let timerB = (dayFlg1, day1, time1) => {
    let time2 = document.getElementById("time");
    let timeZone;

    day = day1;
    time = time1;
    dayFlg = dayFlg1; 
    
    if (dayFlg == 3) {
        timeZone = "夜の時間";
    } else if (dayFlg == 1) {
        timeZone = "昼の時間";
    }else if(dayFlg == 2) {
        timeZone = "投票の時間";
    }
     else if (dayFlg == 4) {
        document.getElementById("chatLabel" + day).style.display = "inline-block";
        document.getElementById("chatDay" + day).checked = true;
        chatclick();
        timeZone = "朝の時間";
    }
    timer1 = setInterval(() => {
      timeDown();
      if (time == 0) {
        clearInterval(timer1);
      }
    }, 1000);
    timeDown = () => {
      time--;
      time2.innerHTML = `${day}日目の${timeZone}<br>${Math.floor(time / 60)}分${time % 60}秒`;
      time2.style.fontSize = "20px";
      //console.log(time);
        if (dayFlg == 1 && time == 20) {
            let table2 = document.getElementById("table" + day);
            let row2, cell3, cell4;
            let abilityText = "";
            abilityText += "あと20秒で昼時間が終了します。投票先の確認をお願いします。";
            chatWL("", null, abilityText, "red");
            /* row2 = table2.insertRow(0);
            row2.style.width = "930px"
            cell3 = row2.insertCell(-1);
            cell4 = row2.insertCell(-1);
            cell3.style.width = "130px";
            cell3.style.borderBottomStyle = "solid";
            cell3.style.borderBottomColor = "rgba(255, 255, 255, 0.5)";
            cell4.style.width = "800px";
            cell4.style.color = "rgba(255, 0, 0, 1)";
            cell4.innerHTML = "" + abilityText;
            cell4.style.borderBottomStyle = "solid";
            cell4.style.borderBottomColor = "rgba(255, 255, 255, 0.5)"; */
        }
    }
}
let gameStart1 = (dayFlg1) => {
    let vote = document.getElementById("vote");
    let yaku3 = document.getElementById("yaku");
    let dayFlg = dayFlg1;
    let table4 = document.getElementById("sidebar");
    let table1 = document.getElementById("ability2");
    let table2 = document.getElementById("table" + day);
    let main = document.getElementById("main");
    let main2 = document.getElementById("mainB");
    let row1, cell1, row2, cell2;
    let abilityText = "";
    let yaku3V;

    if (dayFlg == 1) { // 昼
        document.body.style.backgroundColor = "#e8e6e6";
        document.body.style.color = "black";
        row1 = table1.insertRow(0);
        cell1 = row1.insertCell(-1);
        abilityText += day + "日目 の 昼時間 になりました。";
        cell1.innerHTML = "" + abilityText;
        chatWL("", null, abilityText, null);
        /* row2 = table2.insertRow(0);
        row2.style.width = "930px"
        cell3 = row2.insertCell(-1);
        cell4 = row2.insertCell(-1);
        cell3.style.width = "130px";
        cell3.style.borderBottomStyle = "solid";
        cell3.style.borderBottomColor = "rgba(255, 255, 255, 0.5)";
        cell4.style.width = "800px";
        cell4.innerHTML = "" + abilityText;
        cell4.style.borderBottomStyle = "solid";
        cell4.style.borderBottomColor = "rgba(255, 255, 255, 0.5)"; */
        main2.style.backgroundImage = 'url(htdocs/hiru.jpg)';
        try {
            for (i = 0; i < vote.childElementCount; i++) {
                vote.childNodes[i].disabled = false;
            }
            //vote.childNodes[1].checked = true;
            for (i = 0; i < yaku3.childElementCount; i++) {
                yaku3.childNodes[i].disabled = true;
            }
        } catch (e) {}
    } else if (dayFlg == 3) { // 夜
        document.body.style.backgroundColor = "#414166";
        document.body.style.color = "white";

        row1 = table1.insertRow(0);
        cell1 = row1.insertCell(-1);
        abilityText += day + "日目 の 夜時間 になりました。";
        cell1.innerHTML = "" + abilityText;
        chatWL("", null, abilityText, null);
        main2.style.backgroundImage = 'url(htdocs/yoru.jpg)';
        /* row2 = table2.insertRow(0);
        row2.style.width = "930px"
        cell3 = row2.insertCell(-1);
        cell4 = row2.insertCell(-1);
        cell3.style.width = "130px";
        cell3.style.borderBottomStyle = "solid";
        cell3.style.borderBottomColor = "rgba(255, 255, 255, 0.5)";
        cell4.style.width = "800px";
        cell4.innerHTML = "" + abilityText;
        cell4.style.borderBottomStyle = "solid";
        cell4.style.borderBottomColor = "rgba(255, 255, 255, 0.5)"; */
        if(day != 0) {
        try {
            for (i = 0; i < vote.childElementCount; i++) {
                if (vote.childNodes[2 * i + 1].checked) {
                    let voteRV = vote.childNodes[2 * i + 1].value;
                    socket.emit("voteR", {select : voteRV, name : name});
                    //console.log(voteRV);
                    break;
                }
            }
            for (i = 0; i < vote.childElementCount; i++) {
                vote.childNodes[i].disabled = true;
            }    
            for (i = 0; i < yaku3.childElementCount; i++) {
                yaku3.childNodes[i].disabled = false;
            }
        } catch (e) {}
        }
        
    } else if (dayFlg == 4) { // 朝

        document.body.style.backgroundColor = "#e8e6e6";
        document.body.style.color = "black";
        
        abilityText += day + "日目 の 朝時間 になりました。";
        console.log("cheak");
        chatWL("", null, abilityText, null);
        for (i = 1; i < table4.rows.length; i++) {
            table4.rows[i].cells[3].innerHTML = "";
        }
        
        /* row1 = table1.insertRow(0);
        cell1 = row1.insertCell(-1);
        //cell1.style.backgroundColor = "white";
        cell1.innerHTML = "" + abilityText;
        row2 = table2.insertRow(0);
        cell3 = row2.insertCell(-1);
        cell4 = row2.insertCell(-1);
        cell3.style.width = "130px";
        cell3.style.borderBottomStyle = "solid";
        cell3.style.borderBottomColor = "rgba(255, 255, 255, 0.5)";
        cell4.style.width = "800px";
        cell4.innerHTML = "" + abilityText;
        cell4.style.borderBottomStyle = "solid";
        cell4.style.borderBottomColor = "rgba(255, 255, 255, 0.5)"; */
        main2.style.backgroundImage = 'url(htdocs/hiru.jpg)';
        if (day != 1) {
            try {
                for (i = 0; i < vote.childElementCount; i++) {
                    vote.childNodes[i].disabled = false;
                }
                for (i = 0; i < yaku3.childElementCount; i++) {
                    if (yaku3.childNodes[2 * i + 1].checked) {
                        yaku3V = yaku3.childNodes[2 * i + 1].value;
                        socket.emit("yaku3", {select : yaku3V, name : name, yaku : yaku});
                        let abilityText2 = "";
                        abilityText2 += `${day -1}日目の夜に${yaku3V}さんを選択しました。`;
                        chatWL("", null, abilityText2, null);
                        /* row2 = table2.insertRow(0);
                        //cell1.style.backgroundColor = "white";
                        cell3 = row2.insertCell(-1);
                        cell4 = row2.insertCell(-1);
                        cell3.style.width = "130px";
                        cell3.style.borderBottomStyle = "solid";
                        cell3.style.borderBottomColor = "rgba(255, 255, 255, 0.5)";
                        cell4.style.width = "800px";
                        cell4.style.color = "red";
                        cell4.innerHTML = "" + abilityText2;
                        cell4.style.borderBottomStyle = "solid";
                        cell4.style.borderBottomColor = "rgba(255, 255, 255, 0.5)"; */

                        //console.log("yaku3を送信しました");
                        break;
                    }
                }
                for (i = 0; i < yaku3.childElementCount; i++) {
                    yaku3.childNodes[i].disabled = true;
                }
            } catch (e) {}
        }
       
    }
}

let js_color = (p1) => {
    myColor = p1;
    console.log("color:::" + myColor);
}

let chatWL = (moji, color, moji2, color2) => {
    let table3 = document.getElementById("table" + day);
    let row2, cell,cell2;
    row2 = table3.insertRow(0);
    row2.style.width = "830px";
    cell = row2.insertCell(-1);
    cell2 = row2.insertCell(-1);
    cell.style.borderBottomStyle = "solid";
    cell2.style.borderBottomStyle = "solid";
    cell.style.borderBottomColor = "rgba(255, 255, 255, 0.5)";
    cell2.style.borderBottomColor = "rgba(255, 255, 255, 0.5)";
    cell.style.width = "130px";
    cell2.style.width = "700px";
    cell.style.color = color;
    cell2.style.color = color2;
    cell.innerHTML = "" + moji;
    cell2.innerHTML = "" + moji2;

}




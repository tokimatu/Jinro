
// 送信
window.onload=() => {
    let people = document.getElementById("header").innerText;
    name = "GM";
    socket.emit("touroku", {name : name, people : people});
    //socket.emit("gm_btn");
    if (document.cookie.indexOf("taroinu") != -1) {
        console.log(document.cookie);
        socket.emit("id",{value:document.cookie});
    }
    document.getElementById("button1").onclick=(e) => {
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
        document.body.addEventListener("mousemove", (e2) =>{
            mX = e2.pageX;
            mY = e2.pageY;
        });
        e.preventDefault();
    }
}

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

socket.on("gm2", (data) => { 
    document.getElementById("roomNum").style.display = "none";
});


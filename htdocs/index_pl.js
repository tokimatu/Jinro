
// 送信
window.onload=() => {
    name = document.getElementById("header").innerText;
    gazou = document.getElementById("header2").innerText;
    socket.emit("touroku", {name : name, people : null, gazou, gazou});
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
            socket.emit("stext1", {message : message, name : name, yaku : yaku, myColor : myColor, fontSize : fontSize, gazou : gazou});
            sele[0].selected = true;    
        }
        document.body.addEventListener("mousemove", (e2) =>{
            mX = e2.pageX;
            mY = e2.pageY;
        });
        e.preventDefault();
    }
}

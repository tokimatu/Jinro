
let socket = io.connect();

// 送信
window.onload=() => {
    document.getElementById("test").onclick=(e) => {
        let name = "";
        name = document.getElementById("name").value;
        //document.getElementById("name").value = "";
        if (document.cookie.indexOf("taroinu" ) == -1) {
            const l = 16;
            const c = "abcdefghijklmnopqrstuvwxyz0123456789";
            let cl = c.length;
            let r = "";
            for (i = 0; i < l; i++) {
                r += c[Math.floor(Math.random()*cl)];
            }
            //2019/05/19
            //document.cookie = 'taroinu=' + r + '; max-age=7200;';
            let taroinu = document.cookie;
            console.log(taroinu);
            //socket.emit("touroku", {name : name, value : taroinu});
        }
    }
}
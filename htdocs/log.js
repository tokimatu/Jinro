let socket = io.connect();
socket.emit('getDateTime');

socket.on('putLog', (data) => {
    let table = document.getElementById("table");
    while (table.firstChild) {
        table.removeChild(table.firstChild);
    }
    let obj = data.value;
    console.log(obj[0].chat);
    for(let i in obj) {
        console.log(obj[i].chat)
        let row = table.insertRow(-1);
        let cell1 = row.insertCell(-1);
        let cell2 = row.insertCell(-1);
        let cell3 = row.insertCell(-1);

        cell1.innerHTML = obj[i].name;
        cell2.innerHTML = obj[i].yaku;
        cell3.innerHTML = obj[i].chat;
    }
        
    
});

socket.on('putDateTime', (data) => {
    let sele = document.getElementById("dateTime");
    let obj = data.value;
    console.log(obj[0]);
    for(let i in obj) {
        let op = document.createElement("option");
        op.value = obj[i];  //value値
        op.text = obj[i];   //テキスト値
        sele.appendChild(op);
    }

});

window.onload=() => {
    let sele = document.getElementById("dateTime");
    document.getElementById("getLog").onclick=() => {
        socket.emit('getLog', {"day" : 0, "zone" : 3, "timeDate" : sele.value});
    }
}
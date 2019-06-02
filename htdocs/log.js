let socket = io.connect();
socket.emit('getDateTime');

socket.on('putLog', (data) => {
    let obj = data.value;
    console.log(obj);
        let table = document.getElementById("table");
        while (table.firstChild) {
            table.removeChild(table.firstChild);
        }
        let rowFirst = table.insertRow(-1);
        const thName = ['名前', '役職', 'チャット'];

        for(let i in thName){
            let th = document.createElement('th');
            th.innerHTML = thName[i];
            rowFirst.appendChild(th);
        }
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
    obj.sort(compareFunc);
    console.log(obj[0]);
    for(let i in obj) {
        let op = document.createElement("option");
        op.value = obj[i];  //value値
        op.text = `${i}回前の試合`;   //テキスト値
        sele.appendChild(op);
    }

});

window.onload=() => {
    let seleDatetime = document.getElementById("dateTime");
    let seleDay = document.getElementById("day");
    let seleZone = document.getElementById("zone");
    document.getElementById("getLog").onclick=() => {
        console.log(seleZone.value);
        socket.emit('getLog', {"day" : seleDay.value, "zone" : seleZone.value, "timeDate" : seleDatetime.value});
    }
}

compareFunc = (a, b) => {
    return b - a;
}
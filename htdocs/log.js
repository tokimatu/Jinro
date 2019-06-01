let socket = io.connect();
socket.emit('getLog', {"day" : 0, "zone" : 3});


socket.on('putLog', (data) => {
    let table = document.getElementById("table");
    
    obj = data.value;
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

window.onload=() => {
    
}
const socket = io('http://localhost:3001');
let conectado = false;
let mapId = 1;
var myOwnChar = {};

socket.on('disconnect', () => {
    conectado = false;
    map.disconnect();
});

socket.on('youAreConnected', message => {
    console.log("youAreConnected");
    conectado = true;
    myOwnChar = new Char(message.charInfo);

    map.connect();

    for (const [charSid, char] of Object.entries(message.mapinfo.chars)) {
        map.char.append(char);
    }
});

socket.on('charMoved', data => {
    map.char.move(data.sid, data.x, data.y);
});

socket.on('charIsOffline', message => {
    map.char.offline(message.sid);
});

socket.on('newCharIsHere', newCharVisible => {
    if (!conectado) {
        return false;
    }
    map.char.append(newCharVisible);
})
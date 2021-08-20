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
    mapId = message.mapId;
    myOwnChar = new Char(message.charInfo);

    map.connect();

    for (const [floorId, floor] of Object.entries(message.mapinfo.floors)) {
        console.log("append floor", floor);
        map.floor.append(floorId, floor);
    }

    for (const [charSid, char] of Object.entries(message.mapinfo.chars)) {
        map.char.append(char);
    }

    for (const [itemId, item] of Object.entries(message.mapinfo.items)) {
        console.log("append item", item);
        map.item.append(itemId, item);
    }
});

socket.on('newFloorAppeared', data => {
    console.log("newFloor", data);
    map.floor.append(data.id, data.floor);
});

socket.on('charMoved', data => {
    map.char.move(data.sid, data.x, data.y);
});

socket.on('charIsOutsideThisMap', message => {
    map.char.remove(message.sid);
});

socket.on('newCharIsHere', newCharVisible => {
    console.log('newCharIsHere', newCharVisible);
    if (!conectado) {
        return false;
    }
    map.char.append(newCharVisible);
})

socket.on('itemMoved', data => {
    map.item.move(data.id, data.x, data.y);
});

socket.on('itemBroked', data => {
    map.item.broked(data.id);
});

socket.on('itemClosed', data => {
    map.item.closed(data.id);
});

socket.on('startKamehame', data => {
    console.log('startKamehame', data);
    map.kamehame.start(data);
})

socket.on('endKamehame', data => {
    console.log('endKamehame', data);
    map.kamehame.end(data);
})
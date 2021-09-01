const socket = io('http://localhost:3001');
let conectado = false;
let mapId = 1;
var myOwnChar = {};

socket.on('disconnect', () => {
    conectado = false;
    map.disconnect();
});

socket.on('youAreConnected', message => {
    console.log("changed map");
    message = JSON.parse(message);
    console.log(message);
    conectado = true;
    mapId = message.mapId;
    myOwnChar = new Char(message.charInfo);

    map.connect();

    $("#map_id").html(mapId);

    for (const [floorId, floor] of Object.entries(message.mapinfo.floors)) {
        map.floor.append(floorId, floor);
    }

    for (const [charSid, char] of Object.entries(message.mapinfo.chars)) {
        map.char.append(char);
    }

    for (const [itemId, item] of Object.entries(message.mapinfo.items)) {
        map.item.append(itemId, item);
    }

    for (const [itemId, item] of Object.entries(message.mapinfo.big)) {
        map.big.append(itemId, item);
    }

    map.char.status.updateKiMax(message.charInfo.ki_max);
    map.char.status.updateKi(message.charInfo.ki);

    $("#song").html("");
    $("#song").append("<audio id=\"myaudio\" controls autoplay > <source src=\"mp3/"+message.mapinfo.song+"\" type=\"audio/mpeg\">Your browser does not support the audio element.</audio>");

    const audio = document.getElementById("myaudio");
    audio.volume = 0.15;

});

socket.on('newFloorAppeared', data => {
    console.log("newFloor", data);
    map.floor.append(data.id, data.floor);
});

socket.on('charMoved', data => {
    map.char.move(data);
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

socket.on('itemVanished', data => {
    map.item.vanished(data.id);
});

socket.on('startKamehame', data => {
    console.log('startKamehame', data);
    map.kamehame.start(data);
})

socket.on('endKamehame', data => {
    console.log('endKamehame', data);
    map.kamehame.end(data);
})

socket.on('shootKamehame', data => {
    console.log('shootKamehame', data);
    map.kamehame.shoot(data);
});

socket.on('goingKamehameha', data => {
    console.log('goingKamehameha', data);
    map.kamehame.going(data);
});

// depreacted?
// socket.on('stoptKamehame', data => {
//     console.log('stoptKamehame', data);
//     map.kamehame.stop(data);
// });

socket.on('finishedKamehame', data => {
    console.log('finishedKamehame', data);
    map.kamehame.finish(data);
});
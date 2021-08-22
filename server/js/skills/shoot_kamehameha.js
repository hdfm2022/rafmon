shootKamehame = (socket) => {
    const mapId = mapIdsBySocketId[socket.id];
    const map = maps[mapId];

    const skill = {
        'sid': socket.id
    }
    socket.emit('shootKamehame', skill);
    socket.to('map_' + mapId).emit('shootKamehame', skill);

    let x = (map['chars'][socket.id].x);
    let y = (map['chars'][socket.id].y);

    map['kamehames'][socket.id] = { 
          cx: x
        , cy: y 

        , x1: x
        , y1: y 

        , x2: x
        , y2: y 
        , stopou: false
    };

    setTimeout(() => {
        nextShootKamehameTimer(socket, x, y, "right");
    }, 200);
}

nextShootKamehameTimer = (socket, x, y, direction) => {

    const mapId = mapIdsBySocketId[socket.id];
    const map = maps[mapId];
    const kamehame = map['kamehames'][socket.id];

    switch(direction) {
        case "right":  x++; break;
        case "left":   x--; break;
        case "top":    y--; break;
        case "bottom": y++; break;
    }

    const collision = collisionDetection(map, x, y);

    const skill = {
        'sid': socket.id,
        'kamehame': kamehame
    }
    if (kamehame.stopou) {
        kamehame.x1++;
    }

    if (collision === false) {
    
        if (direction == "right") {
            kamehame.x2++;
        }

        console.log(kamehame);
    
        socket.emit('goingKamehameha', skill);
        socket.to('map_' + mapId).emit('goingKamehameha', skill);
    
        setTimeout(() => {
            nextShootKamehameTimer(socket, x, y, direction)
        }, 200);
    } else {
        console.log("end kamehameha");
    }

}

module.exports = shootKamehame;
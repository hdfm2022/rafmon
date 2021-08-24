
const tryToMoveItem = require('../move_in_map/try_to_move_item');

shootKamehame = (socket) => {
    const mapId = mapIdsBySocketId[socket.id];
    const map = maps[mapId];
    const char = map['chars'][socket.id];

    let x = (char.x);
    let y = (char.y);

    if (map['kamehames'][socket.id] && map['kamehames'][socket.id].active) {
        console.log("nao pode atirar novo kame");
        return false;
    }


    map['kamehames'][socket.id] = { 
          cx: x
        , cy: y 

        , x1: x
        , y1: y 

        , x2: x
        , y2: y 
        , stopou: false
        , hasCollision: false
        , active: true
        , direction: char.actualPosition || "ArrowRight"

        , timer_start: char.kame_start
        , timer_shoot: Date.now()
        , size: Math.floor((((Date.now() - char.kame_start) / 1000) * 2)) + 12
    };

    char.kame_start = null;
    const skill = {
        'sid': socket.id,
        'kamehame': map['kamehames'][socket.id]
    }
    socket.emit('shootKamehame', skill);
    socket.to('map_' + mapId).emit('shootKamehame', skill);

    setTimeout(() => {
        nextShootKamehameTimer(socket);
    }, 200);
}

nextShootKamehameTimer = (socket) => {
    const mapId = mapIdsBySocketId[socket.id];
    const map = maps[mapId];
    if (!map) {
        console.log("nao encontrou mapa");
        return;
    }
    const char = map['chars'][socket.id];
    const kamehame = map['kamehames'][socket.id];
    if (!kamehame) {
        console.log("nao encontrou kamehame");
        return false;
    }

    const skill = {
        'sid': socket.id,
        'kamehame': kamehame
    }

    // se ja parou, diminui o tamanho pelo inicio... 
    if (kamehame.stopou) {
        switch(kamehame.direction) {
            case "ArrowRight":  kamehame.x1++; break;
            case "ArrowLeft":   kamehame.x2--; break;
            case "ArrowUp":     kamehame.y2--; break;
            case "ArrowDown":   kamehame.y1++; break;
        }
    }

    // se ainda não teve colisão, tenta crescer ainda o golpe...
    if (kamehame.hasCollision === false) {
        let x = 0;
        let y = 0;
        if (kamehame.direction == "ArrowRight" || kamehame.direction == "ArrowDown") {
            x = kamehame.x2;
            y = kamehame.y2;
        } else {
            x = kamehame.x1;
            y = kamehame.y1;
        }

        switch(kamehame.direction) {
            case "ArrowRight":  x++; break;
            case "ArrowLeft":   x--; break;
            case "ArrowUp":     y--; break;
            case "ArrowDown":   y++; break;
        }
        
        let collisionResult = collisionDetection(map, x, y, "fly");

        if (collisionResult !== false) {
            kamehame.hasCollision = true;

            if (collisionResult instanceof Object) {
                if (collisionResult.type == "item_collision") {
                    const item = map.items[collisionResult.item];
                    if (item.type == "stone") {
                        if (kamehame.size >= 24) {
                            item.status = "vanished";
                            item.x = -1;
                            item.y = -1;
                            const retorno = { id: collisionResult.item };
                    
                            socket.emit('itemVanished', retorno);
                            socket.to('map_' + mapId).emit('itemVanished', retorno);

                            kamehame.hasCollision = false;

                        } else if (kamehame.size >= 20) {
                            item.status = "broked";
                            const retorno = { id: collisionResult.item };
                    
                            socket.emit('itemBroked', retorno);
                            socket.to('map_' + mapId).emit('itemBroked', retorno);
                        } else {
                            if (map.items[collisionResult.item].status == "") {
                                const mexeuOItem = tryToMoveItem(mapId, collisionResult.item, kamehame.direction, socket, map);
                                if (mexeuOItem) {
                                    kamehame.hasCollision = false;
                                    collisionResult = false;
                                }
                            }
                        }

                    }
                }
            }
        }

        if (collisionResult === false) {
            switch(kamehame.direction) {
                case "ArrowRight":  kamehame.x2++; break;
                case "ArrowLeft":   kamehame.x1--; break;
                case "ArrowUp":     kamehame.y1--; break;
                case "ArrowDown":   kamehame.y2++; break;
            }
        }
        console.log("Log", collisionResult, "x", kamehame.x1, kamehame.x2, "y", kamehame.y1, kamehame.y2)
    }


    // se não chegou no final o golpe, ainda aumenta ele...
    if (kamehame.x1 <= kamehame.x2 && kamehame.y1 <= kamehame.y2) {
        // console.log(kamehame);
    
        socket.emit('goingKamehameha', skill);
        socket.to('map_' + mapId).emit('goingKamehameha', skill);
    
        setTimeout(() => {
            nextShootKamehameTimer(socket)
        }, 200);
    } else {

        map['kamehames'][socket.id].active = false;

        console.log("finishedKamehame");
        char.kame_start = null;

        const skill = {
            'sid': socket.id
        }
        socket.emit('finishedKamehame', skill);
        socket.to('map_' + mapId).emit('finishedKamehame', skill);
    }

}

module.exports = shootKamehame;
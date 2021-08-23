
const tryToMoveItem = require('../move_in_map/try_to_move_item');

shootKamehame = (socket) => {
    const mapId = mapIdsBySocketId[socket.id];
    const map = maps[mapId];
    const char = map['chars'][socket.id]

    let x = (char.x);
    let y = (char.y);

    map['kamehames'][socket.id] = { 
          cx: x
        , cy: y 

        , x1: x
        , y1: y 

        , x2: x
        , y2: y 
        , stopou: false
        , hasCollision: false
        , direction: "right"

        , timer_start: char.kame_start
        , timer_shoot: Date.now()
        , size: Math.floor((((Date.now() - char.kame_start) / 1000) * 2)) + 12
    };

    const skill = {
        'sid': socket.id,
        'kamehame': map['kamehames'][socket.id]
    }
    socket.emit('shootKamehame', skill);
    socket.to('map_' + mapId).emit('shootKamehame', skill);

    setTimeout(() => {
        nextShootKamehameTimer(socket, "right");
    }, 200);
}

nextShootKamehameTimer = (socket, direction) => {
    const mapId = mapIdsBySocketId[socket.id];
    const map = maps[mapId];
    if (!map) {
        console.log("nao encontrou mapa");
        return;
    }
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
        kamehame.x1++; // isso se for para direita
    }

    // se ainda não teve colisão, tenta crescer ainda o golpe...
    if (kamehame.hasCollision === false) {
        let x = kamehame.x2;
        let y = kamehame.y2;

        switch(direction) {
            case "right":  x++; break;
            case "left":   x--; break;
            case "top":    y--; break;
            case "bottom": y++; break;
        }
        
        const collisionResult = collisionDetection(map, x, y);

        if (collisionResult === false) {
            if (direction == "right") {
                kamehame.x2++;
            }
        } else {
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
                                const mexeuOItem = tryToMoveItem(mapId, collisionResult.item, "ArrowRight", socket, map);
                                if (mexeuOItem) {
                                    kamehame.hasCollision = false;
                                }
                            }
                        }

                    }
                }
            }

            if (kamehame.hasCollision == true) {
                switch(direction) {
                    case "right":  x--; break;
                    case "left":   x++; break;
                    case "top":    y++; break;
                    case "bottom": y--; break;
                }
            }
        }
    }

    // se não chegou no final o golpe, ainda aumenta ele...
    if (kamehame.x1 <= kamehame.x2 && kamehame.y1 <= kamehame.y2) {
        console.log(kamehame);
    
        socket.emit('goingKamehameha', skill);
        socket.to('map_' + mapId).emit('goingKamehameha', skill);
    
        setTimeout(() => {
            nextShootKamehameTimer(socket, direction)
        }, 200);
    } else {
        console.log("end kamehameha");

        const skill = {
            'sid': socket.id
        }
        socket.emit('finishedKamehame', skill);
        socket.to('map_' + mapId).emit('finishedKamehame', skill);
    }

}

module.exports = shootKamehame;
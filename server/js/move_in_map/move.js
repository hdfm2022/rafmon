move = (socket, data) => {
    console.log("entered move function with socket");

    let newCharPosition = false;
    let collisionResult = false;
    let mapId = mapIdsBySocketId[socket.id];

    const map = maps[mapId];
    const char = map.chars[socket.id];

    if (Date.now() - char.lastMoviment < 380) {
        console.log("nao pode mexer tao rapido");

        if (char.nextMove) {
            console.log("clear");
            clearTimeout(char.nextMove);
        } 

        char.nextMove = setTimeout( () => { move(socket, data); }, 380 - Date.now() - char.lastMoviment )

        return false;
    }
    char.lastMoviment = Date.now();

    if (!char) {
        console.log("problema");
        console.log("map", map);
        return true;
    }

    if (data.key == "ArrowRight") {
        collisionResult = collisionDetection(map, char.x + 1, char.y);
        if (char.x < 20 && collisionResult === false) {
            char.x++;
            newCharPosition = true;
        }
    }
    if (data.key == "ArrowLeft") {
        collisionResult = collisionDetection(map, char.x - 1, char.y);
        if (char.x > 1 && collisionResult === false) {
            char.x--;
            newCharPosition = true;
        }
    }
    if (data.key == "ArrowDown") {
        collisionResult = collisionDetection(map, char.x, char.y + 1);
        if (char.y < 15 && collisionResult === false) {
            char.y++;
            newCharPosition = true;
        }
    }
    if (data.key == "ArrowUp") {
        collisionResult = collisionDetection(map, char.x, char.y - 1);
        if (char.y > 1 && collisionResult === false) {
            char.y--;
            newCharPosition = true;
        }
    }

    if (collisionResult instanceof Object) {
        if (collisionResult.type == "portal_collision") {
            const portal = map.floors[collisionResult.floor];
            const charPublicInfo = map.chars[socket.id];

            charDisappearInMap(mapId, socket);

            mapId = portal.nextMap;
            if (data.key == "ArrowRight") char.x += 2;
            if (data.key == "ArrowLeft")  char.x -= 2;
            if (data.key == "ArrowDown")  char.y += 2;
            if (data.key == "ArrowUp")    char.y -= 2;
            
            charAppearInMap(mapId, socket, charPublicInfo);
        }
        if (collisionResult.type == "item_collision") {
            if (map.items[collisionResult.item].type == "stone") {
                if (map.items[collisionResult.item].status == "") {
                    tryToMoveItem(mapId, collisionResult.item, data.key, socket, map);
                }
            }
        }
    }

    if (newCharPosition) {
        const retorno = { sid: socket.id, x: char.x, y: char.y };
        socket.emit('charMoved', retorno);
        socket.to('map_' + mapId).emit('charMoved', retorno);
        socket.to('logger').emit('logg', {'type' :"charMoved", 'mapId' : mapId, "data": retorno } );
    }
}
module.exports = move;
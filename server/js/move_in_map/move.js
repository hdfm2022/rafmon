const charAppearInMap = require("../in_out_map/char_appear_in_map");
const charDisappearInMap = require("../in_out_map/char_disappear_in_map");
const tryToMoveItem = require("./try_to_move_item");

move = (socket, data) => {
    console.log("entered move function with socket");

    const velocidadeMaximaMS = 180;

    let newCharPosition = false;
    let collisionResult = false;
    let mapId = mapIdsBySocketId[socket.id];

    const map = maps[mapId];
    let char = '';
    if (map && map.chars && map.chars[socket.id]) {
        char = map.chars[socket.id];
        privatechar = private_chars[socket.id];
    } else {
        return false;
    }

    if (map['kamehames'][socket.id] && map['kamehames'][socket.id].active && map['kamehames'][socket.id].stopou === false) {
        console.log("nao pode mover enquanto kame...");
        return false;
    }

    if (privatechar && privatechar.lastMoviment && Date.now() - privatechar.lastMoviment < velocidadeMaximaMS) {
        console.log("nao pode mexer tao rapido");

        if (privatechar.nextMove) {
            console.log("clear");
            clearTimeout(privatechar.nextMove);
        } 

        privatechar.nextMove = setTimeout( () => { move(socket, data); }, velocidadeMaximaMS - Date.now() - char.lastMoviment )

        return false;
    }
    privatechar.lastMoviment = Date.now();

    if (!char) {
        console.log("problema");
        console.log("map", map);
        return true;
    }

    if (data.key == "ArrowRight") {
        collisionResult = collisionDetection(map, char.x + 1, char.y);
        if (char.x < 25 && collisionResult === false) {
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

            charDisappearInMap(mapId, socket);

            mapId = portal.nextMap;
            if (data.key == "ArrowRight") char.x += 2;
            if (data.key == "ArrowLeft")  char.x -= 2;
            if (data.key == "ArrowDown")  char.y += 2;
            if (data.key == "ArrowUp")    char.y -= 2;
            
            charAppearInMap(mapId, socket, char);
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
        private_chars[socket.id].ki++;
        char.actualPosition = data.key;

        const retorno = { sid: socket.id, x: char.x, y: char.y, key: data.key };
        socket.emit('charMoved', retorno);
        socket.to('map_' + mapId).emit('charMoved', { retorno, ki: private_chars[socket.id].ki } );
        socket.to('logger').emit('logg', {'type' :"charMoved", 'mapId' : mapId, "data": retorno } );
    }
}
module.exports = move;

const move = require('../move_in_map/move');

function chatMessage(socket, data) {
    console.log("chat", data);
    if (data.message.substr(0, 1) == "_") {
        console.log("is admin command");
        const words = data.message.split(' ');
        switch (words[0]) {
            case "_goto":
                console.log("goto admin");
                if (words.length == 2) {
                    console.log("goto admin words ok");
                    const coordinates = words[1].split(",");
                    if (coordinates.length == 3) {
                        console.log("goto admin all good");
                        let mapId = mapIdsBySocketId[socket.id];

                        const map = maps[mapId];
                        let char = '';
                        if (map && map.chars && map.chars[socket.id]) {
                            char = map.chars[socket.id];
                            privatechar = private_chars[socket.id];
                        } else {
                            return false;
                        }

                        char.x = coordinates[1];
                        char.y = coordinates[2];
                        const key = "ArrowUp";

                        const retorno = { sid: socket.id, x: char.x, y: char.y, key: data.key };
                        socket.to('map_' + mapId).emit('charMoved', retorno);
                        socket.to('logger').emit('logg', { 'type': "charMoved", 'mapId': mapId, "data": retorno });

                        retorno.ki = private_chars[socket.id].ki;
                        socket.emit('charMoved', retorno);
                    }
                }
                break;
        }

    }
}


module.exports = chatMessage;
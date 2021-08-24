dance = (socket, data) => {
    console.log("entered dance function with socket");

    let mapId = mapIdsBySocketId[socket.id];

    const map = maps[mapId];
    const char = map.chars[socket.id];

    if (map['kamehames'][socket.id] && map['kamehames'][socket.id].active && map['kamehames'][socket.id].stopou === false) {
        console.log("nao pode mover enquanto kame...");
        return false;
    }


        char.actualPosition = data.key;

        const retorno = { sid: socket.id, x: char.x, y: char.y, key: data.key };
        socket.emit('charMoved', retorno);
        socket.to('map_' + mapId).emit('charMoved', retorno);
        socket.to('logger').emit('logg', {'type' :"charMoved", 'mapId' : mapId, "data": retorno } );
}
module.exports = dance;
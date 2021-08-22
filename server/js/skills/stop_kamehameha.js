stopKamehame = (socket) => {
    const mapId = mapIdsBySocketId[socket.id];
    const map = maps[mapId];

    const skill = {
        'sid': socket.id
    }
    //socket.emit('stoptKamehame', skill);
    //socket.to('map_' + mapId).emit('stoptKamehame', skill);

    map['kamehames'][socket.id].stopou = true;
}

module.exports = stopKamehame;
startKamehame = (socket) => {
    const mapId = mapIdsBySocketId[socket.id];
    const map = maps[mapId];
    const char = map['chars'][socket.id]

    char.kame_start = Date.now()

    const skill = {
        'sid': socket.id
    }
    socket.emit('startKamehame', skill);
    socket.to('map_' + mapId).emit('startKamehame', skill);
}

module.exports = startKamehame;
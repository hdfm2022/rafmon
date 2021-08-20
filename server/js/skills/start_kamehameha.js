startKamehame = (socket) => {
    const mapId = mapIdsBySocketId[socket.id];

    const skill = {
        'sid': socket.id
    }
    socket.emit('startKamehame', skill);
    socket.to('map_' + mapId).emit('startKamehame', skill);
}

module.exports = startKamehame;
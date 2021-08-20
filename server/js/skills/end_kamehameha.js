
endKamehame = (socket) => {
    const mapId = mapIdsBySocketId[socket.id];

    const skill = {
        'sid': socket.id
    }
    socket.emit('endKamehame', skill);
    socket.to('map_' + mapId).emit('endKamehame', skill);
}
module.exports = endKamehame;
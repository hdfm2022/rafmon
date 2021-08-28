endKamehame = (socket) => {
    const mapId = mapIdsBySocketId[socket.id];
    const map = maps[mapId];
    const char = map['chars'][socket.id];

    const kamehame = map['kamehames'][socket.id];
    if (!kamehame) {
        console.log("nao encontrou kamehame, blz...");
        // return false;
    } else {
        if (kamehame.stopou === false) {
            console.log("nao pode parar");
            return false;
        }
    }

    const skill = {
        'sid': socket.id
    }
    socket.emit('endKamehame', skill);
    socket.to('map_' + mapId).emit('endKamehame', skill);
}
module.exports = endKamehame;
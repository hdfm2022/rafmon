startKamehame = (socket) => {
    const mapId = mapIdsBySocketId[socket.id];
    const map = maps[mapId];
    const char = map['chars'][socket.id]

    if ((map['kamehames'][socket.id] && map['kamehames'][socket.id].active) || char.kame_start) {
        console.log("nao pode starter novo kame");
        return false;
    }

    // if (map['kamehames'][socket.id]) {
    //     console.log("nao pode começar outro kamehameha");
    //     return false;
    // } else {
    char.kame_start = Date.now()

    const skill = {
        'sid': socket.id
    }
    socket.emit('startKamehame', skill);
    socket.to('map_' + mapId).emit('startKamehame', skill);
    // }
}

module.exports = startKamehame;
startKamehame = (socket) => {
    const mapId = mapIdsBySocketId[socket.id];
    const map = maps[mapId];
    const char = map['chars'][socket.id]

    if ((map['kamehames'][socket.id] && map['kamehames'][socket.id].active) || char.kame_start) {
        console.log("nao pode starter novo kame");
        return false;
    }


    if (private_chars[socket.id].ki >= 30) {
        char.kame_start = Date.now();

        const skill = {
            'sid': socket.id
        }
        socket.emit('startKamehame', skill);
        socket.to('map_' + mapId).emit('startKamehame', skill);
    } else {
        char.kame_start = null;
        console.log("nao tem KI pra começar novo kamehameha");
    }

    // if (map['kamehames'][socket.id]) {
    //     console.log("nao pode começar outro kamehameha");
    //     return false;
    // } else {
    // }
}

module.exports = startKamehame;
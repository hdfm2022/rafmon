const init_map = require("../init_map");

function charAppearInMap(mapId, socket, charPublicInfo) {
    const charPrivateInfo = { ...charPublicInfo };
    charPrivateInfo.experience = 0;
    charPrivateInfo.gold = 0;

    if (!maps[mapId] || maps[mapId].on == 0) {
        maps[mapId] = init_map(mapId);
    }

    maps[mapId].on++;
    console.log(maps[mapId].on, "onlines");
    maps[mapId].chars[socket.id] = charPublicInfo;

    mapIdsBySocketId[socket.id] = mapId;
    // console.log(maps);

    const infoConectado = {
        'charInfo': charPrivateInfo,
        'mapinfo': maps[mapId],
        'mapId': mapId
    }

    socket.emit('youAreConnected', infoConectado);
    socket.join('game');
    socket.to('map_' + mapId).emit('newCharIsHere', charPublicInfo);
    socket.join('map_' + mapId);
}

module.exports = charAppearInMap;
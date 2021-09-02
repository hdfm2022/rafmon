const init_map = require("../init_map");

function charAppearInMap(mapId, socket, charPublicInfo) {
    // const charPrivateInfo = { ...charPublicInfo };
    // charPrivateInfo.experience = 0;
    // charPrivateInfo.gold = 0;

    const privatechar = private_chars[socket.id];;

    if (!maps[mapId] || maps[mapId].on == 0) {
        maps[mapId] = init_map(mapId);
    }

    maps[mapId].on++;
    maps[mapId].chars[socket.id] = charPublicInfo;

    mapIdsBySocketId[socket.id] = mapId;

    const infoConectado = {
        'charInfo': {
            ...charPublicInfo
            , "ki": privatechar.ki
            , "ki_max": privatechar.ki_max
        },
        'mapinfo': maps[mapId],
        'mapId': mapId
    }

    console.log(infoConectado);
    socket.emit('youAreConnected', JSON.stringify(infoConectado)); // a principio nem precisaria mais ser json, arrumei o bug circular...

    socket.join('game');
    socket.to('map_' + mapId).emit('newCharIsHere', charPublicInfo);
    socket.join('map_' + mapId);
}

module.exports = charAppearInMap;
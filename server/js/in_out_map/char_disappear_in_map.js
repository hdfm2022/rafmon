function charDisappearInMap(mapId, socket) {
    delete maps[mapId].chars[socket.id];
    socket.to('map_' + mapId).emit('charIsOutsideThisMap', { sid: socket.id });
    socket.leave('map_' + mapId);

    maps[mapId].on--;
}

module.exports = charDisappearInMap;
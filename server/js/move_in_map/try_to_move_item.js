
function tryToMoveItem(mapId, itemId, movimentTried, socket, map) {
    let newItemPosition = false;

    const item = map.items[itemId];

    if (movimentTried == "ArrowRight") {
        collisionResult = collisionDetection(map, item.x + 1, item.y);
        if (item.x < 25 && collisionResult === false) {
            item.x++;
            newItemPosition = true;
        }
    }
    if (movimentTried == "ArrowLeft") {
        collisionResult = collisionDetection(map, item.x - 1, item.y);
        if (item.x > 1 && collisionResult === false) {
            item.x--;
            newItemPosition = true;
        }
    }
    if (movimentTried == "ArrowDown") {
        collisionResult = collisionDetection(map, item.x, item.y + 1);
        if (item.y < 15 && collisionResult === false) {
            item.y++;
            newItemPosition = true;
        }
    }
    if (movimentTried == "ArrowUp") {
        collisionResult = collisionDetection(map, item.x, item.y - 1);
        if (item.y > 1 && collisionResult === false) {
            item.y--;
            newItemPosition = true;
        }
    }

    if (collisionResult === true) {
        // para garantir os puzzles, se der colisão com pessoas, tem que fazer sumir o puzzle.
        item.status = "vanished";
        item.x = -1;
        item.y = -1;
        const retorno = { id: itemId };

        socket.emit('itemVanished', retorno);
        socket.to('map_' + mapId).emit('itemVanished', retorno);

        // item.status = "broked";
        // const retorno = { id: itemId };

        // socket.emit('itemBroked', retorno);
        // socket.to('map_' + mapId).emit('itemBroked', retorno);
    }

    if (newItemPosition) {
        const retorno = { id: itemId, x: item.x, y: item.y };
        socket.emit('itemMoved', retorno);
        socket.to('map_' + mapId).emit('itemMoved', retorno);

        setTimeout(() => {
            tryToMoveItem(mapId, itemId, movimentTried, socket, map)
        }, 200);
    } else {
        // check if switch is closed

        let testAllStones = false;

        map.floors.forEach(floor => {
            if (floor.type == "switch") {
                if (item.x == floor.x && item.y == floor.y) {
                    testAllStones = true;
                    console.log("closing...");
                    maps[mapId].items[itemId].status = "closed";

                    const retorno = { id: itemId };
                    socket.emit('itemClosed', retorno);
                    socket.to('map_' + mapId).emit('itemClosed', retorno);
                }
            }
        });

        if (testAllStones) {
            let closedRightNow = 0;
            map.items.forEach(item => {
                if (item.type == "stone") {
                    if (item.status == "closed") {
                        closedRightNow++;
                    }
                }
            });

            if (maps[mapId].switches === closedRightNow) {
                if (maps[mapId].onFinishSwitchs) {
                    maps[mapId].floors.push(maps[mapId].onFinishSwitchs);
                    const retorno = { id : maps[mapId].floors.length - 1, floor: maps[mapId].onFinishSwitchs };
                    socket.emit('newFloorAppeared', retorno);
                    socket.to('map_' + mapId).emit('newFloorAppeared', retorno);
                    maps[mapId].onFinishSwitchs = null;
                }
            }
        }
    }
    return newItemPosition;
}

module.exports = tryToMoveItem;

function tryToMoveItem(mapId, itemId, movimentTried, socket, map) {
    let newItemPosition = false;

    const item = map.items[itemId];

    if (movimentTried == "ArrowRight") {
        collisionResult = collisionDetection(map, item.x + 1, item.y);
        if (item.x < 20 && collisionResult === false) {
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
        item.status = "broked";
        const retorno = { id: itemId };

        socket.emit('itemBroked', retorno);
        socket.to('map_' + mapId).emit('itemBroked', retorno);
    }

    if (newItemPosition) {
        const retorno = { id: itemId, x: item.x, y: item.y };
        socket.emit('itemMoved', retorno);
        socket.to('map_' + mapId).emit('itemMoved', retorno);

        setTimeout(() => {
            tryToMoveItem(mapId, itemId, movimentTried, socket, map)
        }, 200);
    }
}

module.exports = tryToMoveItem;
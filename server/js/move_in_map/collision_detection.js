collisionDetection = (mapInfo, newX, newY, special = "") => {
    if (newX > 20) {
        return { type: 'map_collision' };
    }

    if (newY > 15) {
        return { type: 'map_collision' };
    }

    for (const [key, otherChar] of Object.entries(mapInfo.chars)) {
        if (otherChar.y == newY && otherChar.x == newX) {
            return true;
        }
    };

    for (const [key, item] of Object.entries(mapInfo.items)) {
        if (item.y == newY && item.x == newX) {
            return { type: 'item_collision', item: key };
        }
    };

    for (const [key, item] of Object.entries(mapInfo.big)) {
        if ( special !== "fly" || (item.type !== "water" && item.type !== "red_water") ) {
            console.log("special", special, "fly", item.type);
            if (item.y1 <= newY && item.y2 >= newY && item.x1 <= newX && item.x2 >= newX) {
                console.log("big_colission");
                return { type: 'big_collision', id: key };
            }
        }
    };

    for (const [key, floor] of Object.entries(mapInfo.floors)) {
        if (floor.type == "portal" && floor.y == newY && floor.x == newX) {
            console.log("portal-collision");
            return { type: 'portal_collision', floor: key };
        }
    };
    return false;
}

module.exports = collisionDetection;
collisionDetection = (mapInfo, newX, newY) => {
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

    for (const [key, floor] of Object.entries(mapInfo.floors)) {
        if (floor.type == "portal" && floor.y == newY && floor.x == newX) {
            console.log("portal-collision");
            return { type: 'portal_collision', floor: key };
        }
    };
    return false;
}

module.exports = collisionDetection;
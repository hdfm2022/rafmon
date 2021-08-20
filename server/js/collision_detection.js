collisionDetection = (mapInfo, newX, newY) => {
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
    return false;
}

module.exports = collisionDetection;
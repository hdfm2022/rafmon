collisionDetection = (mapInfo, newX, newY) => {
    for (const [key, otherChar] of Object.entries(mapInfo.chars)) {
        if (otherChar.y == newY && otherChar.x == newX) {
            return true;
        }
    };
    return false;
}

module.exports = collisionDetection;
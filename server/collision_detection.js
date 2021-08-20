


class CollisionDetection {
    check(mapInfo, newX, newY) {
        for (const [key, element] of Object.entries(mapInfo.chars)) {
            if (element.y == newY && element.x == (newX)) {
                console.log("teste");
                return true;
            }
        };
        return false;
    }
}

module.exports = CollisionDetection;
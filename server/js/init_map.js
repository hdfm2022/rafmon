function init_map(mapId) {
    switch (mapId) {
        case 1:
            return {
                on:0, chars: {}, items: [
                    { type: 'stone.png', x: 6, y: 6 }
                    , { type: 'stone.png', x: 8, y: 12 }
                ]
            };
        default:
            return {
                on:0, chars: {}, items: []
            };
    }
}
module.exports = init_map;
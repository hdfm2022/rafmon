function init_map(mapId) {
    switch (mapId) {
        case 1:
            return {
                  on:0
                , chars: {}
                , items: [
                    { type: 'stone', x: 6, y: 6, status: "" }
                    , { type: 'stone', x: 8, y: 12, status: "" }
                ] 
                , floors: [
                      { type: 'switch', x: 8, y: 15, status: "" }
                    , { type: 'switch', x: 20, y: 6, status: "" }
                ]
            };
        default:
            return {
                on:0, chars: {}, items: []
            };
    }
}
module.exports = init_map;
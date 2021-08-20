function init_map(mapId) {
    switch (mapId) {
        case 1:
            return {
                on: 0
                , chars: {}
                , items: [

                ]
                , floors: [
                    { type: 'portal', x: 20, y: 1, status: "", nextMap: 2, nextX: 2, nextY: 1 }
                ]
            };
        case 2:
            return {
                on: 0
                , chars: {}
                , items: [
                      { type: 'stone', x: 6, y: 6, status: "" }
                    , { type: 'stone', x: 8, y: 12, status: "" }
                ]
                , floors: [
                      { type: 'portal', x: 1, y: 1, nextMap: 1, nextX: 19, nextY: 1 }
                    , { type: 'switch', x: 8, y: 15, status: "" }
                    , { type: 'switch', x: 20, y: 6, status: "" }
                ], onFinishSwitchs: 
                    { type: 'portal', x: 9, y: 15, nextMap: 3, nextX: 9, nextY: 2 }
            };
        case 3:
            return {
                on: 0, chars: {}, items: []
                , floors: [
                      { type: 'portal', x: 9, y: 1, nextMap: 2, nextX: 9, nextY: 14 }
                ]
            };
        default:
            return {
                on: 0, chars: {}, items: []
                , floors: [

                ]
            };
    }
}
module.exports = init_map;
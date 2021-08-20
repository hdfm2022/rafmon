function init_map(mapId) {
    switch (mapId) {
        case 1:
            return {
                on: 0
                , chars: {}
                , items: [

                ]
                , floors: [
                    { type: 'portal', x: 5, y: 2, status: "", nextMap: 2 }
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
                      { type: 'portal', x: 5, y: 2, nextMap: 1 }
                    , { type: 'switch', x: 8, y: 15, status: "" }
                    , { type: 'switch', x: 20, y: 6, status: "" }
                ], onFinishSwitchs: 
                    { type: 'portal', x: 9, y: 13, nextMap: 3 }
            };
        case 3:
            return {
                on: 0, chars: {}, items: []
                , floors: [
                      { type: 'portal', x: 9, y: 13, nextMap: 2 }
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
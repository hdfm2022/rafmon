function init_map(mapId) {
    const baseMap = { kamehames: [], on: 0, chars: {}, big: [] };
    switch (mapId) {
        case 1:
            return {
                ...baseMap
                , items: [

                ]
                , floors: [
                    { type: 'portal', x: 4, y: 1, status: "", nextMap: 2 },
                    { type: 'portal', x: 10, y: 3, status: "", nextMap: 4 },
                ]
                , big: [
                    { type: 'blocked', x1: 6, y1: 1, x2: 7, y2: 1 },
                    { type: 'blocked', x1: 3, y1: 8, x2: 7, y2: 8 },
                    { type: 'red_water', x1: 3, y1: 2, x2: 7, y2: 7 },
                    { type: 'water', x1: 1, y1: 9, x2: 20, y2: 15 },
                ]
            };
        case 2:
            return {
                ...baseMap
                , items: [
                    { type: 'stone', x: 6, y: 6, status: "" },
                    { type: 'stone', x: 6, y: 12, status: "" },
                    { type: 'stone', x: 8, y: 12, status: "" },
                    { type: 'stone', x: 16, y: 12, status: "" },
                    { type: 'stone', x: 18, y:  4, status: "" },
                ]
                , floors: [
                    { type: 'portal', x: 4, y: 1, nextMap: 1 },
                    { type: 'switch', x: 8, y: 15, status: "" },
                    { type: 'switch', x:  1, y: 4, status: "" },
                    { type: 'switch', x:  7, y: 1, status: "" },
                    { type: 'switch', x: 20, y: 5, status: "" },
                    { type: 'switch', x: 20, y: 12, status: "" },
                ], onFinishSwitchs:
                    { type: 'portal', x: 11, y: 15, nextMap: 3 }
                , big: [
                    { type: 'blocked', x1: 6, y1: 3, x2: 6, y2: 3 },
                    { type: 'blocked', x1: 4, y1: 2, x2: 4, y2: 2 },

                    { type: 'blocked', x1: 12, y1: 8, x2: 20, y2: 8 },
                    { type: 'water', x1: 12, y1: 9, x2: 15, y2: 15 },
                ]
            };
        case 3:
            return {
                ...baseMap
                , items: []
                , floors: [
                    { type: 'portal', x: 9, y: 13, nextMap: 2 }
                ]
            };
        default:
            return {
                ...baseMap
                , items: []
                , floors: [

                ]
            };
    }
}
module.exports = init_map;
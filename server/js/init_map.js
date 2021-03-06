function init_map(mapId) {
    const baseMap = { song: 'dragon_ball_1.mp3', kamehames: [], on: 0, chars: {}, big: [] };
    switch (mapId) {
        case 1:
            return {
                ...baseMap
                , items: [
                    { type: 'stone', x: 9, y: 7, status: "" },
                    { type: 'stone', x: 24, y: 7, status: "" },
                ]
                , switches: 2
                , floors: [
                    // { type: 'portal', x: 1, y: 4, nextMap: 6 }, // apenas para debug...
                    { type: 'portal', x: 4, y: 1, nextMap: 2 },
                    { type: 'portal', x: 2, y: 2, nextMap: 5 },
                    { type: 'portal', x: 20, y: 2, nextMap: 5 },
                    { type: 'portal', x: 24, y: 14, nextMap: 6 },
                    { type: 'switch', x: 15, y: 8 },
                    { type: 'switch', x: 16, y: 8 },
                ]
                , onFinishSwitchs:
                    { type: 'portal', x: 24, y: 8, nextMap: 3 }
                , big: [
                    { type: 'blocked', x1: 6, y1: 1, x2: 7, y2: 1 },
                    { type: 'blocked', x1: 4, y1: 8, x2: 7, y2: 8 },
                    { type: 'red_water', x1: 4, y1: 2, x2: 7, y2: 7 },
                    { type: 'water', x1: 1, y1: 9, x2: 25, y2: 12 },
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
                    { type: 'stone', x: 18, y: 4, status: "" },
                ]
                , switches: 5
                , floors: [
                    { type: 'portal', x: 4, y: 1, nextMap: 1 },
                    { type: 'switch', x: 8, y: 15 },
                    { type: 'switch', x: 1, y: 4 },
                    { type: 'switch', x: 7, y: 1 },
                    { type: 'switch', x: 25, y: 5 },
                    { type: 'switch', x: 25, y: 12, },
                ], onFinishSwitchs:
                    { type: 'portal', x: 10, y: 14, nextMap: 3 }
                , big: [
                    { type: 'blocked', x1: 6, y1: 3, x2: 6, y2: 3 },
                    { type: 'blocked', x1: 4, y1: 2, x2: 4, y2: 2 },

                    // { type: 'blocked', x1: 12, y1: 8, x2: 20, y2: 8 },
                    { type: 'water', x1: 12, y1: 9, x2: 15, y2: 15 },
                ]
            };
        case 3:
            return {
                ...baseMap
                , items: [
                    { type: 'stone', x: 18, y: 1, status: "" },
                ]
                , switches: 1
                , onFinishSwitchs:
                    { type: 'portal', x: 2, y: 2, nextMap: 6 }
                , floors: [
                    { type: 'portal', x: 10, y: 14, nextMap: 2 },
                    { type: 'portal', x: 24, y: 8, nextMap: 1 },
                    { type: 'switch', x: 1, y: 1, status: "" },
                ]
                , big: [
                    { type: 'water', x1: 19, y1: 1, x2: 21, y2: 15 },
                ]
            };
        case 5:
            return {
                ...baseMap
                , song: "goof_halmet.mp3"
                , items: [
                    { type: 'stone', x: 20, y: 7, status: "" },
                    { type: 'stone', x: 17, y: 9, status: "" },
                    { type: 'stone', x: 20, y: 10, status: "" },
                    { type: 'stone', x: 17, y: 11, status: "" },
                    { type: 'stone', x: 17, y: 12, status: "" },


                    { type: 'stone', x: 9, y: 7, status: "" },
                    { type: 'stone', x: 6, y: 9, status: "" },
                    { type: 'stone', x: 9, y: 10, status: "" },
                    { type: 'stone', x: 6, y: 11, status: "" },
                    { type: 'stone', x: 6, y: 12, status: "" },
                ]
                , switches: 4
                , floors: [
                    { type: 'portal', x: 2, y: 2, nextMap: 1 },

                    { type: 'switch', x: 15, y: 5 },
                    { type: 'switch', x: 22, y: 5 },

                    { type: 'switch', x: 4, y: 5 },
                    { type: 'switch', x: 11, y: 5 },
                ], onFinishSwitchs:
                    { type: 'portal', x: 20, y: 2, nextMap: 1 }
                , big: [


                    { type: 'blocked', x1: 2, y1: 4, x2: 2, y2: 13 },
                    { type: 'blocked', x1: 3, y1: 13, x2: 12, y2: 13 },
                    // { type: 'blocked', x1: 1, y1: 4, x2: 10, y2: 12 },

                    { type: 'blocked', x1: 3, y1: 4, x2: 6, y2: 4 },
                    { type: 'blocked', x1: 11, y1: 4, x2: 12, y2: 4 },
                    { type: 'blocked', x1: 3, y1: 5, x2: 3, y2: 5 },
                    { type: 'blocked', x1: 5, y1: 5, x2: 5, y2: 5 },
                    // { type: 'blocked', x1: 10, y1: 5, x2: 10, y2: 5 },

                    { type: 'blocked', x1: 12, y1: 5, x2: 12, y2: 5 },
                    { type: 'blocked', x1: 7, y1: 8, x2: 8, y2: 9 },

                    { type: 'blocked', x1: 14, y1: 13, x2: 23, y2: 13 },
                    { type: 'blocked', x1: 13, y1: 4, x2: 13, y2: 13 },

                    { type: 'blocked', x1: 14, y1: 4, x2: 17, y2: 4 },
                    { type: 'blocked', x1: 20, y1: 4, x2: 23, y2: 4 },
                    { type: 'blocked', x1: 14, y1: 5, x2: 14, y2: 5 },
                    { type: 'blocked', x1: 16, y1: 5, x2: 16, y2: 5 },
                    { type: 'blocked', x1: 21, y1: 5, x2: 21, y2: 5 },
                    // { type: 'blocked', x1: 23, y1: 5, x2: 23, y2: 5 }, // retirado para deixar os 2 puzzles dierentes...
                    { type: 'blocked', x1: 18, y1: 8, x2: 19, y2: 9 },

                    { type: 'blocked', x1: 24, y1: 4, x2: 24, y2: 13 },

                    // colocados dps, pra impedir que se fa??a do mesmo jeito as 2 solu????es...
                    { type: 'blocked', x1: 11, y1: 10, x2: 11, y2: 10 },
                ]
            };
        case 6:
            return {
                ...baseMap
                , items: [
                    // { type: 'stone', x: 18, y: 1, status: "" },
                ]
                // , switches: 1
                // , onFinishSwitchs:
                //     { type: 'portal', x: 2, y: 2, nextMap: 6 }
                , floors: [
                    { type: 'portal', x: 2, y: 2, nextMap: 3 },
                    { type: 'portal', x: 24, y: 14, nextMap: 1 },
                    // { type: 'portal', x: 2, y: 2, nextMap: 3 }
                ]
                , big: [
                    { type: 'water', x1: 2, y1: 8, x2: 25, y2: 10 },
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
global.maps = [];
global.mapIdsBySocketId = [];

const express = require('express');
const path = require('path');
const collisionDetection = require('./server/js/move_in_map/collision_detection');
const init_map = require('./server/js/init_map');
const charAppearInMap = require('./server/js/in_out_map/char_appear_in_map');
const charDisappearInMap = require('./server/js/in_out_map/char_disappear_in_map');
const tryToMoveItem = require('./server/js/move_in_map/try_to_move_item');

const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);

app.use(express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, 'public'));
app.engine('html', require('ejs').renderFile);
app.set('view.engine', 'html');

app.use('/', (req, res) => {
    res.render('index.html');
});

io.on('connection', socket => {
    console.log(`socket conectado ${socket.id}`);

    socket.on('move', data => {
        let newCharPosition = false;
        let collisionResult = false;
        let mapId = mapIdsBySocketId[socket.id];

        const map = maps[mapId];
        const char = map.chars[socket.id];

        if (!char) {
            console.log("problema");
            console.log("map", map);
            return true;
        }

        if (data.key == "ArrowRight") {
            collisionResult = collisionDetection(map, char.x + 1, char.y);
            if (char.x < 20 && collisionResult === false) {
                char.x++;
                newCharPosition = true;
            }
        }
        if (data.key == "ArrowLeft") {
            collisionResult = collisionDetection(map, char.x - 1, char.y);
            if (char.x > 1 && collisionResult === false) {
                char.x--;
                newCharPosition = true;
            }
        }
        if (data.key == "ArrowDown") {
            collisionResult = collisionDetection(map, char.x, char.y + 1);
            if (char.y < 15 && collisionResult === false) {
                char.y++;
                newCharPosition = true;
            }
        }
        if (data.key == "ArrowUp") {
            collisionResult = collisionDetection(map, char.x, char.y - 1);
            if (char.y > 1 && collisionResult === false) {
                char.y--;
                newCharPosition = true;
            }
        }

        if (collisionResult instanceof Object) {
            if (collisionResult.type == "portal_collision") {
                const portal = map.floors[collisionResult.floor];
                const charPublicInfo = map.chars[socket.id];

                charDisappearInMap(mapId, socket);

                mapId = portal.nextMap;
                char.x = portal.nextX;
                char.y = portal.nextY;
                
                charAppearInMap(mapId, socket, charPublicInfo);
            }
            if (collisionResult.type == "item_collision") {
                if (map.items[collisionResult.item].type == "stone") {
                    if (map.items[collisionResult.item].status == "") {
                        tryToMoveItem(mapId, collisionResult.item, data.key, socket, map);
                    }
                }
            }
        }

        if (newCharPosition) {
            const retorno = { sid: socket.id, x: char.x, y: char.y };
            socket.emit('charMoved', retorno);
            socket.to('map_' + mapId).emit('charMoved', retorno);
        }
    });


    socket.on('disconnect', () => {
        console.log(`> Player disconnected: ${socket.id}`)
        try {
            const mapId = mapIdsBySocketId[socket.id];
            if (mapId) {
                if (maps[mapId].chars[socket.id]) {
                    delete maps[mapId].chars[socket.id];
                    delete mapIdsBySocketId[socket.id];
                    socket.to('map_' + mapId).emit('charIsOutsideThisMap', { sid: socket.id });

                    maps[mapId].on--;
                } 
            }
        } catch (er) {
            console.log(er);
        }
    })

    socket.on('sendLogin', data => {
        const charPublicInfo = {
            sid: socket.id,
            login: data.username,
            nivel: 1,
            x: 1,
            y: 1,
        }
        charAppearInMap(1, socket, charPublicInfo);

        // const charPublicInfo = {
        //     sid: socket.id,
        //     login: data.username,
        //     nivel: 1,
        //     x: Math.ceil(Math.random() * 5),
        //     y: Math.ceil(Math.random() * 5),
        // }

        // const mapId = 1;

        // const charPrivateInfo = { ...charPublicInfo };
        // charPrivateInfo.experience = 0;
        // charPrivateInfo.gold = 0;

        // if (maps[mapId].on == 0) {
        //     maps[mapId] = init_map(mapId);
        // }

        // maps[mapId].on++;
        // console.log(maps[mapId].on, "onlines");
        // maps[mapId].chars[socket.id] = charPublicInfo;

        // const infoConectado = {
        //     'charInfo': charPrivateInfo,
        //     'mapinfo': maps[mapId]
        // }

        // socket.emit('youAreConnected', infoConectado);
        // socket.join('game');
        // socket.to('map_' + mapId).emit('newCharIsHere', charPublicInfo);
        // socket.join('map_' + mapId);
    });

});



server.listen(3001);
console.log("server is live - 3001");
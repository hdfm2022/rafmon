const express = require('express');
const path = require('path');
const collisionDetection = require('./server/js/collision_detection');
const init_map = require('./server/js/init_map');

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

console.log("server is live");

var maps = [];
maps[1] = init_map(1);

io.on('connection', socket => {
    console.log(`socket conectado ${socket.id}`);

    socket.on('move', data => {
        let newCharPosition = false;
        let collisionResult = false;
        const mapId = data.mapId;

        const char = maps[data.mapId].chars[socket.id];

        if (data.key == "ArrowRight") {
            collisionResult = collisionDetection(maps[mapId], char.x + 1, char.y);
            if (char.x < 20 && collisionResult === false) {
                char.x++;
                newCharPosition = true;
            }
        }
        if (data.key == "ArrowLeft") {
            collisionResult = collisionDetection(maps[mapId], char.x - 1, char.y);
            if (char.x > 1 && collisionResult === false) {
                char.x--;
                newCharPosition = true;
            }
        }
        if (data.key == "ArrowDown") {
            collisionResult = collisionDetection(maps[mapId], char.x, char.y + 1);
            if (char.y < 15 && collisionResult === false) {
                char.y++;
                newCharPosition = true;
            }
        }
        if (data.key == "ArrowUp") {
            collisionResult = collisionDetection(maps[mapId], char.x, char.y - 1);
            if (char.y > 1 && collisionResult === false) {
                char.y--;
                newCharPosition = true;
            }
        }

        if (collisionResult instanceof Object) {
            if (collisionResult.type == "item_collision") {
                if (maps[mapId].items[collisionResult.item].type == "stone.png") {
                    tryToMoveItem(mapId, collisionResult.item, data.key);
                }
            }
        }

        if (newCharPosition) {
            const retorno = { sid: socket.id, x: char.x, y: char.y };
            socket.emit('charMoved', retorno );
            socket.to('map_'+mapId).emit('charMoved', retorno);
        }
    });

    function tryToMoveItem(mapId, itemId, movimentTried) {
        let newItemPosition = false;

        const item = maps[mapId].items[itemId];

        if (movimentTried == "ArrowRight") {
            collisionResult = collisionDetection(maps[mapId], item.x + 1, item.y);
            if (item.x < 20 && collisionResult === false) {
                item.x++;
                newItemPosition = true;
            }
        }
        if (movimentTried == "ArrowLeft") {
            collisionResult = collisionDetection(maps[mapId], item.x - 1, item.y);
            if (item.x > 1 && collisionResult === false) {
                item.x--;
                newItemPosition = true;
            }
        }
        if (movimentTried == "ArrowDown") {
            collisionResult = collisionDetection(maps[mapId], item.x, item.y + 1);
            if (item.y < 15 && collisionResult === false) {
                item.y++;
                newItemPosition = true;
            }
        }
        if (movimentTried == "ArrowUp") {
            collisionResult = collisionDetection(maps[mapId], item.x, item.y - 1);
            if (item.y > 1 && collisionResult === false) {
                item.y--;
                newItemPosition = true;
            }
        }

        if (newItemPosition) {
            const retorno = { id: itemId, x: item.x, y: item.y };
            socket.emit('itemMoved', retorno );
            socket.to('map_'+mapId).emit('itemMoved', retorno);

            setTimeout(() => {
                tryToMoveItem(mapId, itemId, movimentTried)
            }, 200);
        }
    }

    socket.on('disconnect', () => {
        console.log(`> Player disconnected: ${socket.id}`)
        try {
            const mapId = 1;
            if (maps[mapId].chars[socket.id]) {
                delete maps[mapId].chars[socket.id];
                socket.to('map_'+mapId).emit('charIsOffline', {sid : socket.id } );
                
                maps[mapId].on--;
                console.log(maps[mapId].on, "onlines");
            }
        } catch(er) {
            console.log(er);
        }
        
    })

    socket.on('sendLogin', data => {
        const charPublicInfo = {
            sid:    socket.id,
            login:  data.username,
            nivel:  1,
            x:      Math.ceil(Math.random() * 5),
            y:      Math.ceil(Math.random() * 5),
        }

        const mapId = 1;

        const charPrivateInfo = { ... charPublicInfo };
        charPrivateInfo.experience = 0;
        charPrivateInfo.gold = 0;

        if (maps[mapId].on == 0) {
            maps[mapId] = init_map(mapId);
        }

        maps[mapId].on++;
        console.log(maps[mapId].on, "onlines");
        maps[mapId].chars[socket.id] = charPublicInfo;

        const infoConectado = {
            'charInfo': charPrivateInfo,
            'mapinfo':  maps[mapId]
        }

        socket.emit('youAreConnected', infoConectado);
        socket.join('game');
        socket.to('map_'+mapId).emit('newCharIsHere', charPublicInfo);
        socket.join('map_'+mapId);
    });

});



server.listen(3001);
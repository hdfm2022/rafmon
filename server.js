const express = require('express');
const path = require('path');
const CollisionDetection = require('./server/collision_detection');

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

const messages = [];
const chars = [];
const maps = [];
maps[1] = { chars: {} };

const collisionDetection = new CollisionDetection(chars);

io.on('connection', socket => {
    console.log(`socket conectado ${socket.id}`);

    socket.on('move', data => {
        let collision = false;

        const char = maps[data.mapId].chars[socket.id];

        console.log("move", data);
        if (data.key == "ArrowRight") {
            if (char.x < 20 && !collisionDetection.check(maps[data.mapId], char.x + 1, char.y)) {
                char.x++;
            }
        }
        if (data.key == "ArrowLeft") {
            if (char.x > 1 && !collisionDetection.check(maps[data.mapId], char.x - 1, char.y)) {
                char.x--;
            }
        }
        if (data.key == "ArrowDown") {
            if (char.y < 15 && !collisionDetection.check(maps[data.mapId], char.x, char.y + 1)) {
                char.y++;
            }
        }
        if (data.key == "ArrowUp") {
            if (char.y > 1 && !collisionDetection.check(maps[data.mapId], char.x, char.y - 1)) {
                char.y--;
            }
        }

        if (!collision) {
            const retorno = { sid: socket.id, x: char.x, y: char.y };
            console.log("moveAccept", retorno );
            socket.emit('moveAccept', retorno );
            socket.broadcast.emit('moveAccept', retorno);
        }
    });

    socket.on('disconnect', () => {
        console.log(`> Player disconnected: ${socket.id}`)
        try {
            // vou ter que armazenar a lista de maps por char, pra dar logout...
            // const charInfo = chars[socket.id];


            delete maps[1].chars[socket.id];
            console.log(maps[1].chars, "after delete");

            // if (charInfo) {
            //     console.log(`> Player estava logado`)

            //     if (findIdxInsideMap >= 0) {
            //         maps[charInfo.map].chars.splice(findIdxInsideMap, 1);
            //     }
            //     delete chars[socket.id];

            socket.broadcast.emit('offline', {sid : socket.id } );
            // } else {
            //     console.log(`> Player nem estava logado`)
            // }
            // delete chars[socket.id];
        } catch(er) {
            console.log(er);
        }
        
    })

    socket.on('sendLogin', data => {
        console.log(data);
        messages.push(data);
        const charPublicInfo = {
            sid:    socket.id,
            login:  data.username,
            nivel:  1,
            x:      Math.ceil(Math.random() * 5),
            y:      Math.ceil(Math.random() * 5),
        }

        maps[1].chars[socket.id] = charPublicInfo;

        const infoConectado = {
            'charInfo': charPublicInfo,
            'mapinfo': maps[1],
            'chars': maps[1].chars
        }

        console.log("conectado", infoConectado);

        socket.emit('conectado', infoConectado);
        socket.broadcast.emit('newConnection', charPublicInfo);
    });

});



server.listen(3001);
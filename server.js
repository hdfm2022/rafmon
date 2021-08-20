const express = require('express');
const path = require('path');
const collisionDetection = require('./server/collision_detection');

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

io.on('connection', socket => {
    console.log(`socket conectado ${socket.id}`);

    socket.on('move', data => {
        let newCharPosition = false;
        const mapId = data.mapId;

        const char = maps[data.mapId].chars[socket.id];

        if (data.key == "ArrowRight") {
            if (char.x < 20 && !collisionDetection(maps[mapId], char.x + 1, char.y)) {
                char.x++;
                newCharPosition = true;
            }
        }
        if (data.key == "ArrowLeft") {
            if (char.x > 1 && !collisionDetection(maps[mapId], char.x - 1, char.y)) {
                char.x--;
                newCharPosition = true;
            }
        }
        if (data.key == "ArrowDown") {
            if (char.y < 15 && !collisionDetection(maps[mapId], char.x, char.y + 1)) {
                char.y++;
                newCharPosition = true;
            }
        }
        if (data.key == "ArrowUp") {
            if (char.y > 1 && !collisionDetection(maps[mapId], char.x, char.y - 1)) {
                char.y--;
                newCharPosition = true;
            }
        }

        if (newCharPosition) {
            const retorno = { sid: socket.id, x: char.x, y: char.y };
            socket.emit('charMoved', retorno );
            socket.to('map_'+mapId).emit('charMoved', retorno);
        }
    });

    socket.on('disconnect', () => {
        console.log(`> Player disconnected: ${socket.id}`)
        try {
            const mapId = 1;
            delete maps[mapId].chars[socket.id];
            socket.to('map_'+mapId).emit('charIsOffline', {sid : socket.id } );
        } catch(er) {
            console.log(er);
        }
        
    })

    socket.on('sendLogin', data => {
        messages.push(data);
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

        maps[mapId].chars[socket.id] = charPublicInfo;

        const infoConectado = {
            'charInfo': charPrivateInfo,
            'mapinfo': maps[mapId]
        }

        socket.emit('youAreConnected', infoConectado);
        socket.join('game');
        socket.to('map_'+mapId).emit('newCharIsHere', charPublicInfo);
        socket.join('map_'+mapId);
    });

});



server.listen(3001);
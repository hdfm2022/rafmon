const express = require('express');
const path = require('path');

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
maps[1] = { chars: [] };

io.on('connection', socket => {
    console.log(`socket conectado ${socket.id}`);

    socket.on('move', data => {
        console.log("move", data);
        if (data.key == "ArrowRight") {
            if (chars[socket.id].x < 20) {
                chars[socket.id].x++;
            }
        }
        if (data.key == "ArrowLeft") {
            if (chars[socket.id].x > 1) {
                chars[socket.id].x--;
            }
        }
        if (data.key == "ArrowDown") {
            if (chars[socket.id].y < 15) {
                chars[socket.id].y++;
            }
        }
        if (data.key == "ArrowUp") {
            if (chars[socket.id].y > 1) {
                chars[socket.id].y--;
            }
        }
        // console.log(chars[socket.id]);

        const retorno = { sid: socket.id, x: chars[socket.id].x, y: chars[socket.id].y };
        socket.emit('moveAccept', retorno );
        socket.broadcast.emit('moveAccept', retorno);
    });

    socket.on('disconnect', () => {
        console.log(`> Player disconnected: ${socket.id}`)
        try {
            const charInfo = chars[socket.id];

            if (charInfo) {
                console.log(`> Player estava logado`)
                const findIdxInsideMap = maps[charInfo.map].chars.findIndex(element => element == socket.id);
                if (findIdxInsideMap >= 0) {
                    maps[charInfo.map].chars.splice(findIdxInsideMap, 1);
                }
                delete chars[socket.id];

                socket.broadcast.emit('offline', {sid : socket.id } );
            } else {
                console.log(`> Player nem estava logado`)
            }
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
            map:    1,
            x:      Math.ceil(Math.random() * 5),
            y:      Math.ceil(Math.random() * 5),
        }

        chars[socket.id] = charPublicInfo;

        maps[1].chars.push(socket.id);

        const othersInfo = [];
        maps[1].chars.forEach(charSocketId => {
            if (charSocketId != socket.id) {
                othersInfo.push(chars[charSocketId]);
            }
        });

        const infoConectado = {
            'charInfo': charPublicInfo,
            'mapinfo': maps[1],
            'othersInfo': othersInfo
        }

        socket.emit('conectado', infoConectado);
        socket.broadcast.emit('newConnection', charPublicInfo);
    });

});

server.listen(3001);
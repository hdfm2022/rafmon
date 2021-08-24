global.maps = [];
global.mapIdsBySocketId = [];
global.chars = [];

const express = require('express');
const path = require('path');

const collisionDetection = require('./server/js/move_in_map/collision_detection');
const charAppearInMap = require('./server/js/in_out_map/char_appear_in_map');
const charDisappearInMap = require('./server/js/in_out_map/char_disappear_in_map');
const tryToMoveItem = require('./server/js/move_in_map/try_to_move_item');
const move = require('./server/js/move_in_map/move');

// kamehameha
const startKamehame = require('./server/js/skills/start_kamehameha');
const endKamehame   = require('./server/js/skills/end_kamehameha');
const shootKamehame = require('./server/js/skills/shoot_kamehameha');
const stopKamehame  = require('./server/js/skills/stop_kamehameha');

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
    console.log(`> Socket connected: ${socket.id}`)

    socket.on('subscribeLogger', data=> {
        socket.join('logger');
    });

    socket.on('move', data => {
        move(socket, data);
    });

    socket.on('disconnect', () => {
        console.log(`> Socket disconnected: ${socket.id}`)
        try {
            const mapId = mapIdsBySocketId[socket.id];
            if (mapId) {
                console.log(`>> Player disconnected: ${socket.id}`)
                if (maps[mapId].chars[socket.id]) {
                    delete maps[mapId].chars[socket.id];
                    delete mapIdsBySocketId[socket.id];
                    const data = { sid: socket.id };
                    socket.to('map_' + mapId).emit('charIsOutsideThisMap', data);
                    socket.to('logger').emit('logg', {'type' :"charIsOutsideThisMap", 'mapId' : mapId, "data": data } );

                    maps[mapId].on--;
                } 
            }
        } catch (er) {
            console.log(er);
        }
    })

    socket.on('endKamehame', data => {
        endKamehame(socket)
    });
    socket.on('startKamehame', data => {
        startKamehame(socket)
    });
    socket.on('shootKamehame', data => {
        shootKamehame(socket)
    });
    socket.on('stopKamehame', data => {
        stopKamehame(socket)
    });

    socket.on('sendLogin', data => {
        const charPublicInfo = {
            sid: socket.id,
            login: data.username,
            nivel: 1,
            x: 1,
            y: 1,
        }
        charAppearInMap(1, socket, charPublicInfo);
    });

});



server.listen(3001);
console.log("server is live - 3001");
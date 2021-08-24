const socket = io('http://localhost:3001');
socket.emit('subscribeLogger', {});

socket.on('logg', data => {
    console.log("logg", data);
});

// teste commit no gitpod
